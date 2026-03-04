"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../../lib/firebase";

function Icon({ name }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
  };

  if (name === "grid")
    return (
      <svg {...common}>
        <path d="M4 4h7v7H4z" />
        <path d="M13 4h7v7h-7z" />
        <path d="M4 13h7v7H4z" />
        <path d="M13 13h7v7h-7z" />
      </svg>
    );

  if (name === "users")
    return (
      <svg {...common}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );

  if (name === "file")
    return (
      <svg {...common}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
      </svg>
    );

  if (name === "help")
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4" />
        <path d="M12 17h.01" />
      </svg>
    );

  if (name === "settings")
    return (
      <svg {...common}>
        <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" />
        <path d="M19.4 15a7.8 7.8 0 0 0 .1-2l2-1.5-2-3.5-2.4 1a8.3 8.3 0 0 0-1.7-1L15 2h-6l-.4 2.5a8.3 8.3 0 0 0-1.7 1L4.5 4.5l-2 3.5 2 1.5a7.8 7.8 0 0 0 .1 2l-2 1.5 2 3.5 2.4-1a8.3 8.3 0 0 0 1.7 1L9 22h6l.4-2.5a8.3 8.3 0 0 0 1.7-1l2.4 1 2-3.5z" />
      </svg>
    );

  return null;
}

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "grid" },
  { label: "Users", href: "/admin/users", icon: "users" },
  { label: "Documents", href: "/admin/documents", icon: "file" },
  { label: "Support", href: "/admin/support", icon: "help" }, // ✅ NEW
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang === "ru" ? "ru" : "en";

  const base = useMemo(() => `/${lang}`, [lang]);

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          router.replace(`${base}/admin/login`);
          return;
        }

        setEmail(user.email || "");

        // ✅ Role check from Firestore
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        const role = snap.exists() ? (snap.data()?.role || "").toLowerCase() : "";

        if (role !== "admin") {
          setIsAdmin(false);
          router.replace(`${base}/home`);
          return;
        }

        setIsAdmin(true);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router, base]);

  const doLogout = async () => {
    await signOut(auth);
    router.push(`${base}/admin/login`);
  };

  const go = (href) => {
    setMobileOpen(false);
    router.push(`${base}${href}`);
  };

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner} />
          <div style={{ fontWeight: 700 }}>Loading admin…</div>
          <div style={{ color: "#6a768a", marginTop: 6, fontSize: 13 }}>
            Verifying access
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div style={styles.shell}>
      {/* Sidebar (desktop) */}
      <aside style={styles.sidebar}>
        <div style={styles.brandRow} onClick={() => router.push(`${base}/home`)}>
          <div style={styles.logoDot} />
          <div>
            <div style={styles.brandName}>ALIM TAX</div>
            <div style={styles.brandSub}>Admin Console</div>
          </div>
        </div>

        <nav style={styles.nav}>
          {NAV.map((item) => (
            <button
              key={item.href}
              style={styles.navItem}
              onClick={() => go(item.href)}
            >
              <span style={styles.navIcon}>
                <Icon name={item.icon} />
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userChip}>
            <div style={styles.avatar}>
              {(email?.[0] || "A").toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={styles.userRole}>Admin</div>
              <div style={styles.userEmail} title={email}>
                {email}
              </div>
            </div>
          </div>
          <button style={styles.logoutBtn} onClick={doLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          style={styles.drawerOverlay}
          onClick={() => setMobileOpen(false)}
        >
          <div style={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div style={styles.drawerTop}>
              <div
                style={styles.brandRow}
                onClick={() => router.push(`${base}/home`)}
              >
                <div style={styles.logoDot} />
                <div>
                  <div style={styles.brandName}>ALIM TAX</div>
                  <div style={styles.brandSub}>Admin Console</div>
                </div>
              </div>
              <button
                style={styles.iconBtnSmall}
                onClick={() => setMobileOpen(false)}
              >
                ✕
              </button>
            </div>

            <nav style={styles.nav}>
              {NAV.map((item) => (
                <button
                  key={item.href}
                  style={styles.navItem}
                  onClick={() => go(item.href)}
                >
                  <span style={styles.navIcon}>
                    <Icon name={item.icon} />
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div style={styles.sidebarFooter}>
              <div style={styles.userChip}>
                <div style={styles.avatar}>
                  {(email?.[0] || "A").toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={styles.userRole}>Admin</div>
                  <div style={styles.userEmail} title={email}>
                    {email}
                  </div>
                </div>
              </div>
              <button style={styles.logoutBtn} onClick={doLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <main style={styles.main}>
        <header style={styles.topbar}>
          <button style={styles.iconBtn} onClick={() => setMobileOpen(true)}>
            ☰
          </button>

          <div style={styles.topbarRight}>
            <div style={styles.pill}>
              <span style={{ opacity: 0.75 }}>Signed in:</span>
              <span style={{ fontWeight: 800, marginLeft: 8 }}>{email}</span>
            </div>
            <button style={styles.primaryBtn} onClick={doLogout}>
              Logout
            </button>
          </div>
        </header>

        <div style={styles.content}>{children}</div>
      </main>
    </div>
  );
}

const styles = {
  shell: {
    minHeight: "100vh",
    display: "flex",
    background: "#f6f8fc",
    color: "#0b1220",
    fontFamily: 'ui-serif, Georgia, "Times New Roman", Times, serif',
  },

  // ✅ make sidebar visible (desktop)
  sidebar: {
    width: 280,
    background: "linear-gradient(180deg, #0b2230, #0e2a38)",
    color: "#fff",
    padding: 18,
    display: "flex",
    flexDirection: "column",
  },

  main: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column" },

  topbar: {
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid #e7ecf3",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },

  topbarRight: { display: "flex", gap: 10, alignItems: "center" },

  pill: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 12px",
    border: "1px solid #e7ecf3",
    borderRadius: 999,
    background: "#fff",
    fontSize: 13,
    maxWidth: 420,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  content: { padding: 18, maxWidth: 1200, width: "100%", margin: "0 auto" },

  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
    userSelect: "none",
  },

  logoDot: {
    width: 14,
    height: 14,
    borderRadius: 6,
    background: "#d62828",
    boxShadow: "0 10px 30px rgba(214,40,40,.35)",
  },

  brandName: { fontWeight: 900, letterSpacing: 0.6 },
  brandSub: { fontSize: 12, opacity: 0.75, marginTop: 2 },

  nav: { marginTop: 18, display: "flex", flexDirection: "column", gap: 8 },

  navItem: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,.10)",
    background: "rgba(255,255,255,.06)",
    color: "#fff",
    cursor: "pointer",
    textAlign: "left",
    fontWeight: 800,
  },

  navIcon: { display: "inline-flex", opacity: 0.95 },

  sidebarFooter: {
    marginTop: "auto",
    paddingTop: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  userChip: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    background: "rgba(255,255,255,.08)",
    border: "1px solid rgba(255,255,255,.12)",
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    background: "rgba(255,255,255,.16)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
  },

  userRole: { fontSize: 12, opacity: 0.8, marginBottom: 2 },
  userEmail: {
    fontSize: 13,
    fontWeight: 900,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: 180,
  },

  logoutBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,.18)",
    background: "rgba(214,40,40,.16)",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },

  primaryBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e7ecf3",
    background: "#d62828",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },

  // ✅ show hamburger button
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    border: "1px solid #e7ecf3",
    background: "#fff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontWeight: 900,
  },

  iconBtnSmall: {
    width: 38,
    height: 38,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,.18)",
    background: "rgba(255,255,255,.10)",
    color: "#fff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontWeight: 900,
  },

  drawerOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(11,18,32,.45)",
    zIndex: 50,
    display: "flex",
  },

  drawer: {
    width: 290,
    height: "100%",
    background: "linear-gradient(180deg, #0b2230, #0e2a38)",
    padding: 18,
    color: "#fff",
  },

  drawerTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  loadingWrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0e2a38, #123d52)",
    padding: 20,
  },

  loadingCard: {
    background: "#fff",
    borderRadius: 16,
    padding: 22,
    width: "min(460px, 92%)",
    boxShadow: "0 18px 45px rgba(16,24,40,.25)",
    textAlign: "center",
  },

  spinner: {
    width: 34,
    height: 34,
    borderRadius: 999,
    border: "4px solid #e7ecf3",
    borderTopColor: "#d62828",
    margin: "0 auto 12px",
  },
};