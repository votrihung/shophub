import hashlib
import hmac
import urllib.parse
from datetime import datetime

VNPAY_TMN_CODE = "7FPAMQ6J"
VNPAY_HASH_SECRET = "PTHDFNDOEKCADYRJMJDUJCYMDNLWMIHL" 
VNPAY_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
VNPAY_RETURN_URL = "http://localhost:5173/payment-return"


def create_vnpay_url(order_id: int, amount: float, ip_addr: str) -> str:
    """Tạo URL thanh toán VNPay chuẩn mã hóa HMAC-SHA512."""
    vnp_params = {
        "vnp_Version": "2.1.0",
        "vnp_Command": "pay",
        "vnp_TmnCode": VNPAY_TMN_CODE,
        "vnp_Amount": str(int(amount * 100)),  
        "vnp_CurrCode": "VND",
        "vnp_TxnRef": f"{order_id}_{int(datetime.now().timestamp())}",
        "vnp_OrderInfo": f"Thanh toan don hang {order_id}",  
        "vnp_OrderType": "other",
        "vnp_Locale": "vn",
        "vnp_ReturnUrl": VNPAY_RETURN_URL,
        "vnp_IpAddr": ip_addr,
        "vnp_CreateDate": datetime.now().strftime("%Y%m%d%H%M%S"),
    }

    input_data = sorted(vnp_params.items())

    has_data = ""
    seq = 0
    for key, val in input_data:
        if seq == 1:
            has_data = (
                has_data + "&" + str(key) + "=" + urllib.parse.quote_plus(str(val))
            )
        else:
            seq = 1
            has_data = str(key) + "=" + urllib.parse.quote_plus(str(val))

    hash_value = hmac.new(
        VNPAY_HASH_SECRET.encode("utf-8"),
        has_data.encode("utf-8"),
        hashlib.sha512,
    ).hexdigest()
    
    return f"{VNPAY_URL}?{has_data}&vnp_SecureHash={hash_value}"