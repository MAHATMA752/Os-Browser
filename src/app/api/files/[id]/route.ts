import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteFile, updateFile } from "@/lib/server/db";
import {
  badRequest,
  notFound,
  readJson,
  serverError,
  validateBody,
} from "@/lib/server/http";

const updateFileSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    kind: z.enum(["folder", "file", "code"]),
    parentId: z.string().uuid().nullable(),
    size: z.string().max(40),
    content: z.string().max(1_000_000).nullable(),
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
    const parsed = validateBody(updateFileSchema, body);

    if (!parsed.success) {
      return badRequest(parsed.message);
    }

    const file = updateFile(id, parsed.data);
    return file ? NextResponse.json(file) : notFound("File not found");
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
    return deleteFile(id)
      ? NextResponse.json({ ok: true })
      : notFound("File not found");
  } catch (error) {
    return serverError(error);
  }
}
