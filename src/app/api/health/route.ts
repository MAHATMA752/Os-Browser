import { NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";

export async function GET() {
  getDb();
  return NextResponse.json({
    ok: true,
    service: "nova-api",
    database: "sqlite",
    timestamp: new Date().toISOString(),
  });
}
