"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../../lib/firebase";

export default function AdminIndexPage() {
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang === "ru" ? "ru" : "en";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.replace(`/${lang}/admin/login`);
        return;
      }

      // check role from Firestore: users/{uid}.role === "admin"
      const snap = await getDoc(doc(db, "users", u.uid));
      const role = snap.exists() ? snap.data()?.role : null;

      if (role !== "admin") {
        router.replace(`/${lang}/portal`); // not admin -> customer portal
        return;
      }

      // ✅ admin -> go to admin dashboard page
      router.replace(`/${lang}/admin/dashboard`);
    });

    return () => unsub();
  }, [lang, router]);

  return <div style={{ padding: 30 }}>Loading admin...</div>;
}