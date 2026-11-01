import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteNote, updateNote } from "@/lib/server/db";
import {
  badRequest,
  notFound,
  readJson,
  serverError,
  validateBody,
} from "@/lib/server/http";

const updateNoteSchema = z
  .object({
    title: z.string().trim().max(200),
    body: z.string().max(100_000),
  })
  .partial()
  .strict();

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await readJson(request);
    const parsed = validateBody(updateNoteSchema, body);

    if (!parsed.success) {
      return badRequest(parsed.message);
    }

    const note = updateNote(id, parsed.data);
    return note ? NextResponse.json(note) : notFound("Note not found");
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    return deleteNote(id)
      ? NextResponse.json({ ok: true })
      : notFound("Note not found");
  } catch (error) {
    return serverError(error);
  }
}
