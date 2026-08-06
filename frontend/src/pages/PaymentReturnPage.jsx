import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentReturnPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const responseCode = searchParams.get('vnp_ResponseCode');
  const txnRef = searchParams.get('vnp_TxnRef');
  const rawAmount = searchParams.get('vnp_Amount');
  const bankCode = searchParams.get('vnp_BankCode');
  const transactionNo = searchParams.get('vnp_TransactionNo');

  const orderId = txnRef ? txnRef.split('_')[0] : '---';
  const amount = rawAmount ? Number(rawAmount) / 100 : 0;
  const isSuccess = responseCode === '00';

  return (
    <div style={{ maxWidth: '600px', margin: '60px auto', padding: '32px 24px', fontFamily: 'system-ui, sans-serif', color: '#1e293b', minHeight: '50vh' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        {isSuccess ? (
          <>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#16a34a', margin: '0 0 8px 0' }}>Thanh Toán Thành Công!</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Cảm ơn bạn đã hoàn tất thanh toán đơn hàng qua VNPay.</p>
            
            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', textAlign: 'left', marginBottom: '24px', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Mã đơn hàng:</span>
                <span style={{ fontWeight: 'bold' }}>#{orderId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Số tiền:</span>
                <span style={{ fontWeight: 'bold', color: '#ef4444' }}>{amount.toLocaleString('vi-VN')}đ</span>
              </div>
              {bankCode && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Ngân hàng:</span>
                  <span style={{ fontWeight: 'bold' }}>{bankCode}</span>
                </div>
              )}
              {transactionNo && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Mã giao dịch VNPay:</span>
                  <span style={{ fontWeight: 'bold' }}>{transactionNo}</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>❌</div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#dc2626', margin: '0 0 8px 0' }}>Thanh Toán Thất Bại!</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Giao dịch bị hủy hoặc xảy ra lỗi trong quá trình xử lý.</p>
            
            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', textAlign: 'left', marginBottom: '24px', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Mã đơn hàng:</span>
                <span style={{ fontWeight: 'bold' }}>#{orderId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Mã phản hồi:</span>
                <span style={{ fontWeight: 'bold', color: '#dc2626' }}>{responseCode || 'N/A'}</span>
              </div>
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={() => navigate('/products')} style={{ padding: '10px 20px', backgroundColor: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
            Tiếp tục mua sắm
          </button>
          <button onClick={() => navigate('/history')} style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
            Xem lịch sử đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentReturnPage;