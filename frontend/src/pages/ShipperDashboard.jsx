import React, { useState, useEffect } from "react";
import axios from "axios";

export const ShipperDashboard = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/orders/shipper/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      alert(err.response?.data?.detail || "Lỗi lấy danh sách đơn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `/orders/${orderId}/shipper-status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.detail || "Cập nhật thất bại");
    }
  };

  if (loading) return <div className="p-6">Đang tải đơn hàng...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Bảng Điều Khiển Shipper</h2>
      {orders.length === 0 ? (
        <p>Không có đơn hàng nội bộ nào cần giao.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded shadow bg-white">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">Đơn hàng #{order.id}</span>
                <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded">
                  {order.status}
                </span>
              </div>
              <p><strong>Khách hàng:</strong> {order.customer_name} ({order.phone})</p>
              <p><strong>Địa chỉ:</strong> {order.shipping_address}</p>
              <p><strong>Tổng tiền:</strong> {order.total_amount.toLocaleString()} đ</p>

              <div className="mt-4 flex gap-2">
                {order.status === "PROCESSING" && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, "SHIPPING")}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    Nhận Giao Hàng
                  </button>
                )}
                {order.status === "SHIPPING" && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(order.id, "DELIVERED")}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                    >
                      Giao Thành Công
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(order.id, "FAILED")}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    >
                      Giao Thất Bại
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};