from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
import sqlite3
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel
import hashlib
from user_db_config import get_users_db_path
from dotenv import load_dotenv
from pathlib import Path
from typing import Optional
import os

class UserRegister(BaseModel):
    username: str
    password: str
    email: str
    first_name: str
    last_name: str
    phone_number: Optional[str] = None 


class UserLogin(BaseModel):
    username: str
    password: str
    
# Load .env file
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env") 

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

print(f"Loaded JWT settings: SECRET_KEY={SECRET_KEY}, ALGORITHM={ALGORITHM}, ACCESS_TOKEN_EXPIRE_MINUTES={ACCESS_TOKEN_EXPIRE_MINUTES}")
# Password hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__truncate_error=False
)

# Router
router = APIRouter()

# OAuth2 scheme for protected routes
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# DB dependency
def get_connection():
    conn = sqlite3.connect(get_users_db_path(),check_same_thread=False)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

# Utility functions
def hash_password(password: str):
    # SHA256 ensures consistent length
    password_hash = hashlib.sha256(password.encode("utf-8")).digest()
    return pwd_context.hash(password_hash)

def verify_password(password: str, hashed_password: str):
    password_hash = hashlib.sha256(password.encode("utf-8")).digest()
    return pwd_context.verify(password_hash, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Register user api route
@router.post("/register")
def register(user: UserRegister, connection: sqlite3.Connection = Depends(get_connection)):
    cursor = connection.cursor()
    hashed_password = hash_password(user.password)

    try:
        cursor.execute("INSERT INTO users (username, password, email, first_name, last_name, phone_number) VALUES (?, ?, ?, ?, ?, ?)", (user.username, hashed_password, user.email, user.first_name, user.last_name, user.phone_number))
        connection.commit()
        return {"message": "User created successfully"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Username already exists")



# Login user api route, returns JWT token if successful
@router.post("/login")
def login(form_data: UserLogin, connection: sqlite3.Connection = Depends(get_connection)):
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (form_data.username,))
    user = cursor.fetchone()
    
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    token = create_access_token({"sub": user["username"]})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/profile")
def protected_route(
    token: str = Depends(oauth2_scheme),
    connection: sqlite3.Connection = Depends(get_connection)
):
    try:
        # Decode JWT
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")

        if not username:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        cursor = connection.cursor()

        # Fetch user from DB
        cursor.execute("""
            SELECT id, username, email, first_name, last_name, phone_number
            FROM users
            WHERE username = ?
        """, (username,))

        user = cursor.fetchone()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return {
            "id": user[0],
            "username": user[1],
            "email": user[2],
            "firstName": user[3],
            "lastName": user[4],
            "phone": user[5]
        }

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


UserRegister.model_rebuild()