"use client";

import { userThreadAtom } from "@/atoms";
import Navbar from "@/components/Navbar";
import { userThread } from "@prisma/client";
import axios from "axios";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [, setUserThread] = useAtom(userThreadAtom);

  // TODO: If the user doesn't have threadID, we make one.
  // If the user does have one, we fetch it.

  useEffect(() => {
    async function getUserThread() {
      try {
        // Fetch the userThread from our API
        const response = await axios.get<{ success: boolean; message?: string; userThread: userThread }>(
          "/api/user-thread"
        );

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

// Going to use the threadID to fetch all messages.
