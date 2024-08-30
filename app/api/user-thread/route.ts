import { prismadb } from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  // Get user thread from database.
  const userThread = await prismadb.userThread.findUnique({
    where: { userId: user.id},
  });
  // If the thread exists, return it.
  if (userThread) {
    return NextResponse.json({ userThread, success: true }, { status: 200 });
  }

  try {
    // If the thread doesn't exist, create it using OpenAI.
    const openai = new OpenAI();
    const thread = await openai.beta.threads.create();
  
    // Save the new thread to the database using Supabase
    const newUserThread = await prismadb.userThread.create({
      data: {
        userId: user.id,
        threadId: thread.id
      },
    });
  
    // Return the newly created thread
    return NextResponse.json(
      { userThread: newUserThread, success: true },
      { status: 201 }
    );
  } catch (error) {
  
    return NextResponse.json(
      { success: false, message: "Error creating thread" },
      { status: 500 }
    );
  } 
}
