import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { message, threadId, fromUser = "true" } = await req.json();

    console.log("Received from user:", { message, threadId, fromUser });

    if (!threadId || !message) {
      return NextResponse.json(
        { error: "threadId and message are required", success: false },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Ensure the API key is correctly set
    });

    // Only add metadata if it is relevant
    const metadata = fromUser ? { fromUser } : {};

    const threadMessage = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
      metadata,  // Pass metadata only if it exists
    });

    console.log("Response from OpenAI:", threadMessage);

    return NextResponse.json(
      { message: threadMessage, success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error occurred:", error);

    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }

    return NextResponse.json(
      { error: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}
