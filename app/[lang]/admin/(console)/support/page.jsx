"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../../../../../lib/firebase";

export default function AdminSupportPage() {
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang === "ru" ? "ru" : "en";
  const base = `/${lang}`;

  const [loading, setLoading] = useState(true);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("all");

  // Option A state
  const [drafts, setDrafts] = useState({}); // { [ticketId]: string }
  const [saving, setSaving] = useState({}); // { [ticketId]: boolean }
  const [editMode, setEditMode] = useState({}); // { [ticketId]: boolean }

  const t = useMemo(() => {
    const en = {
      title: "Support",
      subtitle: "View and manage customer support tickets.",
      back: "Back to Admin",

      customerEmail: "Customer Email",
      subject: "Subject",
      message: "Message",
      status: "Status",
      created: "Created",
      reply: "Admin Reply",
      actions: "Actions",

      open: "open",
      closed: "closed",

      noTickets: "No support tickets yet.",

      all: "ALL",
      filterOpen: "OPEN",
      filterClosed: "CLOSED",

      replyPlaceholder: "Write your reply to the customer...",
      sendReply: "Send Reply",
      editReply: "Edit Reply",
      cancel: "Cancel",
      delete: "Delete",
      repliedOn: "Replied",
      saved: "Sent",
      confirmDelete: "Delete this ticket?",
    };

    const ru = {
      title: "Поддержка",
      subtitle: "Просмотр и управление запросами клиентов.",
      back: "Назад",

      customerEmail: "Email клиента",
      subject: "Тема",
      message: "Сообщение",
      status: "Статус",
      created: "Создано",
      reply: "Ответ администратора",
      actions: "Действия",

      open: "open",
      closed: "closed",

      noTickets: "Пока нет запросов.",

      all: "ВСЕ",
      filterOpen: "ОТКРЫТЫЕ",
      filterClosed: "ЗАКРЫТЫЕ",

      replyPlaceholder: "Напишите ответ клиенту...",
      sendReply: "Отправить",
      editReply: "Редактировать",
      cancel: "Отмена",
      delete: "Удалить",
      repliedOn: "Отвечено",
      saved: "Отправлено",
      confirmDelete: "Удалить этот запрос?",
    };

    return lang === "ru" ? ru : en;
  }, [lang]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      try {
        if (!u) {
          router.replace(`${base}/login`);
          return;
        }

        // ✅ Role check
        const snap = await getDoc(doc(db, "users", u.uid));
        const role = snap.exists() ? (snap.data()?.role || "customer") : "customer";
        if (String(role).toLowerCase() !== "admin") {
          router.replace(`${base}/portal`);
          return;
        }

        await loadTickets("all");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  async function loadTickets(nextFilter) {
    setTicketsLoading(true);
    try {
      const baseCol = collection(db, "support_tickets");

      const q =
        nextFilter === "all"
          ? query(baseCol, orderBy("createdAt", "desc"))
          : query(baseCol, where("status", "==", nextFilter), orderBy("createdAt", "desc"));

      const snap = await getDocs(q);
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setTickets(list);

      // init drafts + editMode
      const nextDrafts = {};
      const nextEdit = {};
      list.forEach((x) => {
        nextDrafts[x.id] = x.adminReply || "";
        nextEdit[x.id] = !x.adminReply; // ✅ if no reply yet, show textarea
      });
      setDrafts(nextDrafts);
      setEditMode(nextEdit);
    } finally {
      setTicketsLoading(false);
    }
  }

  function setFilterAndLoad(f) {
    setFilter(f);
    loadTickets(f);
  }

  async function changeStatus(id, status) {
    await updateDoc(doc(db, "support_tickets", id), {
      status,
      updatedAt: serverTimestamp(),
    });
    await loadTickets(filter);
  }

  async function sendReply(ticketId) {
    const replyText = (drafts[ticketId] || "").trim();
    if (!replyText) return;

    setSaving((p) => ({ ...p, [ticketId]: true }));
    try {
      await updateDoc(doc(db, "support_tickets", ticketId), {
        adminReply: replyText,
        repliedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // ✅ Optional: auto-close once replied (recommended)
        status: "closed",
      });

      // ✅ After save, hide textarea and show read-only reply
      setEditMode((p) => ({ ...p, [ticketId]: false }));

      await loadTickets(filter);
    } finally {
      setSaving((p) => ({ ...p, [ticketId]: false }));
    }
  }

  function startEdit(ticketId) {
    setEditMode((p) => ({ ...p, [ticketId]: true }));
  }

  function cancelEdit(ticketId, originalReply) {
    // revert draft back to stored reply
    setDrafts((p) => ({ ...p, [ticketId]: originalReply || "" }));
    setEditMode((p) => ({ ...p, [ticketId]: false }));
  }

  async function removeTicket(id) {
    if (!confirm(t.confirmDelete)) return;
    await deleteDoc(doc(db, "support_tickets", id));
    await loadTickets(filter);
  }

  if (loading) return <div style={{ padding: 30 }}>Loading…</div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={{ margin: 0, fontSize: 36 }}>{t.title}</h1>
            <div style={{ marginTop: 8, color: "#6a768a", fontWeight: 800 }}>
              {t.subtitle}
            </div>
          </div>

          <button style={styles.btnGhost} onClick={() => router.push(`${base}/admin`)}>
            {t.back}
          </button>
        </div>

        {/* Filters */}
        <div style={styles.filtersRow}>
          <div style={styles.tabs}>
            <button style={tabBtn(filter === "all")} onClick={() => setFilterAndLoad("all")}>
              {t.all}
            </button>
            <button style={tabBtn(filter === "open")} onClick={() => setFilterAndLoad("open")}>
              {t.filterOpen}
            </button>
            <button style={tabBtn(filter === "closed")} onClick={() => setFilterAndLoad("closed")}>
              {t.filterClosed}
            </button>
          </div>
        </div>

        <div style={styles.panel}>
          {ticketsLoading ? (
            <div>Loading tickets…</div>
          ) : tickets.length === 0 ? (
            <div style={{ opacity: 0.85 }}>{t.noTickets}</div>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>{t.customerEmail}</th>
                    <th style={styles.th}>{t.subject}</th>
                    <th style={styles.th}>{t.message}</th>
                    <th style={styles.th}>{t.status}</th>
                    <th style={styles.th}>{t.created}</th>
                    <th style={styles.th}>{t.reply}</th>
                    <th style={styles.th}>{t.actions}</th>
                  </tr>
                </thead>

                <tbody>
                  {tickets.map((tk) => {
                    const hasReply = !!tk.adminReply;
                    const isEditing = !!editMode[tk.id];

                    return (
                      <tr key={tk.id}>
                        <td style={styles.td}>{tk.email || "-"}</td>

                        <td style={styles.td}>
                          <div style={{ fontWeight: 900 }}>{tk.subject || "-"}</div>
                        </td>

                        <td style={styles.td}>
                          <div style={{ maxWidth: 340, whiteSpace: "pre-wrap" }}>
                            {tk.message || "-"}
                          </div>
                        </td>

                        <td style={styles.td}>
                          <select
                            value={tk.status || "open"}
                            onChange={(e) => changeStatus(tk.id, e.target.value)}
                            style={styles.select}
                          >
                            <option value="open">{t.open}</option>
                            <option value="closed">{t.closed}</option>
                          </select>
                        </td>

                        <td style={styles.td}>
                          {tk.createdAt?.toDate ? tk.createdAt.toDate().toLocaleString() : "-"}
                        </td>

                        {/* ✅ OPTION A: Reply column */}
                        <td style={styles.td}>
                          {/* If there is a reply and not editing => show read-only */}
                          {hasReply && !isEditing && (
                            <div style={styles.replyReadOnly}>
                              <div style={styles.replyTitleRow}>
                                <div style={{ fontWeight: 900 }}>{t.saved}</div>
                                <button
                                  style={styles.btnSmallGhost}
                                  onClick={() => startEdit(tk.id)}
                                >
                                  {t.editReply}
                                </button>
                              </div>

                              <div style={styles.replyText}>{tk.adminReply}</div>

                              <div style={styles.replyMeta}>
                                {t.repliedOn}:{" "}
                                {tk.repliedAt?.toDate ? tk.repliedAt.toDate().toLocaleString() : "-"}
                              </div>
                            </div>
                          )}

                          {/* If no reply yet OR editing => show textarea */}
                          {(!hasReply || isEditing) && (
                            <>
                              <textarea
                                value={drafts[tk.id] ?? ""}
                                onChange={(e) =>
                                  setDrafts((p) => ({ ...p, [tk.id]: e.target.value }))
                                }
                                placeholder={t.replyPlaceholder}
                                style={styles.textarea}
                                rows={4}
                              />

                              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                                <button
                                  style={styles.btnPrimary}
                                  onClick={() => sendReply(tk.id)}
                                  disabled={!!saving[tk.id] || !(drafts[tk.id] || "").trim()}
                                >
                                  {saving[tk.id] ? "..." : t.sendReply}
                                </button>

                                {hasReply && (
                                  <button
                                    style={styles.btnSmallGhost}
                                    onClick={() => cancelEdit(tk.id, tk.adminReply)}
                                  >
                                    {t.cancel}
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </td>

                        <td style={styles.td}>
                          <button style={styles.btnDanger} onClick={() => removeTicket(tk.id)}>
                            {t.delete}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const tabBtn = (active) => ({
  padding: "10px 14px",
  borderRadius: 999,
  border: active ? "2px solid #0e2a38" : "1px solid #e7ecf3",
  background: active ? "#fff" : "#f6f8fc",
  fontWeight: 900,
  cursor: "pointer",
});

const styles = {
  page: { minHeight: "100vh", background: "#f7f9fc", padding: 18 },
  container: { width: "min(1200px, 96%)", margin: "0 auto" },

  headerRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 16,
  },

  filtersRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 14,
  },
  tabs: { display: "flex", gap: 10, flexWrap: "wrap" },

  panel: {
    background: "#fff",
    border: "1px solid #e7ecf3",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 18px 45px rgba(16,24,40,.06)",
  },

  tableWrap: {
    width: "100%",
    overflowX: "auto",
    border: "1px solid #e7ecf3",
    borderRadius: 14,
  },
  table: { width: "100%", borderCollapse: "collapse" },

  th: {
    textAlign: "left",
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: "#6a768a",
    padding: "12px 10px",
    borderBottom: "1px solid #e7ecf3",
    background: "#f6f8fc",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "12px 10px",
    borderBottom: "1px solid #eef2f7",
    fontWeight: 800,
    fontSize: 13,
    verticalAlign: "top",
    whiteSpace: "normal",
  },

  select: {
    padding: "8px 10px",
    borderRadius: 12,
    border: "1px solid #e7ecf3",
    fontWeight: 900,
    background: "#fff",
  },

  textarea: {
    width: 360,
    maxWidth: "40vw",
    minWidth: 240,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e7ecf3",
    outline: "none",
    fontWeight: 700,
    background: "#fff",
    resize: "vertical",
  },

  replyReadOnly: {
    width: 360,
    maxWidth: "40vw",
    minWidth: 240,
    borderRadius: 14,
    border: "1px solid #cfe3ff",
    background: "#eef6ff",
    padding: 12,
  },
  replyTitleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 8,
  },
  replyText: { whiteSpace: "pre-wrap", fontWeight: 800 },
  replyMeta: { marginTop: 10, fontSize: 12, opacity: 0.75, fontWeight: 900 },

  btnGhost: {
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid #e7ecf3",
    background: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },

  btnSmallGhost: {
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid #e7ecf3",
    background: "#fff",
    fontWeight: 900,
    cursor: "pointer",
    fontSize: 12,
    whiteSpace: "nowrap",
  },

  btnPrimary: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #0e2a38",
    background: "#0e2a38",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },

  btnDanger: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #b71e1e",
    background: "#d62828",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },
};