import { NextResponse } from "next/server";
import { z } from "zod";
import { readSettings, updateSettings } from "@/lib/server/db";
import { badRequest, readJson, serverError, validateBody } from "@/lib/server/http";

const settingsSchema = z
  .object({
    accent: z.string().regex(/^#[0-9a-fA-F]{6}$/, "must be a hex color"),
    wallpaper: z.enum(["aurora", "midnight", "graphite"]),
    dockSize: z.number().int().min(36).max(62),
    dockMagnify: z.boolean(),
    showDesktopIcons: z.boolean(),
    showHardDisks: z.boolean(),
    showMenuBarDate: z.boolean(),
    clock24: z.boolean(),
  })
  .partial()
  .strict();

export async function GET() {
  try {
    return NextResponse.json(readSettings());
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await readJson(request);
    const parsed = validateBody(settingsSchema, body);

    if (!parsed.success) {
      return badRequest(parsed.message);
    }

    return NextResponse.json(updateSettings(parsed.data));
  } catch (error) {
    return serverError(error);
  }
}
