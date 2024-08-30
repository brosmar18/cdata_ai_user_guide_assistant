"use client";
import { userThreadAtom } from "@/atoms";
import axios from "axios";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

interface Message {
  id: string;
  created_at: string;
  content: { type: string; text: { value: string } }[];
  metadata?: { fromUser?: string };
}

const POLLING_FREQUENCY_MS = 1000;

function ChatPage() {
  const [userThread] = useAtom(userThreadAtom);

  // State
  const [fetching, setFetching] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  console.log("UserThread", userThread);

  const fetchMessages = useCallback(async () => {
    if (!userThread) {
      console.warn("No userThread found.");
      return;
    }

    const { threadId } = userThread;
    console.log("Fetching messages for threadId:", threadId);

    setFetching(true);

    try {
      const response = await axios.post<{
        success: boolean;
        error?: string;
        messages?: Message[];
      }>("/api/message/list", { threadId: userThread.threadId });

      if (!response.data.success || !response.data.messages) {
        console.error(response.data.error ?? "Unknown error.");
        return;
      }

      let newMessages = response.data.messages;

      console.log("NewMessages before sorting and filtering:", newMessages);

      newMessages = newMessages
        .sort((a: Message, b: Message) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        })
        .filter(
          (message: Message) =>
            message.content[0].type === "text" &&
            message.content[0].text.value.trim() !== ""
        );

      console.log("NewMessages after sorting and filtering:", newMessages);

      setMessages(newMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setFetching(false);
    }
  }, [userThread]);

  useEffect(() => {
    const intervalId = setInterval(fetchMessages, POLLING_FREQUENCY_MS);

    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [fetchMessages]);

  return (
    <div className="w-screen h-full flex flex-col bg-black text-white">
      <div className="flex-grow overflow-y-hidden p-8 space-y-2">
        {fetching && messages.length === 0 && (
          <div className="text-center font-bold">fetching...</div>
        )}
        {messages.length === 0 && !fetching && (
          <div className="text-center font-bold">No Messages.</div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`px-4 py-2 mb-3 rounded-lg w-fit text-lg ${
              ["true", "True"].includes(
                message.metadata?.fromUser ?? ""
              )
                ? "bg-yellow-500 ml-auto"
                : "bg-gray-700"
            }`}
          >
            {message.content[0].type === "text"
              ? message.content[0].text.value
                  .split("\n")
                  .map((text, index) => <p key={index}>{text}</p>)
              : null}
          </div>
        ))}
      </div>
      {/* TODO: Input */}
    </div>
  );
}

export default ChatPage;
