"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const lang = params?.lang === "ru" ? "ru" : "en";

  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.replace(`/${lang}/login`);
        return;
      }
      if (u.emailVerified) {
        router.replace(`/${lang}/portal`);
        return;
      }
      setUser(u);
    });

    return () => unsub();
  }, [router, lang]);

  const resend = async () => {
    if (!auth.currentUser) return;
    await sendEmailVerification(auth.currentUser);
    setMsg("Verification email sent. Please check your inbox/spam.");
  };

  const refresh = async () => {
    if (!auth.currentUser) return;
    await auth.currentUser.reload();
    if (auth.currentUser.emailVerified) router.replace(`/${lang}/portal`);
    else setMsg("Still not verified. Please verify and click Refresh.");
  };

  const logout = async () => {
    await signOut(auth);
    router.replace(`/${lang}/login`);
  };

  return (
    <div style={{ padding: 30, fontFamily: "Georgia" }}>
      <h2>Verify Your Email</h2>
      <p>
        Your account is created, but you must verify your email before accessing
        the portal.
      </p>
      <p>
        Logged in as: <b>{user?.email}</b>
      </p>

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button onClick={resend}>Resend Verification</button>
        <button onClick={refresh}>Refresh</button>
        <button onClick={logout}>Logout</button>
      </div>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}