import hashlib
import traceback
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel

router = APIRouter(
    prefix="/auth",
    tags=["Authentication (Xác thực)"]
)

class UserRegister(BaseModel):
    username: str
    password: str

def get_db():
    from database import SessionLocal
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Header(..., alias="Authorization"), db: Session = Depends(get_db)):
    from models.user import User
    try:
        if token.startswith("Bearer "):
            token = token.split(" ")[1]
            
        if "shophub-session-" in token:
            user_id = int(token.split("shophub-session-")[-1])
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                if not hasattr(user, 'role') or getattr(user, 'role', None) is None:
                    user.role = 'ADMIN'
                return user
    except Exception:
        pass
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Phiên đăng nhập hết hạn hoặc không hợp lệ!")

def require_admin(current_user=Depends(get_current_user)):
    if getattr(current_user, 'role', 'ADMIN') != 'ADMIN':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản của bạn không có quyền thực hiện hành động này!"
        )
    return current_user

def hash_password_sha256(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

# 🌟 ROUTE LẤY THÔNG TIN USER CHO FRONTEND
@router.get("/me")
def get_current_user_profile(current_user = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": getattr(current_user, 'full_name', getattr(current_user, 'email', '')),
        "phone": getattr(current_user, 'phone', ''),
        "address": getattr(current_user, 'address', ''),
        "role": getattr(current_user, 'role', 'ADMIN')
    }

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    try:
        from models.user import User 
        
        existing_user = db.query(User).filter(User.email == user_data.username).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Tài khoản này đã tồn tại trên hệ thống!")
        
        raw_password = str(user_data.password).strip()
        hashed_pwd = hash_password_sha256(raw_password)
        
        new_user = User(email=user_data.username, hashed_password=hashed_pwd, role="CUSTOMER")
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return {"status": "success", "message": "Đăng ký tài khoản thành công! Hãy chuyển sang Đăng nhập."}
    except Exception as e:
        print("=== LỖI TẠI HÀM REGISTER ===")
        traceback.print_exc()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Lỗi hệ thống nội bộ: {str(e)}")

@router.post("/login")
def login(user_data: UserRegister, db: Session = Depends(get_db)):
    try:
        from models.user import User
        
        user_obj = db.query(User).filter(User.email == user_data.username).first()
        if not user_obj:
            raise HTTPException(status_code=400, detail="Tài khoản hoặc mật khẩu không chính xác!")
        
        raw_password = str(user_data.password).strip()
        hashed_input_pwd = hash_password_sha256(raw_password)
            
        if user_obj.hashed_password != hashed_input_pwd:
            raise HTTPException(status_code=400, detail="Tài khoản hoặc mật khẩu không chính xác!")
            
        generated_token = f"shophub-session-{user_obj.id}"

        return {
            "status": "success", 
            "message": "Đăng nhập thành công!",
            "token": generated_token,
            "access_token": generated_token,
            "user": {
                "id": user_obj.id, 
                "username": user_obj.email, 
                "role": getattr(user_obj, 'role', 'ADMIN')
            }
        }
    except Exception as e:
        print("=== LỖI TẠI HÀM LOGIN ===")
        traceback.print_exc()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Lỗi hệ thống nội bộ: {str(e)}")