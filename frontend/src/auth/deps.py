from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import UserDB
from ..auth.security import SECRET_KEY, ALGORITHM

# Sử dụng đường dẫn login sẵn có của hệ thống
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
) -> UserDB:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        # Giải mã token lấy user_id (sub)
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Tìm user trong database
    user = db.query(UserDB).filter(UserDB.id == int(user_id)).first()
    if user is None:
        raise credentials_exception

    return user

def require_admin(user: UserDB = Depends(get_current_user)) -> UserDB:
    # 🚨 Bẫy chặn nếu không phải ADMIN, trả về lỗi 403 Forbidden
    if user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required",
        )
    return user