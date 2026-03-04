export const runtime = "nodejs";

import admin from "firebase-admin";
import { adminDb } from "../../../lib/firebaseAdmin"; // ✅ FIX: use adminDb (not db)
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, phone, email = "", message, language = "en" } = body;

    if (!name || !phone || !message) {
      return Response.json(
        { error: "name, phone, message are required" },
        { status: 400 }
      );
    }

    // 1) Save lead to Firestore
    const docRef = await adminDb.collection("leads").add({
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email || "").trim(),
      message: String(message).trim(),
      language: String(language || "en").trim(),
      status: "NEW",
      createdAt: admin.firestore.FieldValue.serverTimestamp(), // ✅ better
    });

    // 2) Send email notification (optional)
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY missing. Skipping email.");
      return Response.json({ id: docRef.id, emailSent: false }, { status: 201 });
    }

    await resend.emails.send({
      from: "ALIM TAX <onboarding@resend.dev>",
      to: "ajitkc844@gmail.com",
      subject: "New Lead – ALIM TAX",
      html: `
        <h2>New Lead Received</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email || "-")}</p>
        <p><strong>Language:</strong> ${escapeHtml(language)}</p>
        <p><strong>Message:</strong><br/>${escapeHtml(String(message)).replace(/\n/g, "<br/>")}</p>
        <hr/>
        <p><strong>Lead ID:</strong> ${docRef.id}</p>
      `,
    });

    return Response.json({ id: docRef.id, emailSent: true }, { status: 201 });
  } catch (e) {
    console.error("POST /api/leads error:", e);
    return Response.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}

/** small safety to prevent HTML injection in email */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}