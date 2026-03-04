"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "../../../../../lib/firebase";

function Card({ title, value, sub }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>{title}</div>
      <div style={styles.cardValue}>{value}</div>
      <div style={styles.cardSub}>{sub}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [usersCount, setUsersCount] = useState("-");
  const [adminsCount, setAdminsCount] = useState("-");
  const [docsCount, setDocsCount] = useState("-");
  const [newWeek, setNewWeek] = useState("-");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Users
        const usersSnap = await getDocs(collection(db, "users"));
        setUsersCount(usersSnap.size);

        // Admins
        const adminsSnap = await getDocs(
          query(collection(db, "users"), where("role", "==", "admin"))
        );
        setAdminsCount(adminsSnap.size);

        // Documents
        const docsSnap = await getDocs(collection(db, "documents"));
        setDocsCount(docsSnap.size);

        // New this week (based on createdAt)
        const weekAgo = Timestamp.fromDate(
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );
        const newUsersSnap = await getDocs(
          query(collection(db, "users"), where("createdAt", ">=", weekAgo))
        );
        setNewWeek(newUsersSnap.size);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.h1}>Dashboard</h1>
          <div style={styles.muted}>{loading ? "Loading…" : "Admin verified"}</div>
        </div>
      </div>

      <div style={styles.grid}>
        <Card title="TOTAL USERS" value={usersCount} sub="All registered accounts" />
        <Card title="ADMINS" value={adminsCount} sub="Users with admin access" />
        <Card title="DOCUMENTS" value={docsCount} sub="Total uploaded documents" />
        <Card title="NEW THIS WEEK" value={newWeek} sub="New registrations (7 days)" />
      </div>
    </div>
  );
}

const styles = {
  headerRow: { display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 14 },
  h1: { margin: 0, fontSize: 36 },
  muted: { color: "#6a768a", marginTop: 6, fontWeight: 700 },
  grid: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 14, marginTop: 14 },
  card: { background: "#fff", border: "1px solid #e7ecf3", borderRadius: 16, padding: 16, boxShadow: "0 18px 45px rgba(16,24,40,.06)" },
  cardTitle: { color: "#6a768a", fontWeight: 900, fontSize: 12, letterSpacing: 0.4 },
  cardValue: { fontSize: 30, fontWeight: 900, marginTop: 10 },
  cardSub: { color: "#6a768a", marginTop: 8, fontSize: 13, fontWeight: 700 },
};