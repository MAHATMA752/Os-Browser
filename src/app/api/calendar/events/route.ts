import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createEvent,
  currentMonthKey,
  listEvents,
} from "@/lib/server/db";
import { badRequest, readJson, serverError, validateBody } from "@/lib/server/http";

const monthPattern = /^\d{4}-(0[1-9]|1[0-2])$/;

const createEventSchema = z.object({
  date: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/),
  title: z.string().trim().min(1).max(120),
  time: z.string().trim().min(1).max(40),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export async function GET(request: Request) {
  try {
    const requestedMonth = new URL(request.url).searchParams.get("month");
    const month =
      requestedMonth && monthPattern.test(requestedMonth)
        ? requestedMonth
        : currentMonthKey();

    return NextResponse.json(listEvents(month));
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    const parsed = validateBody(createEventSchema, body);

    if (!parsed.success) {
      return badRequest(parsed.message);
    }

    return NextResponse.json(createEvent(parsed.data), { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
