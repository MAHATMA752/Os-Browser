import { NextResponse } from "next/server";
import { z } from "zod";
import { createFile, listFiles } from "@/lib/server/db";
import { badRequest, readJson, serverError, validateBody } from "@/lib/server/http";

const createFileSchema = z.object({
  name: z.string().trim().min(1).max(120),
  kind: z.enum(["folder", "file", "code"]).default("folder"),
  parentId: z.string().uuid().nullable().optional(),
  size: z.string().max(40).optional(),
  content: z.string().max(1_000_000).nullable().optional(),
});

export async function GET() {
  try {
    return NextResponse.json(listFiles());
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    const parsed = validateBody(createFileSchema, body);

    if (!parsed.success) {
      return badRequest(parsed.message);
    }

    return NextResponse.json(createFile(parsed.data), { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
