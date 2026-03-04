import { db } from "../../../../lib/firebaseAdmin";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { name, phone, preferredDate = "", preferredTime = "", notes = "" } = body;

  if (!name || !phone) {
    return Response.json({ error: "name and phone are required" }, { status: 400 });
  }

  const doc = await db.collection("appointments").add({
    name,
    phone,
    preferredDate,
    preferredTime,
    notes,
    status: "REQUESTED",
    createdAt: new Date(),
  });

  return Response.json({ id: doc.id }, { status: 201 });
}
