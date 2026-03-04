export const runtime = "nodejs";

import { db } from "../../../../lib/firebaseAdmin";
import { requireAdmin } from "../../../../lib/authAdmin";

export async function PATCH(request, { params }) {
  try {
    await requireAdmin(request);

    const { id } = params || {};
    if (!id) return Response.json({ error: "Missing lead id" }, { status: 400 });

    const body = await request.json().catch(() => ({}));
    const status = String(body?.status || "").toUpperCase();
    if (!status) return Response.json({ error: "Missing status" }, { status: 400 });

    await db.collection("leads").doc(id).update({
      status,
      updatedAt: new Date(), // keep simple (no firebase-admin FieldValue needed)
    });

    return Response.json({ success: true });
  } catch (e) {
    console.error("PATCH /api/leads/[id] error:", e);
    // ✅ return correct codes
    const msg = e?.message || "Unauthorized";
    const code =
      msg.includes("Missing token") || msg.includes("Admin") || msg.includes("Forbidden")
        ? 401
        : 500;

    return Response.json({ error: msg }, { status: code });
  }
}