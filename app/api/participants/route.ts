import { NextResponse } from "next/server";
import { getVisibleParticipants } from "@/lib/store";

export async function GET() {
  const visible = getVisibleParticipants();
  return NextResponse.json(visible);
}
