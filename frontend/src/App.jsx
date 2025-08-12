import React, { useState } from 'react';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import './App.css';

export default function App() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [convs, setConvs] = useState([]);

  // onSelect receives both wa_id and convs from ConversationList
  const handleSelect = (wa_id, conversations) => {
    setSelectedChat(wa_id);
    setConvs(conversations);
  };

  return (
    <div className="app" style={{ display: 'flex', height: '100vh' }}>
      <ConversationList onSelect={handleSelect} />
      {selectedChat && <ChatWindow wa_id={selectedChat} convs={convs} />}
    </div>
  );
}
