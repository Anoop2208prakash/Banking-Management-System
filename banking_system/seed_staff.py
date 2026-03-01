import asyncio
from db import db, connect_db, disconnect_db
from utils import hash_password

async def create_staff_accounts():
    """
    Initializes the Anoop Industry Bank administrative hierarchy.
    Uses unique Aadhar placeholders to bypass E11000 duplicate key errors.
    """
    await connect_db()
    
    # 🏦 Staff data with Institutional profile placeholders
    staff_data = [
        {
            "fullName": "Ravi Sharma",
            "email": "admin@anoopbank.com",
            "password": "Password123",
            "role": "ADMIN",
            "aadharNo": "000000000001",
            "avatar": "https://res.cloudinary.com/dfsuat2el/image/upload/v1/bank_kyc_profiles/admin_default"
        },
        {
            "fullName": "Anoop Prakash",
            "email": "manager@anoopbank.com",
            "password": "Password123",
            "role": "MANAGER",
            "aadharNo": "000000000002",
            "avatar": "https://res.cloudinary.com/dfsuat2el/image/upload/v1/bank_kyc_profiles/manager_default"
        },
        {
            "fullName": "Suresh Kumar",
            "email": "accountant@anoopbank.com",
            "password": "Password123",
            "role": "ACCOUNTANT",
            "aadharNo": "000000000003",
            "avatar": "https://res.cloudinary.com/dfsuat2el/image/upload/v1/bank_kyc_profiles/staff_default"
        },
        {
            "fullName": "Priya Singh",
            "email": "cashier@anoopbank.com",
            "password": "Password123",
            "role": "CASHIER",
            "aadharNo": "000000000004",
            "avatar": "https://res.cloudinary.com/dfsuat2el/image/upload/v1/bank_kyc_profiles/staff_default"
        }
    ]

    print("🚀 Synchronizing Institutional Administrative Registry...")

    for staff in staff_data:
        try:
            # Check for existing identity
            existing = await db.user.find_unique(where={'email': staff['email']})
            
            if not existing:
                await db.user.create(
                    data={
                        "fullName": staff["fullName"],
                        "email": staff["email"],
                        "password": hash_password(staff["password"]), # Salted hash for security
                        "role": staff["role"],
                        "aadharNo": staff["aadharNo"],
                        "clientSign": staff["avatar"] # Populate profile image for Dashboard
                    }
                )
                print(f"✅ Identity Verified & Vault Created: {staff['role']} ({staff['email']})")
            else:
                # Update existing user role if necessary
                await db.user.update(
                    where={'email': staff['email']},
                    data={"role": staff["role"]}
                )
                print(f"⏩ {staff['role']} identity already present in ledger.")
        except Exception as e:
            print(f"❌ Critical Enrollment Failure for {staff['role']}: {e}")

    await disconnect_db()

if __name__ == "__main__":
    asyncio.run(create_staff_accounts())