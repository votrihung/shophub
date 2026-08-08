import React, { useState, useEffect } from "react";
import axios from "axios";

export const CheckoutPage = ({ cartItems, token }) => {
  const [shippingProvider, setShippingProvider] = useState("IN_HOUSE");
  const [districtId, setDistrictId] = useState("");
  const [wardCode, setWardCode] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const [loadingFee, setLoadingFee] = useState(false);
  
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    shipping_address: "",
    payment_method: "COD",
  });

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    if (shippingProvider === "GHN" && districtId && wardCode) {
      setLoadingFee(true);
      axios
        .post("/orders/calculate-fee", {
          to_district_id: Number(districtId),
          to_ward_code: wardCode,
          weight: 1000,
        })
        .then((res) => setShippingFee(res.data.shipping_fee))
        .catch(() => setShippingFee(0))
        .finally(() => setLoadingFee(false));
    } else {
      setShippingFee(0);
    }
  }, [shippingProvider, districtId, wardCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      items: cartItems.map((item) => ({
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      customer_name: form.customer_name,
      phone: form.phone,
      shipping_address: form.shipping_address,
      shipping_provider: shippingProvider,
      to_district_id: districtId ? Number(districtId) : null,
      to_ward_code: wardCode || null,
      shipping_fee: shippingFee,
      payment_method: form.payment_method,
    };

    try {
      const res = await axios.post("/orders/checkout", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.payment_url) {
        window.location.href = res.data.payment_url;
      } else {
        alert("Đặt hàng thành công!");
      }
    } catch (err) {
      alert(err.response?.data?.detail || "Đặt hàng thất bại");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Thanh Toán Đơn Hàng</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Họ và tên</label>
          <input
            type="text"
            required
            className="w-full border p-2 rounded"
            value={form.customer_name}
            onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Số điện thoại</label>
          <input
            type="text"
            required
            className="w-full border p-2 rounded"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Địa chỉ giao hàng</label>
          <input
            type="text"
            required
            className="w-full border p-2 rounded"
            value={form.shipping_address}
            onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Đơn vị vận chuyển</label>
          <select
            className="w-full border p-2 rounded"
            value={shippingProvider}
            onChange={(e) => setShippingProvider(e.target.value)}
          >
            <option value="IN_HOUSE">ShopHub Delivery (Nội bộ)</option>
            <option value="GHN">Giao Hàng Nhanh (GHN)</option>
          </select>
        </div>

        {shippingProvider === "GHN" && (
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded">
            <div>
              <label className="block text-sm font-medium">ID Quận/Huyện</label>
              <input
                type="number"
                placeholder="Ví dụ: 1442"
                required
                className="w-full border p-2 rounded"
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Mã Phường/Xã</label>
              <input
                type="text"
                placeholder="Ví dụ: 20109"
                required
                className="w-full border p-2 rounded"
                value={wardCode}
                onChange={(e) => setWardCode(e.target.value)}
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Phương thức thanh toán</label>
          <select
            className="w-full border p-2 rounded"
            value={form.payment_method}
            onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
          >
            <option value="COD">Thanh toán khi nhận hàng (COD)</option>
            <option value="VNPAY">Thanh toán qua VNPay</option>
          </select>
        </div>

        <div className="border-t pt-4 space-y-1">
          <p className="flex justify-between">
            <span>Tiền hàng:</span>
            <span>{subtotal.toLocaleString()} đ</span>
          </p>
          <p className="flex justify-between">
            <span>Phí vận chuyển:</span>
            <span>{loadingFee ? "Đang tính..." : `${shippingFee.toLocaleString()} đ`}</span>
          </p>
          <p className="flex justify-between font-bold text-lg text-red-600">
            <span>Tổng cộng:</span>
            <span>{(subtotal + shippingFee).toLocaleString()} đ</span>
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700"
        >
          Xác Nhận Đặt Hàng
        </button>
      </form>
    </div>
  );
};