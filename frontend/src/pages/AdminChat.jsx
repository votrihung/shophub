import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AdminChat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesContainerRef = useRef(null);
  const isInitialLoad = useRef(true);

  const API_BASE = 'http://localhost:8000/api/admin';

  const fetchConversations = async () => {
    try {
      const res = await axios.get(`${API_BASE}/conversations`);
      const data = res.data.data || [];
      setConversations(data);

      if (isInitialLoad.current && data.length > 0) {
        setSelectedSessionId(data[0].session_id);
        isInitialLoad.current = false;
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách hội thoại:", err);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  const fetchMessages = async (sessionId, shouldScroll = false) => {
    if (!sessionId) return;
    try {
      const res = await axios.get(`${API_BASE}/conversations/${sessionId}/messages`);
      setMessages(res.data.data || []);
      if (shouldScroll) {
        scrollToBottom();
      }
    } catch (err) {
      console.error("Lỗi lấy tin nhắn:", err);
    }
  };

  useEffect(() => {
    if (!selectedSessionId) return;

    fetchMessages(selectedSessionId, true);

    const interval = setInterval(() => {
      fetchMessages(selectedSessionId, false);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedSessionId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedSessionId || loading) return;

    const textToSend = replyText;
    setReplyText('');
    setLoading(true);

    const tempMsg = {
      from: 'operator',
      content: textToSend,
      fingerprint: Date.now()
    };
    setMessages((prev) => [...prev, tempMsg]);
    scrollToBottom();

    try {
      await axios.post(`${API_BASE}/conversations/${selectedSessionId}/messages`, {
        content: textToSend
      });
      await fetchMessages(selectedSessionId, true);
    } catch (err) {
      alert("Gửi tin nhắn thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = (item, index) => {
    if (!item) return 'Khách hàng';
    if (item.meta?.nickname) return item.meta.nickname;
    if (item.meta?.email) return item.meta.email;
    const shortId = item.session_id ? item.session_id.slice(-4) : index + 1;
    return `Khách hàng #${shortId}`;
  };

  const activeConv = conversations.find((c) => c.session_id === selectedSessionId);

  return (
    <div style={{ padding: '30px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: '#0f172a' }}>
          💬 Trung Tâm Hỗ Trợ Khách Hàng (Admin Inbox)
        </h2>
        <p style={{ color: '#64748b', marginTop: '6px' }}>
          Quản lý toàn bộ tin nhắn, câu hỏi và phản hồi từ khách hàng trực tiếp trên ShopHub.
        </p>
      </div>

      <div style={{ display: 'flex', height: '620px', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        
        <div style={{ width: '320px', borderRight: '1px solid #e2e8f0', backgroundColor: '#f8fafc', overflowY: 'auto' }}>
          <div style={{ padding: '16px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', color: '#334155', backgroundColor: '#f1f5f9' }}>
            Hộp thư khách hàng ({conversations.length})
          </div>
          {conversations.length === 0 ? (
            <div style={{ padding: '20px', color: '#94a3b8', textAlign: 'center', fontSize: '14px' }}>
              Chưa có cuộc trò chuyện nào
            </div>
          ) : (
            conversations.map((item, idx) => {
              const isSelected = selectedSessionId === item.session_id;
              return (
                <div
                  key={item.session_id}
                  onClick={() => setSelectedSessionId(item.session_id)}
                  style={{
                    padding: '14px 16px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: isSelected ? '#e0f2fe' : 'transparent',
                    borderLeft: isSelected ? '4px solid #0284c7' : '4px solid transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>👤</span> {getDisplayName(item, idx)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.last_message?.content || 'Nhấn để xem nội dung'}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
          {selectedSessionId ? (
            <>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa' }}>
                <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '15px' }}>
                  💬 Đang trò chuyện với: {getDisplayName(activeConv, conversations.findIndex(c => c.session_id === selectedSessionId))}
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace', backgroundColor: '#e2e8f0', padding: '2px 8px', borderRadius: '4px' }}>
                  ID: #{selectedSessionId.slice(-6)}
                </span>
              </div>

              <div 
                ref={messagesContainerRef}
                style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#f8fafc' }}
              >
                {messages.map((msg, index) => {
                  const isAdmin = msg.from === 'operator';
                  return (
                    <div
                      key={msg.fingerprint || index}
                      style={{
                        alignSelf: isAdmin ? 'flex-end' : 'flex-start',
                        backgroundColor: isAdmin ? '#2563eb' : '#ffffff',
                        color: isAdmin ? '#ffffff' : '#0f172a',
                        padding: '10px 16px',
                        borderRadius: isAdmin ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                        maxWidth: '70%',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        border: isAdmin ? 'none' : '1px solid #e2e8f0'
                      }}
                    >
                      {msg.content}
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendMessage} style={{ padding: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px', backgroundColor: '#ffffff' }}>
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Nhập phản hồi gửi cho khách..."
                  style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    padding: '0 24px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    transition: 'background-color 0.2s'
                  }}
                >
                  {loading ? 'Đang gửi...' : 'Gửi'}
                </button>
              </form>
            </>
          ) : (
            <div style={{ margin: 'auto', color: '#94a3b8', fontSize: '15px', textAlign: 'center' }}>
              👈 Bấm vào một cuộc hội thoại ở cột bên trái để bắt đầu nhắn tin!
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminChat;