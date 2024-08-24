import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST() {
  const openai = new OpenAI();

  try {
    const thread = await openai.beta.threads.create();

    console.log(`Created Thread: ${thread}`);
    return NextResponse.json({ thread }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
