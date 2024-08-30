"use client";
import { assistantAtom, userThreadAtom } from "@/atoms";
import axios from "axios";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";

interface Message {
  id: string;
  created_at: string;
  content: { type: string; text: { value: string } }[];
  metadata?: { fromUser?: string };
}

const POLLING_FREQUENCY_MS = 5000;

function ChatPage() {
  const [userThread] = useAtom(userThreadAtom);
  const [assistant] = useAtom(assistantAtom);

  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [pollingRun, setPollingRun] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    if (!userThread) {
      console.warn("No userThread found.");
      setLoading(false);
      return;
    }

    const { threadId } = userThread;
    console.log("Fetching messages for threadId:", threadId);

    try {
      const response = await axios.post<{
        success: boolean;
        error?: string;
        messages?: Message[];
      }>("/api/message/list", { threadId });

      if (!response.data.success || !response.data.messages) {
        console.error(response.data.error ?? "Unknown error.");
        toast.error("Failed to fetch messages.");
        setLoading(false);
        return;
      }

      let newMessages = response.data.messages.sort((a, b) =>
        new Date(a.created_at).getTime() > new Date(b.created_at).getTime() ? 1 : -1
      );

      setMessages(newMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch messages.");
    } finally {
      setLoading(false);
    }
  }, [userThread]);

  useEffect(() => {
    const fetchAndSetMessages = async () => {
      await fetchMessages();
    };

    fetchAndSetMessages();

    intervalRef.current = setInterval(() => {
      fetchAndSetMessages();
    }, POLLING_FREQUENCY_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startRun = async (threadId: string, assistantId: string): Promise<string> => {
    try {
      const response = await axios.post<{
        success: boolean;
        run?: any;
        error?: string;
      }>("/api/run/create", { threadId, assistantId });

      if (!response.data.success || !response.data.run) {
        console.error(response.data.error);
        toast.error("Failed to start run.");
        return "";
      }

      return response.data.run.id;
    } catch (error) {
      console.error("Failed to start run:", error);
      toast.error("Failed to start run.");
      return "";
    }
  };

  const pollRunStatus = async (threadId: string, runId: string) => {
    setPollingRun(true);

    const pollStatus = async () => {
      try {
        const response = await axios.post<{
          success: boolean;
          run?: any;
          error?: string;
        }>("/api/run/retrieve", { threadId, runId });

        if (!response.data.success || !response.data.run) {
          console.error(response.data.error);
          toast.error("Failed to poll run status.");
          return;
        }

        if (response.data.run.status === "completed") {
          clearInterval(intervalRef.current!);
          setPollingRun(false);
          fetchMessages();
        } else if (response.data.run.status === "failed") {
          clearInterval(intervalRef.current!);
          setPollingRun(false);
          toast.error("Run failed.");
        }
      } catch (error) {
        console.error("Failed to poll run status:", error);
        toast.error("Failed to poll run status.");
        clearInterval(intervalRef.current!);
      }
    };

    intervalRef.current = setInterval(pollStatus, POLLING_FREQUENCY_MS);
  };

  const sendMessage = async () => {
    if (!userThread || sending || !assistant || !message.trim()) {
      toast.error("Failed to send message. Invalid state.");
      return;
    }

    setSending(true);

    try {
      const response = await axios.post<{
        success: boolean;
        message?: Message;
        error?: string;
      }>("/api/message/create", {
        message,
        threadId: userThread.threadId,
        fromUser: "true",
      });

      if (!response.data.success || !response.data.message) {
        console.error("No message returned.");
        toast.error("Failed to send message. Please try again.");
        return;
      }

      const newMessage = response.data.message;
      if (newMessage) {
        setMessages((prev) => [...prev, newMessage]);
      }

      setMessage("");
      toast.success("Message sent.");

      const runId = await startRun(userThread.threadId, assistant.assistantId);
      pollRunStatus(userThread.threadId, runId);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-700 text-white">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">Loading...</div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-opacity-75"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-col bg-gray-700 text-white p-4 sm:p-6 md:p-8">
      <div className="flex-grow overflow-y-auto mb-4 p-4 bg-gray-800 rounded-lg shadow-lg">
        {messages.length === 0 ? (
          <div className="text-center font-bold text-gray-300">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${
                ["true", "True"].includes(message.metadata?.fromUser ?? "")
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg shadow-md max-w-[80%] sm:max-w-[70%] ${
                  ["true", "True"].includes(message.metadata?.fromUser ?? "")
                    ? "bg-green-500 text-gray-800"
                    : "bg-gray-600 text-white"
                }`}
              >
                {message.content.length > 0 && message.content[0].type === "text"
                  ? message.content[0].text.value
                      .split("\n")
                      .map((text, index) => (
                        <p key={index} className="mb-1 last:mb-0">
                          {text}
                        </p>
                      ))
                  : null}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            type="text"
            className="w-full sm:flex-grow bg-white text-black placeholder-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-inner"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            disabled={!userThread?.threadId || !assistant || sending || !message.trim()}
            className="w-full sm:w-auto bg-green-500 text-white px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 disabled:bg-green-700 hover:bg-green-600 transition duration-300 ease-in-out shadow-md"
            onClick={sendMessage}
          >
            {sending ? "Sending..." : pollingRun ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;