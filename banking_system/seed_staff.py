import asyncio
from db import db, connect_db, disconnect_db
from utils import hash_password

async def create_staff_accounts():
    await connect_db()
    
    # 🏦 Staff data with unique Aadhar placeholders to satisfy DB constraints
    staff_data = [
        {
            "fullName": "Ravi Sharma",
            "email": "admin@anoopbank.com",
            "password": "Password123",
            "role": "ADMIN",
            "aadharNo": "STAFF0001" 
        },
        {
            "fullName": "Anoop Prakash",
            "email": "manager@anoopbank.com",
            "password": "Password123",
            "role": "MANAGER",
            "aadharNo": "STAFF0002"
        },
        {
            "fullName": "Suresh Kumar",
            "email": "accountant@anoopbank.com",
            "password": "Password123",
            "role": "ACCOUNTANT",
            "aadharNo": "STAFF0003"
        },
        {
            "fullName": "Priya Singh",
            "email": "cashier@anoopbank.com",
            "password": "Password123",
            "role": "CASHIER",
            "aadharNo": "STAFF0004"
        }
    ]

    print("🚀 Re-syncing administrative accounts...")

    for staff in staff_data:
        try:
            # Check if user already exists
            existing = await db.user.find_unique(where={'email': staff['email']})
            
            if not existing:
                user = await db.user.create(
                    data={
                        "fullName": staff["fullName"],
                        "email": staff["email"],
                        "password": hash_password(staff["password"]),
                        "role": staff["role"],
                        "aadharNo": staff["aadharNo"] # Unique value prevents the E11000 error
                    }
                )
                print(f"✅ Created {staff['role']}: {staff['email']}")
            else:
                print(f"⏩ {staff['role']} already exists.")
        except Exception as e:
            print(f"❌ Error creating {staff['role']}: {e}")

    await disconnect_db()

if __name__ == "__main__":
    asyncio.run(create_staff_accounts())