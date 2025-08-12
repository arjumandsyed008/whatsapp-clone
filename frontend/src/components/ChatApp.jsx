import React, { useState } from 'react';
import ConversationList from './ConversationList';  // adjust path if needed
import ChatWindow from './ChatWindow';              // adjust path if needed

export default function ChatApp() {
  const [selectedWaId, setSelectedWaId] = useState(null);
  const [convs, setConvs] = useState([]);

  const handleSelectConversation = (wa_id, conversations) => {
    setSelectedWaId(wa_id);
    setConvs(conversations); // Save convs so you can pass it to ChatWindow
  };

  return (
    <div style={{ display: 'flex' }}>
      <ConversationList onSelect={handleSelectConversation} />
      {selectedWaId && <ChatWindow wa_id={selectedWaId} convs={convs} />}
    </div>
  );
}
