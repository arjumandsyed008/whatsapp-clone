import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ConversationList({ onSelect }) {
  const [convs, setConvs] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${API_URL}/api/conversations`)
      .then(res => {
        const data = res.data;
        let convList = [];

        if (Array.isArray(data)) {
          convList = data;
        } else if (Array.isArray(data?.conversations)) {
          convList = data.conversations;
        }

        // Normalize contactName from raw.contactName or fallback to wa_id
        convList = convList.map(c => ({
          ...c,
          contactName: c.contactName || c.raw?.contactName || c.wa_id || c._id || c.id
        }));

        setConvs(convList);
      })
      .catch(err => {
        console.error('Error fetching conversations:', err);
        setConvs([]);
      });
  }, [API_URL]);

  const getStatusIcon = (status) => {
    if (status === 'read') {
      return <span style={{ color: '#0a84ff' }}>✔✔</span>; // Blue double tick
    } else if (status === 'delivered') {
      return <span>✔✔</span>; // Grey double tick
    } else if (status === 'sent') {
      return <span>✔</span>; // Single tick
    }
    return null;
  };

  const handleSelect = (wa_id) => {
    if (onSelect) {
      onSelect(wa_id, convs);
    }
  };

  return (
    <div className="sidebar">
      {convs.length > 0 ? (
        convs.map(c => {
          const wa_id = c.wa_id || c._id || c.id;

          return (
            <div
              key={wa_id}
              className="chat"
              onClick={() => handleSelect(wa_id)}
              style={{ cursor: 'pointer', padding: '8px', borderBottom: '1px solid #eee' }}
            >
              <div className="chat-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{c.contactName}</strong>
                <span className="chat-time">{c.lastMessageTime || ''}</span>
              </div>
              <p style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {getStatusIcon(c.lastMessageStatus)}{" "}
                {typeof c.lastMessage === 'object'
                  ? c.lastMessage?.text || ""
                  : c.lastMessage || ""}
              </p>
            </div>
          );
        })
      ) : (
        <p>No conversations found</p>
      )}
    </div>
  );
}
