import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  const { threadId } = await req.json();

  if (!threadId) {
    return NextResponse.json(
      { error: "ThreadID is required", success: false },
      { status: 400 }
    );
  }

  const openai = new OpenAI();

  try {
    const response = await openai.beta.threads.messages.list(threadId);

    // Remove citation markers like   from all messages
    const sanitizedMessages = response.data.map((message: any) => ({
      ...message,
      content: message.content.map((content: any) => ({
        ...content,
        text: {
          value: content.text.value.replace(/【\d+:\d+†source】/g, ''),
        },
      })),
    }));

    return NextResponse.json({ messages: sanitizedMessages, success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}
