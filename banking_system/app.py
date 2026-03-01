import traceback
import cloudinary
import cloudinary.uploader
import resend 
import os
import random
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Request, UploadFile, File, Form, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from pydantic import BaseModel
from db import db
from utils import hash_password, verify_password, generate_account_number

# Initialize FastAPI
app = FastAPI(title="Anoop Industry Bank API", version="6.5.0-FinalVault")

# --- 🛰️ CORS CONFIGURATION ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ☁️ CLOUDINARY CONFIGURATION ---
cloudinary.config( 
    cloud_name = "dfsuat2el", 
    api_key = "811246744629417", 
    api_secret = "__akJozJOJXD4nHKB7rFG3EsZzY",
    secure = True
)

# --- 📧 RESEND CONFIGURATION ---
resend.api_key = os.environ.get("RESEND_API_KEY")

# --- 🛡️ GLOBAL ERROR HANDLER ---
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"🚨 INTERNAL SYSTEM ERROR: {str(exc)}")
    print(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "type": "server_failure",
            "message": "Institutional Vault encountered a sync error.",
            "details": str(exc) if app.debug else "Secure audit logs recorded."
        }
    )

# --- LIFECYCLE MANAGEMENT ---
@app.on_event("startup")
async def startup():
    if not db.is_connected():
        await db.connect()

@app.on_event("shutdown")
async def shutdown():
    if db.is_connected():
        await db.disconnect()

# --- REQUEST MODELS ---
class LoginRequest(BaseModel):
    email: str
    password: str

class AccountOpenRequest(BaseModel):
    userId: str
    type: str = "SAVINGS"

class TransactionRequest(BaseModel):
    accountNumber: str
    amount: float
    staffId: Optional[str] = None

class RecoveryRequest(BaseModel):
    email: str

class VerifyOTPRequest(BaseModel):
    email: str
    otp: str

class UpdateUserRequest(BaseModel):
    fullName: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    address: Optional[str] = None

# --- SYSTEM ROUTES ---
@app.get("/")
async def home():
    return {
        "status": "Anoop Industry Bank API is active", 
        "engine": "FastAPI + Resend + Prisma",
        "owner": "Anoop Prakash"
    }

# --- 🏦 AUTHENTICATION & SECURE OTP PROTOCOLS ---

@app.post("/auth/recover-vault") 
async def recover_vault(req: RecoveryRequest):
    try:
        user = await db.user.find_unique(where={'email': req.email})
        if not user:
            raise HTTPException(status_code=404, detail="Vault identity not found")

        secure_code = str(random.randint(100000, 999999))
        expiry_time = datetime.utcnow() + timedelta(minutes=5)

        await db.otp.upsert(
            where={'email': req.email},
            data={
                'create': {'email': req.email, 'code': secure_code, 'expiresAt': expiry_time},
                'update': {'code': secure_code, 'expiresAt': expiry_time}
            }
        )

        resend.Emails.send({
            "from": "Anoop Bank <onboarding@resend.dev>",
            "to": [user.email],
            "subject": "🔒 Institutional Vault Recovery Protocol",
            "html": f"<h2>Your Secure Key: {secure_code}</h2><p>Expires in 5 minutes.</p>"
        })
        return {"message": "Recovery protocol dispatched"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Email node synchronization failure")

@app.post("/auth/verify-otp")
async def verify_otp(req: VerifyOTPRequest):
    stored_otp = await db.otp.find_unique(where={'email': req.email})
    if not stored_otp or stored_otp.code != req.otp:
        raise HTTPException(status_code=401, detail="Invalid Security Key")
    
    if datetime.utcnow() > stored_otp.expiresAt:
        await db.otp.delete(where={'email': req.email})
        raise HTTPException(status_code=401, detail="Security Key has expired")

    await db.otp.delete(where={'email': req.email})
    return {"status": "verified", "message": "Access Granted"}

# --- 👥 CUSTOMER MANAGEMENT SUITE ---

@app.get("/users/customers")
async def get_all_customers():
    return await db.user.find_many(where={'role': 'CUSTOMER'})

@app.get("/users/{user_id}")
async def get_user_by_id(user_id: str):
    user = await db.user.find_unique(where={'id': user_id})
    if not user:
        raise HTTPException(status_code=404, detail="Identity not found")
    return user

@app.get("/users/profile/{user_id}")
async def get_full_profile(user_id: str):
    user = await db.user.find_unique(where={'id': user_id}, include={'accounts': True})
    if not user:
        raise HTTPException(status_code=404, detail="Identity not found")
    
    # Aggregate transactions from all accounts
    all_tx = []
    for acc in user.accounts:
        acc_with_tx = await db.account.find_unique(where={'id': acc.id}, include={'transactions': True})
        all_tx.extend(acc_with_tx.transactions)
    
    return {"user": user, "accounts": user.accounts, "transactions": sorted(all_tx, key=lambda x: x.createdAt, reverse=True)}

@app.put("/users/update/{user_id}")
async def update_user(user_id: str, req: UpdateUserRequest):
    return await db.user.update(
        where={'id': user_id},
        data={k: v for k, v in req.dict().items() if v is not None}
    )

@app.post("/register", status_code=201)
async def register(
    email: str = Form(...),
    password: str = Form(...),
    fullName: Optional[str] = Form(None),
    role: str = Form("CUSTOMER"),
    profileImage: Optional[UploadFile] = File(None)
):
    existing_user = await db.user.find_unique(where={'email': email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    image_url = None
    if profileImage:
        upload_result = cloudinary.uploader.upload(profileImage.file, folder="bank_kyc_profiles")
        image_url = upload_result.get('secure_url')

    user = await db.user.create(
        data={
            "email": email,
            "password": hash_password(password),
            "fullName": fullName or "Internal User",
            "role": role,
            "clientSign": image_url 
        }
    )
    
    # 🏦 Automatic Account Generation upon registration
    new_acc = await db.account.create(
        data={
            "accountNumber": generate_account_number(),
            "accountType": "SAVINGS",
            "balance": 0.0,
            "userId": user.id
        }
    )
    
    return {"message": "Vault Identity & Ledger Created", "user_id": user.id, "accountNumber": new_acc.accountNumber}

@app.post("/login")
async def login(req: LoginRequest):
    user = await db.user.find_unique(where={'email': req.email})
    if user and verify_password(req.password, user.password):
        return {
            "message": "Login successful",
            "user": {"id": user.id, "name": user.fullName, "role": user.role, "profileImage": user.clientSign}
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

# --- 💸 BANKING OPERATIONS ---

@app.post("/accounts/open", status_code=201)
async def open_account(req: AccountOpenRequest):
    new_account = await db.account.create(
        data={
            "accountNumber": generate_account_number(),
            "accountType": req.type, 
            "balance": 0.0,
            "userId": req.userId
        }
    )
    return {"message": "Ledger initialized", "accountNumber": new_account.accountNumber}

@app.post("/accounts/deposit")
async def deposit(req: TransactionRequest):
    account = await db.account.update(
        where={'accountNumber': req.accountNumber},
        data={'balance': {'increment': req.amount}}
    )
    await db.transaction.create(
        data={"amount": req.amount, "transactionType": "DEPOSIT", "accountId": account.id, "processedBy": req.staffId}
    )
    return {"message": "Deposit synced", "newBalance": account.balance}

@app.get("/accounts/history/{acc_num}")
async def get_history(acc_num: str):
    account = await db.account.find_unique(where={'accountNumber': acc_num}, include={'transactions': True})
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return {"balance": account.balance, "history": sorted(account.transactions, key=lambda x: x.createdAt, reverse=True)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000, reload=True)