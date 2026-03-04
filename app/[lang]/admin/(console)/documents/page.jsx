"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../../../../lib/firebase";

const TABS = ["all", "pending", "reviewed", "approved"];

export default function AdminDocumentsPage() {
  const [active, setActive] = useState("all");
  const [search, setSearch] = useState("");
  const [docsLoading, setDocsLoading] = useState(true);
  const [documents, setDocuments] = useState([]);

  const filteredLocal = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return documents;
    return documents.filter((d) => {
      const email = (d.email || "").toLowerCase();
      const file = (d.fileName || "").toLowerCase();
      return email.includes(s) || file.includes(s);
    });
  }, [documents, search]);

  const load = async (tab) => {
    setDocsLoading(true);
    try {
      const base = collection(db, "documents");
      const q =
        tab === "all"
          ? query(base, orderBy("createdAt", "desc"))
          : query(base, where("status", "==", tab), orderBy("createdAt", "desc"));

      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setDocuments(list);
    } finally {
      setDocsLoading(false);
    }
  };

  useEffect(() => {
    load(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const downloadDoc = async (storagePath) => {
    try {
      const url = await getDownloadURL(ref(storage, storagePath));
      window.open(url, "_blank");
    } catch (e) {
      console.error("DOWNLOAD ERROR:", e);
      alert("Unable to download. Check Storage rules.");
    }
  };

// ✅ status update (NO notifications)
const setStatus = async (docId, newStatus) => {
  try {
    await updateDoc(doc(db, "documents", docId), {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });

    await load(active);
  } catch (e) {
    console.error("STATUS UPDATE ERROR:", e);
    alert("Unable to update status. Check Firestore rules.");
  }
};

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 34 }}>Documents</h1>
      <p style={{ marginTop: 8, color: "#6a768a", fontWeight: 700 }}>
        Review customer uploads, filter by status, and update progress.
      </p>

      {/* Filters row */}
      <div style={styles.topRow}>
        <div style={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              style={tabBtn(active === t)}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email or filename…"
          style={styles.search}
        />
      </div>

      <div style={styles.panel}>
        {docsLoading ? (
          <div>Loading documents…</div>
        ) : filteredLocal.length === 0 ? (
          <div>No documents found.</div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>File</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Uploaded</th>
                  <th style={styles.th}>Download</th>
                  <th style={styles.th}>Update</th>
                </tr>
              </thead>
              <tbody>
                {filteredLocal.map((d) => (
                  <tr key={d.id}>
                    <td style={styles.td}>{d.email || "-"}</td>
                    <td style={styles.td}>{d.fileName || "-"}</td>
                    <td style={styles.td}>
                      <span style={badgeStyle(d.status)}>
                        {d.status || "pending"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {d.createdAt?.toDate
                        ? d.createdAt.toDate().toLocaleString()
                        : "-"}
                    </td>
                    <td style={styles.td}>
                      <button
                        style={styles.btnGhost}
                        onClick={() => downloadDoc(d.storagePath)}
                      >
                        Download
                      </button>
                    </td>
                    <td style={styles.td}>
                      <select
                        value={d.status || "pending"}
                        onChange={(e) => setStatus(d.id, e.target.value)}
                        style={styles.select}
                      >
                        <option value="pending">pending</option>
                        <option value="reviewed">reviewed</option>
                        <option value="approved">approved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
  topRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    flexWrap: "wrap",
  },
  tabs: { display: "flex", gap: 10, flexWrap: "wrap" },
  search: {
    minWidth: 280,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e7ecf3",
    fontWeight: 800,
    outline: "none",
    background: "#fff",
  },
  panel: {
    marginTop: 14,
    background: "#fff",
    border: "1px solid #e7ecf3",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 18px 45px rgba(16,24,40,.06)",
  },
  tableWrap: { width: "100%", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: "#6a768a",
    padding: "10px 8px",
    borderBottom: "1px solid #e7ecf3",
  },
  td: {
    padding: "12px 8px",
    borderBottom: "1px solid #eef2f7",
    fontWeight: 800,
  },
  btnGhost: {
    padding: "8px 12px",
    borderRadius: 12,
    border: "1px solid #e7ecf3",
    background: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },
  select: {
    padding: "8px 10px",
    borderRadius: 12,
    border: "1px solid #e7ecf3",
    fontWeight: 900,
    background: "#fff",
  },
};

function badgeStyle(status) {
  if (status === "approved")
    return {
      padding: "6px 10px",
      borderRadius: 999,
      border: "1px solid #0e2a38",
      background: "#eef6ff",
      fontWeight: 900,
    };
  if (status === "reviewed")
    return {
      padding: "6px 10px",
      borderRadius: 999,
      border: "1px solid #6a768a",
      background: "#f2f4f7",
      fontWeight: 900,
    };
  return {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid #d62828",
    background: "#fff5f5",
    color: "#b71e1e",
    fontWeight: 900,
  };
}