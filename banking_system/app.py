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
    """Ensures stable connection using the current request's loop."""
    if not db.is_connected():
        await db.connect()
    return db

# --- SYSTEM ROUTES ---

@app.get("/")
def home():
    return jsonify({
        "status": "Anoop Industry Bank API is active", 
        "version": "3.10.11-Stable",
        "owner": "Anoop Prakash" #
    })

# --- AUTHENTICATION & STAFF-LED REGISTRATION ---

@app.post("/register")
async def register():
    """
    Handles both public signups and staff-led onboarding.
    Accountants can create CUSTOMER accounts via this route.
    """
    try:
        database = await get_db_connection()
        data = request.json
        
        if not data or 'email' not in data:
            return jsonify({"error": "Missing required fields"}), 400

        # Verify if user already exists
        existing_user = await database.user.find_unique(where={'email': data['email']})
        if existing_user:
            return jsonify({"error": "Email already registered"}), 400

        # Role Handling: Defaults to CUSTOMER. 
        # Staff (Accountant/Manager) can specify a role in the request body.
        user = await database.user.create(
            data={
                "email": data["email"],
                "fullName": data["fullName"],
                "password": hash_password(data['password']),
                "role": data.get('role', 'CUSTOMER') 
            }
        )
        return jsonify({
            "message": f"Account for {user.fullName} created successfully", 
            "user_id": user.id, 
            "role": user.role
        }), 201
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
                "user": {
                    "id": user.id, 
                    "name": user.fullName, 
                    "email": user.email,
                    "role": user.role # Critical for frontend RBAC
                }
            }), 200
            
        return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"error": "Login failed", "details": str(e)}), 500

# --- ADMINISTRATIVE OPERATIONS (MANAGER & ACCOUNTANT) ---

@app.get("/admin/users")
async def get_all_users():
    """Allows Managers and Accountants to view the global registry."""
    try:
        database = await get_db_connection()
        users = await database.user.find_many(include={"accounts": True})
        return jsonify(users), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch users"}), 500

# --- BANKING OPERATIONS ---

@app.post("/accounts/open")
async def open_account():
    """Used by Accountants or Customers to initialize a new ledger."""
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
        return jsonify({"error": "Account setup failed", "details": str(e)}), 500

@app.post("/accounts/deposit")
async def deposit():
    """Standard deposit route with staff auditing enabled."""
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
                "processedBy": data.get('staffId') # Audit trail
            }
        )
        return jsonify({"message": "Deposit successful", "newBalance": account.balance}), 200
    except Exception as e:
        return jsonify({"error": "Deposit failed", "details": str(e)}), 500

@app.post("/accounts/transfer")
async def transfer():
    """ACID-compliant batch transfer logic."""
    try:
        database = await get_db_connection()
        data = request.json
        s_num, r_num, amt = data.get('fromAccount'), data.get('toAccount'), float(data.get('amount'))

        sender = await database.account.find_unique(where={'accountNumber': s_num})
        receiver = await database.account.find_unique(where={'accountNumber': r_num})
        
        if not sender or sender.balance < amt:
            return jsonify({"error": "Insufficient funds"}), 400
        if not receiver:
            return jsonify({"error": "Receiver not found"}), 404

        async with database.batch_() as batch:
            batch.account.update(where={'accountNumber': s_num}, data={'balance': {'decrement': amt}})
            batch.account.update(where={'accountNumber': r_num}, data={'balance': {'increment': amt}})
            batch.transaction.create(data={"amount": amt, "transactionType": "TRANSFER_OUT", "accountId": sender.id})
            batch.transaction.create(data={"amount": amt, "transactionType": "TRANSFER_IN", "accountId": receiver.id})
        
        return jsonify({"message": f"Transferred ₹{amt} successfully"}), 200
    except Exception as e:
        return jsonify({"error": "Transfer failed", "details": str(e)}), 500

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
        return jsonify({"error": "Fetch failed", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, threaded=False)