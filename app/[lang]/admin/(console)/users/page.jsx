"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../../lib/firebase";

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [busyUid, setBusyUid] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((u) => {
      const email = (u.email || "").toLowerCase();
      const role = (u.role || "customer").toLowerCase();
      return email.includes(s) || role.includes(s);
    });
  }, [rows, search]);

  const toggleAdmin = async (u) => {
    const uid = u.uid || u.id;
    if (!uid) return;

    const current = (u.role || "customer").toLowerCase();
    const next = current === "admin" ? "customer" : "admin";

    try {
      setBusyUid(uid);
      await updateDoc(doc(db, "users", uid), {
        role: next,
        updatedAt: serverTimestamp(),
      });

      // update UI without full reload
      setRows((prev) =>
        prev.map((x) =>
          (x.uid || x.id) === uid ? { ...x, role: next } : x
        )
      );
    } catch (e) {
      console.error("TOGGLE ADMIN ERROR:", e);
      alert("Unable to update role. Check Firestore rules / admin access.");
    } finally {
      setBusyUid(null);
    }
  };

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 34 }}>Users</h1>
      <p style={{ marginTop: 8, color: "#6a768a", fontWeight: 700 }}>
        Manage accounts and admin access.
      </p>

      <div style={styles.topRow}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email or role…"
          style={styles.search}
        />

        <button onClick={loadUsers} style={styles.btnGhost}>
          Refresh
        </button>
      </div>

      <div style={styles.panel}>
        {loading ? (
          <div>Loading users…</div>
        ) : filtered.length === 0 ? (
          <div>No users found.</div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Created</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const uid = u.uid || u.id;
                  const role = (u.role || "customer").toLowerCase();
                  const isAdmin = role === "admin";

                  return (
                    <tr key={uid}>
                      <td style={styles.td}>{u.email || "-"}</td>

                      <td style={styles.td}>
                        <span style={badgeStyle(role)}>
                          {isAdmin ? "admin" : "customer"}
                        </span>
                      </td>

                      <td style={styles.td}>
                        {u.createdAt?.toDate
                          ? u.createdAt.toDate().toLocaleString()
                          : "-"}
                      </td>

                      <td style={styles.td}>
                        <button
                          onClick={() => toggleAdmin(u)}
                          disabled={busyUid === uid}
                          style={isAdmin ? styles.btnDanger : styles.btnPrimary}
                        >
                          {busyUid === uid
                            ? "Updating…"
                            : isAdmin
                            ? "Remove Admin"
                            : "Make Admin"}
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
  );
}

const styles = {
  topRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    flexWrap: "wrap",
  },
  search: {
    minWidth: 320,
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
    verticalAlign: "top",
  },
  btnGhost: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e7ecf3",
    background: "#fff",
    fontWeight: 900,
    cursor: "pointer",
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

function badgeStyle(role) {
  if (role === "admin")
    return {
      padding: "6px 10px",
      borderRadius: 999,
      border: "1px solid #0e2a38",
      background: "#eef6ff",
      fontWeight: 900,
    };

  return {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid #6a768a",
    background: "#f2f4f7",
    fontWeight: 900,
  };
}