import { NextRequest, NextResponse } from "next/server";
import { addVotes } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { participantId, amount } = body;
    if (!participantId || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
    }
    const result = addVotes(participantId, amount);
    if (!result.success) {
      return NextResponse.json({ success: false, message: "Vote failed" }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
