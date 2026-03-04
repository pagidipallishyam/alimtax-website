export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/authAdmin";

export async function GET(req) {
  try {
    const result = await requireAdmin(req);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    console.error("ADMIN /me error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 401 }
    );
  }
}