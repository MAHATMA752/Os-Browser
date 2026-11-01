import { NextResponse } from "next/server";
import { z } from "zod";
import { createNote, listNotes } from "@/lib/server/db";
import { badRequest, readJson, serverError, validateBody } from "@/lib/server/http";

const createNoteSchema = z.object({
  title: z.string().trim().max(200).default("Untitled note"),
  body: z.string().max(100_000).default(""),
});

export async function GET() {
  try {
    return NextResponse.json(listNotes());
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    const parsed = validateBody(createNoteSchema, body);

    if (!parsed.success) {
      return badRequest(parsed.message);
    }

    return NextResponse.json(createNote(parsed.data), { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
