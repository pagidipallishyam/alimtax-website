export const runtime = "nodejs";

import { db } from "../../../../lib/firebaseAdmin";
import { requireAdmin } from "../../../../lib/authAdmin";

export async function PATCH(request, { params }) {
  try {
    await requireAdmin(request);

    const body = await request.json().catch(() => ({}));
    const { status } = body;
    const allowed = ["NEW", "IN_PROGRESS", "DONE"];
    if (!allowed.includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    await db.collection("leads").doc(params.id).update({
      status,
      updatedAt: new Date(),
    });

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 401 });
  }
}
