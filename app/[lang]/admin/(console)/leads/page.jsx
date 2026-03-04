"use client";

import { useCallback, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

export default function LeadsPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError("");

    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      setError("Not signed in");
      return;
    }

    const token = await user.getIdToken(true);

    const res = await fetch("/api/leads-list", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setLoading(false);
      setError(data?.error || "Failed to load leads");
      return;
    }

    setItems(Array.isArray(data?.leads) ? data.leads : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (!mounted) return;
        await loadLeads();
      } catch (e) {
        if (mounted) setError(e?.message || "Error");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [loadLeads]);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");

      const user = auth.currentUser;
      if (!user) throw new Error("Not signed in");

      const token = await user.getIdToken(true);

      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to update status");

      // refresh list
      await loadLeads();
    } catch (e) {
      setError(e?.message || "Error updating lead");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 34, margin: 0 }}>Leads</h1>
          <p style={{ color: "#64748b", marginTop: 8 }}>Consultation requests</p>
        </div>

        <button style={btnOutline} onClick={loadLeads} disabled={loading}>
          Refresh
        </button>
      </div>

      {loading && <p style={{ marginTop: 12 }}>Loading…</p>}
      {error && (
        <p style={{ color: "#b91c1c", marginTop: 12, whiteSpace: "pre-wrap" }}>{error}</p>
      )}

      {!loading && !error && items.length === 0 && <p style={{ marginTop: 12 }}>No leads yet.</p>}

      {!loading && !error && items.length > 0 && (
        <div style={{ overflowX: "auto", marginTop: 16 }}>
          <table style={table}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <th style={th}>Date</th>
                <th style={th}>Name</th>
                <th style={th}>Phone</th>
                <th style={th}>Email</th>
                <th style={th}>Message</th>
                <th style={th}>Status</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((l) => (
                <tr key={l.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={td}>
                    {l.createdAt ? new Date(l.createdAt).toLocaleString() : "-"}
                  </td>
                  <td style={td}>{l.name || "-"}</td>
                  <td style={td}>{l.phone || "-"}</td>
                  <td style={td}>{l.email || "-"}</td>
                  <td style={{ ...td, whiteSpace: "pre-wrap", maxWidth: 520 }}>
                    {l.message || "-"}
                  </td>

                  <td style={td}>
                    <span style={statusBadge(l.status)}>
                      {String(l.status || "-").toUpperCase()}
                    </span>
                  </td>

                  <td style={td}>
                    {String(l.status || "").toUpperCase() !== "DONE" ? (
                      <button
                        style={btnDone}
                        onClick={() => updateStatus(l.id, "DONE")}
                        disabled={updatingId === l.id}
                        title="Mark this lead as DONE"
                      >
                        {updatingId === l.id ? "Updating..." : "Mark Done"}
                      </button>
                    ) : (
                      <span style={{ color: "#64748b", fontWeight: 700 }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------------- styles ---------------- */

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 10px 25px rgba(2,6,23,0.06)",
};

const th = { textAlign: "left", padding: 10, fontWeight: 800, background: "#f8fafc" };
const td = { padding: 10, verticalAlign: "top" };

const btnDone = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid #16a34a",
  background: "#16a34a",
  color: "white",
  fontWeight: 800,
  cursor: "pointer",
};

const btnOutline = {
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  background: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};

function statusBadge(statusRaw) {
  const s = String(statusRaw || "").toUpperCase();

  if (s === "NEW") {
    return {
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 900,
      background: "#fef3c7",
      color: "#92400e",
      border: "1px solid #fde68a",
    };
  }

  if (s === "DONE") {
    return {
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 900,
      background: "#dcfce7",
      color: "#166534",
      border: "1px solid #bbf7d0",
    };
  }

  return {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
    background: "#e2e8f0",
    color: "#334155",
    border: "1px solid #cbd5e1",
  };
}