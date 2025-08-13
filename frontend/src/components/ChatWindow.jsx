import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ChatWindow({ wa_id, convs }) {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (wa_id) {
      axios.get(`${API_URL}/api/conversations/${wa_id}/messages`)
        .then(res => {
          const data = res.data;
          setMsgs(Array.isArray(data) ? data : data?.messages || []);
        })
        .catch(err => {
          console.error('Error fetching messages:', err);
          setMsgs([]);
        });
    }
  }, [wa_id, API_URL]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const contact = convs?.find(c => c.wa_id === wa_id);
    const name = contact ? contact.contactName : wa_id;

    axios.post(`${API_URL}/api/conversations/${wa_id}/messages`, {
      text: text,
      from: 'me',
      to: wa_id,
      contactName: name
    })
      .then(res => {
        setMsgs(prev => [...prev, res.data]);
        setText('');
      })
      .catch(err => console.error('Error sending message:', err));
  };

  const getStatusIcon = (status) => {
    if (status === 'read') {
      return <span style={{ color: '#0a84ff' }}>✔✔</span>;
    } else if (status === 'delivered') {
      return <span>✔✔</span>;
    } else if (status === 'sent') {
      return <span>✔</span>;
    }
    return null;
  };

  const contactName = convs?.find(c => c.wa_id === wa_id)?.contactName || wa_id;

  return (
    <div className="chat-window" style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #ddd',
      borderRadius: '10px',
      overflow: 'hidden'
    }}>

      {/* Header */}
      <div style={{
        backgroundColor: '#075e54',
        color: 'white',
        padding: '10px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          style={{ width: '28px', height: '28px', marginRight: '10px' }}
        />
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{contactName}</span>
      </div>

      {/* Messages */}
      <div className="messages" style={{
        flex: 1,
        overflowY: 'auto',
        padding: '10px',
        backgroundColor: '#ece5dd'
      }}>
        {msgs.length > 0 ? (
          msgs.map(m => (
            <div
              key={m._id || Math.random()}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: m.direction === 'out' ? 'flex-end' : 'flex-start',
                marginBottom: '8px'
              }}
            >
              <div style={{
                background: m.direction === 'out' ? '#dcf8c6' : '#fff',
                padding: '8px 12px',
                borderRadius: '8px',
                maxWidth: '70%',
                boxShadow: '0 1px 1px rgba(0,0,0,0.1)'
              }}>
                <span>
                  {typeof m.text === 'object'
                    ? JSON.stringify(m.text)
                    : m.text || ""}
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  fontSize: '0.75rem',
                  marginTop: '4px',
                  gap: '4px'
                }}>
                  <span>
                    {m.timestamp
                      ? new Date(m.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                      : ''}
                  </span>
                  {m.direction === 'out' && getStatusIcon(m.status)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#555' }}>No messages yet</p>
        )}
      </div>

      {/* Input */}
      <div style={{
        display: 'flex',
        padding: '10px',
        borderTop: '1px solid #ddd',
        backgroundColor: 'white'
      }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message"
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
          style={{
            flex: 1,
            padding: '8px',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: '10px',
            padding: '8px 16px',
            backgroundColor: '#075e54',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
