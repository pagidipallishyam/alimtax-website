import { NextResponse } from "next/server";
import { adminAuth, adminDb, adminStorage } from "../../../lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { idToken, documentId } = await req.json();

    if (!idToken || !documentId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;

    const snap = await adminDb.collection("documents").doc(documentId).get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const data = snap.data();
    if (data.uid !== uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const bucket = adminStorage.bucket();
    const file = bucket.file(data.storagePath);

    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 60 * 1000,
    });

    return NextResponse.json({ url }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }
}