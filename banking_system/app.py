import asyncio
import traceback
from flask import Flask, jsonify, request
from flask_cors import CORS
from db import db, connect_db
from utils import hash_password, verify_password, generate_account_number

app = Flask(__name__)
CORS(app)

# --- STABLE CONNECTION HELPER ---

async def get_db_connection():
    """
    Directly ensures the DB is connected using the loop of the CURRENT request.
    This eliminates the 'Event loop is closed' error by locking the connection
    to the specific life-cycle of this function call.
    """
    if not db.is_connected():
        await connect_db()
    return db

# --- SYSTEM ROUTES ---

@app.get("/")
def home():
    return jsonify({
        "status": "Anoop Industry Bank API is active", 
        "version": "3.10.11-Stable",
        "owner": "Anoop Prakash"
    })

# --- USER AUTHENTICATION ---

@app.post("/register")
async def register():
    try:
        # Step 1: Secure connection inside the active request loop
        database = await get_db_connection()
        
        data = request.json
        if not data or 'email' not in data:
            return jsonify({"error": "Missing required fields"}), 400

        # Step 2: Check if email already exists
        existing_user = await database.user.find_unique(where={'email': data['email']})
        if existing_user:
            return jsonify({"error": "Email already registered"}), 400

        # Step 3: Create user in MongoDB
        user = await database.user.create(
            data={
                "email": data["email"],
                "fullName": data["fullName"],
                "password": hash_password(data['password']) 
            }
        )
        return jsonify({"message": "User registered successfully", "user_id": user.id}), 201
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": "Registration failed", "details": str(e)}), 500

@app.post("/login")
async def login():
    try:
        database = await get_db_connection()
        data = request.json
        user = await database.user.find_unique(where={'email': data['email']})
        
        if user and verify_password(data['password'], user.password):
            return jsonify({
                "message": "Login successful",
                "user": {"id": user.id, "name": user.fullName, "email": user.email}
            }), 200
            
        return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": "Login failed", "details": str(e)}), 500

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
        return jsonify({"message": "Account opened", "accountNumber": new_account.accountNumber}), 201
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": "Account setup failed", "details": str(e)}), 500

# --- TRANSACTION HISTORY ---

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
        return jsonify({"account": acc_num, "balance": account.balance, "history": account.transactions})
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": "Fetch failed", "details": str(e)}), 500

if __name__ == "__main__":
    # threaded=False is important in some Windows environments to keep loops stable
    app.run(debug=True, threaded=False)