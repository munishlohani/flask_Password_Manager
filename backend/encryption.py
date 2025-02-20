import os
import dotenv
from cryptography.fernet import Fernet 

dotenv.load_dotenv()

key=os.getenv("SECRET_KEY")

cipher=Fernet(key)

def encrypt_password(password):
    return cipher.encrypt(password.encode()).decode()

def decrypt_password(password):
    return cipher.decrypt(password.encode()).decode()