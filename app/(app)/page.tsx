"use client";

import { useState } from "react";

function ChatPage() {
  const [fetching, setFetching] = useState(true);


  return (
    <div className="w-screen h-screen flex flex-col bg-black text-white">
      {/* Messages  */}
      <div className="flex-grow overflow-y-hidden p-8 space-y-2">
      {/* 1. Fetching messages  */}
      {fetching && <div className="text-center font-bold">Fetching...</div>}
      </div>
      {/* TODO: 2. No Messages  */}
      {/* TODO: 3. Listing out the messages  */}
    </div>
  );
}

export default ChatPage;
