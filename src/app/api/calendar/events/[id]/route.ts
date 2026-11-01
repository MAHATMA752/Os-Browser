import { NextResponse } from "next/server";
import { deleteEvent } from "@/lib/server/db";
import { notFound, serverError } from "@/lib/server/http";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    return deleteEvent(id)
      ? NextResponse.json({ ok: true })
      : notFound("Event not found");
  } catch (error) {
    return serverError(error);
  }
}
