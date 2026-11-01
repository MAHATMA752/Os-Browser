import { NextResponse } from "next/server";
import type { ZodType } from "zod";

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(error: unknown) {
  console.error("[nova-api]", error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 },
  );
}

export function validateBody<T>(
  schema: ZodType<T>,
  body: unknown,
):
  | { success: true; data: T }
  | { success: false; message: string } {
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues
        .map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
        .join(", "),
    };
  }

  return { success: true, data: parsed.data };
}
