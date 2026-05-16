import { NextRequest, NextResponse } from "next/server";
import { updateParticipant, deleteParticipant } from "@/lib/store";

const ADMIN_TOKEN = "mock-admin-token";

function isAdmin(req: NextRequest): boolean {
  return req.headers.get("x-admin-token") === ADMIN_TOKEN;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { id } = params;
    const updated = updateParticipant(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = params;
  const success = deleteParticipant(id);
  if (!success) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
