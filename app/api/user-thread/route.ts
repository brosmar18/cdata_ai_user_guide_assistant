import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/supabaseClient";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "unauthorized" },
      { status: 401 }
    );
  }

  // Get user threads from the database using Supabase
  const { data: userThread, error } = await supabase
    .from("userThread")
    .select("*")
    .eq("userID", user.id)
    .single();

  if (error || !userThread) {
    return NextResponse.json(
        { success: false, message: error?.message || "User thread not found "},
        {status: 404}
    );
  }

  // if it does exist, return it.
  return NextResponse.json(
    { success: true, userThread},
    { status: 200 }
  )
}
