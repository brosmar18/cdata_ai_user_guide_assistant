"use client";

import { assistantAtom, userThreadAtom } from "@/atoms";
import Navbar from "@/components/Navbar";
import { Assistant, UserThread } from "@prisma/client";
import axios from "axios";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [, setUserThread] = useAtom(userThreadAtom);
  const [assistant, setAssistant] = useAtom(assistantAtom);

  useEffect(() => {
    if (assistant) return;

    async function getAssistant() {
      try {
        const response = await axios.get<{
          success: boolean;
          message?: string;
          assistant: Assistant;
        }>("/api/assistant");

        if (!response.data.success || !response.data.assistant) {
          console.error(response.data.message ?? "Unknown error.");
          toast.error("Failed to fetch assistant.");
          setAssistant(null);
          return;
        }

        setAssistant(response.data.assistant);
      } catch (error) {
        console.error(error);
        setAssistant(null);
      }
    }

    getAssistant(); // Call the getAssistant function
  }, [assistant, setAssistant]);

  useEffect(() => {
    async function getUserThread() {
      try {
        // Fetch the userThread from our API
        const response = await axios.get<{
          success: boolean;
          message?: string;
          userThread: UserThread;
        }>("/api/user-thread");

        if (!response.data.success || !response.data.userThread) {
          console.error(response.data.message ?? "Unknown error.");
          setUserThread(null);
          return;
        }

        setUserThread(response.data.userThread); // Set the userThread state with the fetched data
      } catch (error) {
        console.error("Error fetching user thread:", error);
        setUserThread(null); // Set the userThread to null in case of an error
      }
    }

    getUserThread(); // Call the function to fetch or create the userThread
  }, [setUserThread]);

  return (
    <div className="flex flex-col w-full h-full">
      <Navbar />
      {children}
    </div>
  );
}
