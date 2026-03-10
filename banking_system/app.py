import traceback
import cloudinary
import cloudinary.uploader
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
app = FastAPI(title="Anoop Industry Bank API", version="6.6.0-EmailJS-Sync")

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
    cloud_name = os.environ.get("CLOUDINARY_CLOUD_NAME", "dfsuat2el"), 
    api_key = os.environ.get("CLOUDINARY_API_KEY", "811246744629417"), 
    api_secret = os.environ.get("CLOUDINARY_API_SECRET", "__akJozJOJXD4nHKB7rFG3EsZzY"),
    secure = True
)

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

class StoreOTPRequest(BaseModel): # New for EmailJS Sync
    email: str
    otp: str

class VerifyOTPRequest(BaseModel):
    email: str
    otp: str

class AccountOpenRequest(BaseModel):
    userId: str
    type: str = "SAVINGS"

class TransactionRequest(BaseModel):
    accountNumber: str
    amount: float
    staffId: Optional[str] = None

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
        "engine": "FastAPI + EmailJS + MongoDB",
        "owner": "Anoop Prakash"
    }

# --- 🏦 AUTHENTICATION & SECURE OTP PROTOCOLS ---

@app.post("/auth/store-otp") # Replaces recover-vault for EmailJS
async def store_otp(req: StoreOTPRequest):
    """Anchors the frontend-generated OTP into the secure ledger."""
    try:
        expiry_time = datetime.utcnow() + timedelta(minutes=5)
        await db.otp.upsert(
            where={'email': req.email},
            data={
                'create': {'email': req.email, 'code': req.otp, 'expiresAt': expiry_time},
                'update': {'code': req.otp, 'expiresAt': expiry_time}
            }
        )
        return {"message": "OTP synced to vault ledger"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Vault storage failure")

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
    
    all_tx = []
    for acc in user.accounts:
        acc_with_tx = await db.account.find_unique(where={'id': acc.id}, include={'transactions': True})
        all_tx.extend(acc_with_tx.transactions)
    
    return {
        "user": user, 
        "accounts": user.accounts, 
        "transactions": sorted(all_tx, key=lambda x: x.createdAt, reverse=True)
    }

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
    firstName: Optional[str] = Form(None),
    lastName: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    aadharNo: Optional[str] = Form(None),
    age: Optional[int] = Form(None),
    gender: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    profileImage: Optional[UploadFile] = File(None)
):
    try:
        existing_user = await db.user.find_unique(where={'email': email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        image_url = None
        if profileImage:
            upload_result = cloudinary.uploader.upload(profileImage.file, folder="bank_kyc_profiles")
            image_url = upload_result.get('secure_url')

        full_name = fullName or f"{firstName or ''} {lastName or ''}".strip()
        user = await db.user.create(
            data={
                "email": email,
                "password": hash_password(password),
                "fullName": full_name,
                "role": role,
                "phone": phone,
                "aadharNo": aadharNo,
                "address": address,
                "clientSign": image_url 
            }
        )
        
        # 🏦 Automatic Account Generation
        new_acc = await db.account.create(
            data={
                "accountNumber": generate_account_number(),
                "accountType": "SAVINGS",
                "balance": 0.0,
                "userId": user.id
            }
        )
        
        return {"message": "Vault Identity & Ledger Created", "user_id": user.id, "accountNumber": new_acc.accountNumber}
    except Exception as e:
        raise e

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