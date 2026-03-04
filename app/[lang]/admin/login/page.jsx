"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../../lib/firebase";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang === "ru" ? "ru" : "en";

  const t = useMemo(() => {
    const en = {
      title: "Admin Login",
      email: "Email",
      password: "Password",
      login: "Login",
      home: "Back to Home",
      err: "Invalid credentials or not an admin.",
    };

    const ru = {
      title: "Вход администратора",
      email: "Email",
      password: "Пароль",
      login: "Войти",
      home: "На главную",
      err: "Неверные данные или нет доступа администратора.",
    };

    return lang === "ru" ? ru : en;
  }, [lang]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const goHome = () => router.push(`/${lang}`);
  const goDashboard = () => router.push(`/${lang}/admin/dashboard`);

  const login = async () => {
    setMsg("");

    if (!email || !password) {
      setMsg("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      const snap = await getDoc(doc(db, "users", cred.user.uid));
      const role = snap.exists() ? (snap.data()?.role || "").toLowerCase() : "";

      if (role !== "admin") {
        setMsg(t.err);
        return;
      }

      goDashboard();
    } catch (e) {
      console.error(e);
      setMsg(t.err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.logo} onClick={goHome}>
          ALIM TAX
        </div>

        <button style={styles.btnHome} onClick={goHome}>
          {t.home}
        </button>
      </div>

      {/* Login Card */}
      <div style={styles.card}>
        <h1 style={styles.h1}>{t.title}</h1>

        <div style={styles.field}>
          <div style={styles.label}>{t.email}</div>
          <input
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <div style={styles.label}>{t.password}</div>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {msg && <div style={styles.err}>{msg}</div>}

        <div style={styles.row}>
          <button style={styles.btnPrimary} onClick={login} disabled={loading}>
            {loading ? "..." : t.login}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0b2230, #0e2a38)",
    padding: 20,
  },

  navbar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 70,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    color: "#fff",
    fontWeight: "900",
  },

  logo: {
    fontSize: 22,
    cursor: "pointer",
  },

  btnHome: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "none",
    background: "#fff",
    cursor: "pointer",
    fontWeight: "700",
  },

  card: {
    width: "min(500px, 95%)",
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    border: "1px solid #e7ecf3",
    boxShadow: "0 18px 45px rgba(16,24,40,.25)",
  },

  h1: {
    marginBottom: 20,
    fontSize: 28,
  },

  field: {
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 6,
  },

  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e7ecf3",
    fontWeight: 700,
  },

  err: {
    padding: "10px 12px",
    borderRadius: 10,
    background: "#fff5f5",
    border: "1px solid #d62828",
    color: "#b71e1e",
    fontWeight: 800,
    marginBottom: 12,
  },

  row: {
    display: "flex",
    justifyContent: "center",
    marginTop: 10,
  },

  btnPrimary: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #0e2a38",
    background: "#0e2a38",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },
};