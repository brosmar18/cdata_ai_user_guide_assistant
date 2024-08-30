"use client";
import { assistantAtom, userThreadAtom } from "@/atoms";
import axios from "axios";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Message {
  id: string;
  created_at: string;
  content: { type: string; text: { value: string } }[];
  metadata?: { fromUser?: string };
}

const POLLING_FREQUENCY_MS = 1000;

function ChatPage() {
  const [userThread] = useAtom(userThreadAtom);
  const [assistant] = useAtom(assistantAtom);

  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [pollingRun, setPollingRun] = useState(false);

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

    const intervalId = setInterval(() => {
      fetchAndSetMessages();
    }, POLLING_FREQUENCY_MS);

    return () => clearInterval(intervalId);
  }, [fetchMessages]);

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

    const intervalId = setInterval(async () => {
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
          clearInterval(intervalId);
          setPollingRun(false);
          fetchMessages();
        } else if (response.data.run.status === "failed") {
          clearInterval(intervalId);
          setPollingRun(false);
          toast.error("Run failed.");
        }
      } catch (error) {
        console.error("Failed to poll run status:", error);
        toast.error("Failed to poll run status.");
        clearInterval(intervalId);
      }
    }, POLLING_FREQUENCY_MS);

    return () => clearInterval(intervalId);
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
        setMessages((prev) => [...prev, newMessage]); // Ensure only valid Message objects are added
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
      event.preventDefault(); // Prevent form submission or other default behavior
      sendMessage(); // Trigger the sendMessage function when Enter is pressed
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-700 text-white">
        <div className="text-center">
          <div className="text-2xl font-bold">Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-[calc(100vh-64px)] flex flex-col bg-gray-700 text-white">
      <div className="flex-grow overflow-y-auto p-8 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center font-bold text-gray-300">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`px-4 py-2 mb-3 rounded-lg w-fit text-lg ${
                ["true", "True"].includes(message.metadata?.fromUser ?? "")
                  ? "bg-green-500 ml-auto"
                  : "bg-navy-500"
              }`}
            >
              {message.content.length > 0 && message.content[0].type === "text"
                ? message.content[0].text.value
                    .split("\n")
                    .map((text, index) => <p key={index}>{text}</p>)
                : null}
            </div>
          ))
        )}
      </div>
      <div className="mt-auto p-4 bg-gray-800">
        <div className="flex items-center bg-white p-2 rounded-md">
          <input
            type="text"
            className="flex-grow bg-transparent text-black focus:outline-none"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown} // Add the keydown event handler here
          />
          <button
            disabled={!userThread?.threadId || !assistant || sending || !message.trim()}
            className="ml-4 bg-green-500 text-white px-4 py-2 rounded-full focus:outline-none disabled:bg-green-700"
            onClick={sendMessage}
          >
            {sending ? "Sending..." : pollingRun ? "Fetching Response..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
