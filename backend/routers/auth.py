import traceback
import hashlib
from fastapi import APIRouter, Depends, HTTPException, status
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

# Hàm băm mật khẩu bằng SHA-256 tiêu chuẩn - Bất chấp mọi giới hạn độ dài ký tự
def hash_password_sha256(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    try:
        from models.user import User 
        
        # Kiểm tra tài khoản trùng dựa trên email
        existing_user = db.query(User).filter(User.email == user_data.username).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Tài khoản này đã tồn tại trên hệ thống!")
        
        # Lấy chuỗi thô sạch sẽ
        raw_password = str(user_data.password).strip()
        
        # Băm bằng SHA-256 (Chuỗi trả ra luôn cố định 64 ký tự, bẻ gãy hoàn toàn lỗi 72 bytes)
        hashed_pwd = hash_password_sha256(raw_password)
        
        new_user = User(email=user_data.username, hashed_password=hashed_pwd)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return {"status": "success", "message": "Đăng ký tài khoản thành công! Hãy chuyển sang Đăng nhập."}
    except Exception as e:
        print("=== LỖI TẠI HÀM REGISTER ===")
        traceback.print_exc()
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
            
        # Xác thực mật khẩu chuỗi SHA-256
        if user_obj.hashed_password != hashed_input_pwd:
            raise HTTPException(status_code=400, detail="Tài khoản hoặc mật khẩu không chính xác!")
            
        return {
            "status": "success", 
            "message": "Đăng nhập thành công!",
            "user": {"id": user_obj.id, "username": user_obj.email}
        }
    except Exception as e:
        print("=== LỖI TẠI HÀM LOGIN ===")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Lỗi hệ thống nội bộ: {str(e)}")