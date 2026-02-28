import traceback
import cloudinary
import cloudinary.uploader
from fastapi import FastAPI, HTTPException, Request, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from pydantic import BaseModel
from db import db
from utils import hash_password, verify_password, generate_account_number

# Initialize FastAPI
app = FastAPI(title="Anoop Industry Bank API", version="6.0.0-FastAPI")

# --- 🛰️ CORS CONFIGURATION ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ☁️ CLOUDINARY CONFIGURATION ---
# Professional institutional hosting credentials
cloudinary.config( 
    cloud_name = "dfsuat2el", 
    api_key = "811246744629417", 
    api_secret = "__akJozJOJXD4nHKB7rFG3EsZzY",
    secure = True
)

# --- LIFECYCLE MANAGEMENT ---
@app.on_event("startup")
async def startup():
    """Connect to Prisma on startup"""
    if not db.is_connected():
        await db.connect()

@app.on_event("shutdown")
async def shutdown():
    """Disconnect from Prisma on shutdown"""
    if db.is_connected():
        await db.disconnect()

# --- REQUEST MODELS (Pydantic Validation) ---
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

# --- SYSTEM ROUTES ---
@app.get("/")
async def home():
    return {
        "status": "Anoop Industry Bank API is active", 
        "engine": "FastAPI + Uvicorn",
        "owner": "Anoop Prakash"
    }

# --- 🏦 ENROLLMENT & AUTHENTICATION ---

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
    city: Optional[str] = Form(None),
    landmark: Optional[str] = Form(None),
    pincode: Optional[str] = Form(None),
    state: Optional[str] = Form(None),
    nomineeName: Optional[str] = Form(None),
    nomineePhone: Optional[str] = Form(None),
    nomineeAddress: Optional[str] = Form(None),
    nomineeEmail: Optional[str] = Form(None),
    profileImage: Optional[UploadFile] = File(None)
):
    """Handles detailed Enrollment with native Multipart support"""
    try:
        # Verify Uniqueness
        existing_user = await db.user.find_unique(where={'email': email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Cloudinary Upload
        image_url = None
        if profileImage:
            upload_result = cloudinary.uploader.upload(profileImage.file, folder="bank_kyc_profiles")
            image_url = upload_result.get('secure_url')

        # Create Prisma Record
        full_name = fullName or f"{firstName or ''} {lastName or ''}".strip()
        user = await db.user.create(
            data={
                "email": email,
                "password": hash_password(password),
                "fullName": full_name,
                "role": role,
                "firstName": firstName,
                "lastName": lastName,
                "phone": phone,
                "aadharNo": aadharNo,
                "age": age,
                "gender": gender,
                "address": address,
                "city": city,
                "landmark": landmark,
                "pincode": pincode,
                "state": state,
                "nomineeName": nomineeName,
                "nomineePhone": nomineePhone,
                "nomineeAddress": nomineeAddress,
                "nomineeEmail": nomineeEmail,
                "clientSign": image_url 
            }
        )
        return {"message": "Vault Identity created", "user_id": user.id, "imageUrl": image_url}
        
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/login")
async def login(req: LoginRequest):
    user = await db.user.find_unique(where={'email': req.email})
    if user and verify_password(req.password, user.password):
        return {
            "message": "Login successful",
            "user": {
                "id": user.id, 
                "name": user.fullName, 
                "role": user.role,
                "profileImage": user.clientSign 
            }
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

# --- BANKING OPERATIONS ---

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
        data={
            "amount": req.amount, 
            "transactionType": "DEPOSIT",
            "accountId": account.id,
            "processedBy": req.staffId
        }
    )
    return {"message": "Deposit synced", "newBalance": account.balance}

@app.get("/accounts/history/{acc_num}")
async def get_history(acc_num: str):
    account = await db.account.find_unique(
        where={'accountNumber': acc_num}, 
        include={'transactions': True}
    )
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return {
        "balance": account.balance, 
        "history": sorted(account.transactions, key=lambda x: x.createdAt, reverse=True)
    }

if __name__ == "__main__":
    import uvicorn
    # Use FastAPI instance directly
    uvicorn.run(app, host="127.0.0.1", port=5000, reload=True)