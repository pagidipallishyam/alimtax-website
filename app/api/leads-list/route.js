export const runtime = "nodejs";
import { db } from "../../../lib/firebaseAdmin";
import { requireAdmin } from "../../../lib/authAdmin";

export async function GET(request) {
  try {
    await requireAdmin(request);

    const snap = await db
      .collection("leads")
      .orderBy("createdAt", "desc")
      .limit(200)
      .get();

    const leads = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
      };
    });

    return Response.json({ leads });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 401 });
  }
}
