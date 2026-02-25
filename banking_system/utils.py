import random
import string
from werkzeug.security import generate_password_hash, check_password_hash

# --- Security Functions ---

def hash_password(password: str):
    """Turns a plain text password into a secure, scrambled hash."""
    return generate_password_hash(password)

def verify_password(password: str, hashed_password: str):
    """Checks if the entered password matches the stored hash in MongoDB."""
    return check_password_hash(hashed_password, password)

# --- Banking Logic Functions ---

def generate_account_number():
    """Generates a unique 10-digit account number for new bank accounts."""
    # Standard bank account length is often 10-12 digits
    return ''.join(random.choices(string.digits, k=10))