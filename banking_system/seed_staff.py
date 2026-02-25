import asyncio
from db import db, connect_db, disconnect_db
from utils import hash_password

async def create_staff_accounts():
    await connect_db()
    
    # Define the staff accounts to create
    staff_data = [
        {
            "fullName": "Anoop Prakash",
            "email": "manager@anoopbank.com",
            "password": "Password123",
            "role": "MANAGER"
        },
        {
            "fullName": "Suresh Kumar",
            "email": "accountant@anoopbank.com",
            "password": "Password123",
            "role": "ACCOUNTANT"
        },
        {
            "fullName": "Priya Singh",
            "email": "cashier@anoopbank.com",
            "password": "Password123",
            "role": "CASHIER"
        },
        {
            "fullName": "Ravi Sharma",
            "email": "admin@anoopbank.com",
            "password": "Password123",
            "role": "ADMIN"
        }
    ]

    print("🚀 Starting staff account creation...")

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
                        "role": staff["role"] #
                    }
                )
                print(f"✅ Created {staff['role']}: {staff['email']}")
            else:
                print(f"⏩ {staff['role']} ({staff['email']}) already exists.")
        except Exception as e:
            print(f"❌ Error creating {staff['role']}: {e}")

    await disconnect_db()

if __name__ == "__main__":
    asyncio.run(create_staff_accounts())