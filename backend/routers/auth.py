import hashlib
import traceback
from typing import Optional
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

class ChangePasswordSchema(BaseModel):
    old_password: str
    new_password: str

class UpdateProfileSchema(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


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
                    user.role = 'CUSTOMER' # Mặc định khách hàng cho an toàn
                return user
    except Exception:
        pass
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Phiên đăng nhập hết hạn hoặc không hợp lệ!")

def require_admin(current_user=Depends(get_current_user)):
    if getattr(current_user, 'role', 'CUSTOMER') != 'ADMIN':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản của bạn không có quyền thực hiện hành động này!"
        )
    return current_user

def hash_password_sha256(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()


@router.get("/me")
def get_current_user_profile(current_user = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": getattr(current_user, 'email', ''),
        "full_name": getattr(current_user, 'full_name', getattr(current_user, 'email', '')),
        "phone": getattr(current_user, 'phone', ''),
        "address": getattr(current_user, 'address', ''),
        "role": getattr(current_user, 'role', 'CUSTOMER')
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
        db.rollback()
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
                "role": getattr(user_obj, 'role', 'CUSTOMER')
            }
        }
    except Exception as e:
        print("=== LỖI TẠI HÀM LOGIN ===")
        traceback.print_exc()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Lỗi hệ thống nội bộ: {str(e)}")

@router.put("/change-password")
def change_password(
    pass_data: ChangePasswordSchema, 
    current_user = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    try:
        raw_old_pwd = str(pass_data.old_password).strip()
        raw_new_pwd = str(pass_data.new_password).strip()
        
        hashed_old_pwd = hash_password_sha256(raw_old_pwd)
        if current_user.hashed_password != hashed_old_pwd:
            raise HTTPException(status_code=400, detail="Mật khẩu hiện tại không chính xác!")
            
        current_user.hashed_password = hash_password_sha256(raw_new_pwd)
        db.commit()
        
        return {"status": "success", "message": "Cập nhật mật khẩu thành công!"}
    except Exception as e:
        db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Lỗi hệ thống nội bộ: {str(e)}")

@router.put("/profile")
def update_profile(
    profile_data: UpdateProfileSchema, 
    current_user = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    try:
        # Cập nhật thông tin nếu FE có gửi lên
        if profile_data.full_name is not None:
            setattr(current_user, 'full_name', profile_data.full_name)
        if profile_data.phone is not None:
            setattr(current_user, 'phone', profile_data.phone)
        if profile_data.address is not None:
            setattr(current_user, 'address', profile_data.address)
            
        db.commit()
        db.refresh(current_user)
        
        return {
            "status": "success", 
            "message": "Cập nhật thông tin cá nhân thành công!",
            "user": {
                "id": current_user.id,
                "email": current_user.email,
                "full_name": getattr(current_user, 'full_name', ''),
                "phone": getattr(current_user, 'phone', ''),
                "address": getattr(current_user, 'address', '')
            }
        }
    except Exception as e:
        db.rollback()
        print("=== LỖI TẠI HÀM UPDATE PROFILE ===")
        traceback.print_exc()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Lỗi hệ thống nội bộ: {str(e)}")