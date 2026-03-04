import { authAdmin, db } from "./firebaseAdmin";

export async function requireAdmin(request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) throw new Error("Missing token");

  const decoded = await authAdmin.verifyIdToken(token);

  const userDoc = await db.collection("users").doc(decoded.uid).get();
  const role = userDoc.exists ? userDoc.data()?.role : null;

  if (role !== "admin") throw new Error("Admin only");
  return decoded;
}
