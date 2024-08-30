"use client";
import { useState } from "react";

function ChatPage() {
  const [fetching, setFetching] = useState(false);
  const [messages, setMessages] = useState([])

  const fetchMessages = async () => {
    
  }

  return (
    <div className="w-screen h-full flex flex-col bg-black text-white">
      {/* TODO: Messages  */}
      <div className="flex-grow overflow-y-hidden p-8 space-y-2">
        {/* TODO: Fetching messages  */}
        {fetching && <div className="text-center font-bold">fetching...</div>}
      {/* TODO: No messages  */}
      {messages.length === 0 && !fetching && (
        <div className="text-center font-bold">No Messages.</div>
      )}
      {/* TODO: Listing out the messages  */}
      </div>
      {/* TODO: Input  */}
    </div>
  );
}

export default ChatPage;
