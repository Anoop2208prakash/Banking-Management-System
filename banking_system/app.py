import asyncio
import traceback
import cloudinary
import cloudinary.uploader
from flask import Flask, jsonify, request
from flask_cors import CORS
from asgiref.wsgi import WsgiToAsgi  # Bridge for Uvicorn support
from db import db, connect_db
from utils import hash_password, verify_password, generate_account_number

app = Flask(__name__)
CORS(app)

# --- ☁️ CLOUDINARY CONFIGURATION ---
# Professional institutional hosting credentials
cloudinary.config( 
    cloud_name = "dfsuat2el", 
    api_key = "811246744629417", 
    api_secret = "__akJozJOJXD4nHKB7rFG3EsZzY",
    secure = True
)

# --- STABLE CONNECTION HELPER ---
async def get_db_connection():
    """Ensures Prisma is connected before any database operation."""
    if not db.is_connected():
        await db.connect()
    return db

# --- SYSTEM ROUTES ---
@app.get("/")
def home():
    return jsonify({
        "status": "Anoop Industry Bank API is active", 
        "version": "5.1.0-ASGI-Uvicorn",
        "owner": "Anoop Prakash"
    })

# --- 🏦 ENROLLMENT & AUTHENTICATION ---

@app.post("/register")
async def register():
    """
    Handles detailed Customer Enrollment with Cloudinary Image Upload.
    Supports 15+ KYC fields including Aadhar, Nominee, and Residential data.
    """
    try:
        database = await get_db_connection()
        
        # 1. Handle Multipart Form Data
        data = request.form.to_dict()
        profile_file = request.files.get('profileImage')
        
        if not data or 'email' not in data:
            return jsonify({"error": "Identity credentials missing"}), 400

        # Verify Uniqueness
        existing_user = await database.user.find_unique(where={'email': data['email']})
        if existing_user:
            return jsonify({"error": "Email already registered in system"}), 400

        # 2. Upload Profile Image to Cloudinary if provided
        image_url = None
        if profile_file:
            upload_result = cloudinary.uploader.upload(profile_file, folder="bank_kyc_profiles")
            image_url = upload_result.get('secure_url')

        # 3. Create full Institutional User Profile
        full_name = data.get("fullName") or f"{data.get('firstName', '')} {data.get('lastName', '')}".strip()

        user = await database.user.create(
            data={
                "email": data["email"],
                "password": hash_password(data['password']),
                "fullName": full_name,
                "role": data.get('role', 'CUSTOMER'),
                "firstName": data.get("firstName"),
                "lastName": data.get("lastName"),
                "phone": data.get("phone"),
                "aadharNo": data.get("aadharNo"),
                "age": int(data.get("age", 0)) if data.get("age") else None,
                "gender": data.get("gender"),
                "address": data.get("address"),
                "city": data.get("city"),
                "landmark": data.get("landmark"),
                "pincode": data.get("pincode"),
                "state": data.get("state"),
                "nomineeName": data.get("nomineeName"),
                "nomineePhone": data.get("nomineePhone"),
                "nomineeAddress": data.get("nomineeAddress"),
                "nomineeEmail": data.get("nomineeEmail"),
                "clientSign": image_url 
            }
        )
        
        return jsonify({
            "message": f"Vault Identity for {user.fullName} created", 
            "user_id": user.id,
            "imageUrl": image_url
        }), 201
        
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": "Enrollment failed", "details": str(e)}), 500

@app.post("/login")
async def login():
    try:
        database = await get_db_connection()
        data = request.json
        user = await database.user.find_unique(where={'email': data['email']})
        
        if user and verify_password(data['password'], user.password):
            return jsonify({
                "message": "Login successful",
                "user": {
                    "id": user.id, 
                    "name": user.fullName, 
                    "email": user.email,
                    "role": user.role,
                    "profileImage": user.clientSign 
                }
            }), 200
            
        return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"error": "Auth failed", "details": str(e)}), 500

# --- BANKING OPERATIONS ---

@app.post("/accounts/open")
async def open_account():
    try:
        database = await get_db_connection()
        data = request.json
        new_account = await database.account.create(
            data={
                "accountNumber": generate_account_number(),
                "accountType": data.get('type', 'SAVINGS'), 
                "balance": 0.0,
                "userId": data.get('userId')
            }
        )
        return jsonify({"message": "Ledger initialized", "accountNumber": new_account.accountNumber}), 201
    except Exception as e:
        return jsonify({"error": "Account setup failed", "details": str(e)}), 500

@app.post("/accounts/deposit")
async def deposit():
    try:
        database = await get_db_connection()
        data = request.json
        acc_num, amount = data.get('accountNumber'), float(data.get('amount'))

        account = await database.account.update(
            where={'accountNumber': acc_num},
            data={'balance': {'increment': amount}}
        )
        await database.transaction.create(
            data={
                "amount": amount, 
                "transactionType": "DEPOSIT",
                "accountId": account.id,
                "processedBy": data.get('staffId')
            }
        )
        return jsonify({"message": "Deposit synced", "newBalance": account.balance}), 200
    except Exception as e:
        return jsonify({"error": "Transaction failed", "details": str(e)}), 500

@app.get("/accounts/history/<acc_num>")
async def get_history(acc_num):
    try:
        database = await get_db_connection()
        account = await database.account.find_unique(
            where={'accountNumber': acc_num}, 
            include={'transactions': True}
        )
        if not account:
            return jsonify({"error": "Account not found"}), 404
        return jsonify({
            "account": acc_num, 
            "balance": account.balance, 
            "history": sorted(account.transactions, key=lambda x: x.createdAt, reverse=True)
        })
    except Exception as e:
        return jsonify({"error": "Fetch failed", "details": str(e)}), 500

# --- ASGI WRAPPER & UVICORN EXECUTION ---

# Create the ASGI application entry point to handle async operations
asgi_app = WsgiToAsgi(app)

if __name__ == "__main__":
    import uvicorn
    # Use the ASGI app to allow async handling with Uvicorn on Port 5000
    uvicorn.run("app:asgi_app", host="127.0.0.1", port=5000, reload=True)