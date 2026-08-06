from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import stripe

router = APIRouter(prefix="/payments", tags=["payments"])

STRIPE_KEY = "sk_test_51U1OOq0SVJzFD5H2iq2ftrxpW1tmRYc1472iO6j8grX6OvpidM55Nv8mOH7uVE7BoGwmpw78KHYlT4LJbzqd2FBO005aiKUfFf"


class PaymentRequest(BaseModel):
    amount: float = 0.0
    order_id: int | None = None
    currency: str = "vnd"  # Mặc định VND


@router.post("/stripe/create-session")
def create_stripe_session(data: PaymentRequest):
    stripe.api_key = STRIPE_KEY
    curr = data.currency.lower()

    if curr == "vnd":
        unit_amount = int(data.amount)
    else:
        unit_amount = int(data.amount * 100)

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": curr,
                    "product_data": {
                        "name": f"Đơn hàng ShopHub #{data.order_id or ''}"
                    },
                    "unit_amount": unit_amount,
                },
                "quantity": 1,
            }],
            mode="payment",
            success_url="http://localhost:5173/order-success",
            cancel_url="http://localhost:5173/cart",
        )
        return {"url": session.url, "id": session.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/paypal/create-order")
def create_paypal_order(data: PaymentRequest):
    try:
        # TODO: Khi kết nối SDK PayPal thật, trả về link sandbox từ PayPal
        # Hiện tại redirect thẳng về trang thành công để không bị dính popup alert xấu
        return {
            "status": "success",
            "approve_url": "http://localhost:5173/order-success",
            "amount": data.amount
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/vnpay/create-url")
def create_vnpay_url(data: PaymentRequest):
    try:
        # TODO: Khi kết nối VNPay thật, trả về URL thanh toán checksum của VNPay
        return {
            "status": "success",
            "payment_url": "http://localhost:5173/order-success"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))