"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../../../lib/firebase";

export default function CustomerSupportPage() {
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang === "ru" ? "ru" : "en";

  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);

  const t = useMemo(() => {
    const en = {
      title: "My Support Tickets",
      noTickets: "You have no support tickets.",
      subject: "Subject",
      message: "Message",
      status: "Status",
      adminReply: "Admin Reply",
      created: "Created",
      open: "open",
      closed: "closed",
      noReply: "No reply yet.",
    };

    const ru = {
      title: "Мои запросы поддержки",
      noTickets: "У вас нет запросов.",
      subject: "Тема",
      message: "Сообщение",
      status: "Статус",
      adminReply: "Ответ администратора",
      created: "Создано",
      open: "open",
      closed: "closed",
      noReply: "Ответа пока нет.",
    };

    return lang === "ru" ? ru : en;
  }, [lang]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.replace(`/${lang}/login`);
        return;
      }

      // 🔥 No composite index needed
      const snap = await getDocs(collection(db, "support_tickets"));
      let list = [];

      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() });
      });

      // ✅ Only current user's tickets
      list = list.filter((x) => x.uid === u.uid);

      // ✅ Sort newest first locally
      list.sort((a, b) => {
        const ta = a.createdAt?.seconds || 0;
        const tb = b.createdAt?.seconds || 0;
        return tb - ta;
      });

      setTickets(list);
      setLoading(false);
    });

    return () => unsub();
  }, [lang]);

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={{ marginBottom: 20 }}>{t.title}</h1>

        {tickets.length === 0 ? (
          <div>{t.noTickets}</div>
        ) : (
          tickets.map((tk) => (
            <div key={tk.id} style={styles.card}>
              <div style={styles.row}>
                <strong>{t.subject}:</strong> {tk.subject}
              </div>

              <div style={styles.row}>
                <strong>{t.message}:</strong>
                <div style={styles.message}>{tk.message}</div>
              </div>

              <div style={styles.row}>
                <strong>{t.status}:</strong>{" "}
                <span
                  style={{
                    color: tk.status === "closed" ? "#0e7c3a" : "#d62828",
                    fontWeight: 900,
                  }}
                >
                  {tk.status || t.open}
                </span>
              </div>

              <div style={styles.row}>
                <strong>{t.created}:</strong>{" "}
                {tk.createdAt?.toDate
                  ? tk.createdAt.toDate().toLocaleString()
                  : "-"}
              </div>

              {/* ✅ ADMIN REPLY SECTION */}
              <div style={styles.replyBox}>
                <div style={styles.replyTitle}>{t.adminReply}</div>
                {tk.adminReply ? (
                  <div style={styles.replyText}>{tk.adminReply}</div>
                ) : (
                  <div style={{ opacity: 0.7 }}>{t.noReply}</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: 40,
    minHeight: "100vh",
    background: "#f7f9fc",
  },
  container: {
    maxWidth: 900,
    margin: "0 auto",
  },
  card: {
    background: "#fff",
    border: "1px solid #e7ecf3",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 18px 45px rgba(16,24,40,.06)",
  },
  row: {
    marginBottom: 12,
  },
  message: {
    marginTop: 6,
    whiteSpace: "pre-wrap",
  },
  replyBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    background: "#eef6ff",
    border: "1px solid #cfe3ff",
  },
  replyTitle: {
    fontWeight: 900,
    marginBottom: 6,
  },
  replyText: {
    whiteSpace: "pre-wrap",
  },
};