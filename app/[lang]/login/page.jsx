"use client";

import { useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../../lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang === "ru" ? "ru" : "en";

  const t = useMemo(
    () => ({
      en: {
        title: "Customer Login",
        email: "Email",
        password: "Password",
        login: "Login",
        signup: "Don’t have an account? Sign Up",
        verifyTitle: "Email not verified",
        verifyMsg: "Please verify your email. You cannot login until verified.",
        resend: "Resend Verification Email",
        sent: "Verification email sent!",
        invalid: "Invalid email or password",
        ok: "Login successful! Opening your portal in a new tab...",
        // Forgot password
        forgot: "Forgot password?",
        resetTitle: "Reset Password",
        resetSend: "Send Reset Link",
        cancel: "Cancel",
        backToLogin: "Back to Login",
        resetNeedEmail: "Please enter your email first.",
        resetSent: "Password reset email sent. Check your inbox.",
        resetFail: "Unable to send reset email. Try again.",
      },
      ru: {
        title: "Вход для клиента",
        email: "Email",
        password: "Пароль",
        login: "Войти",
        signup: "Нет аккаунта? Регистрация",
        verifyTitle: "Email не подтвержден",
        verifyMsg:
          "Подтвердите email. Вход будет доступен только после подтверждения.",
        resend: "Отправить письмо снова",
        sent: "Письмо отправлено!",
        invalid: "Неверный email или пароль",
        ok: "Вход успешен! Открываем ваш кабинет в новой вкладке...",
        // Forgot password
        forgot: "Забыли пароль?",
        resetTitle: "Сброс пароля",
        resetSend: "Отправить ссылку",
        cancel: "Отмена",
        backToLogin: "Назад к входу",
        resetNeedEmail: "Сначала введите email.",
        resetSent: "Письмо для сброса пароля отправлено. Проверьте почту.",
        resetFail: "Не удалось отправить письмо. Попробуйте ещё раз.",
      },
    }),
    []
  )[lang];

  const emailRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [verifyNeeded, setVerifyNeeded] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forgot password modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState({ type: "", text: "" }); // success | error

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setVerifyNeeded(false);
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      // ✅ Block unverified users
      if (!cred.user.emailVerified) {
        setVerifyNeeded(true);
        await signOut(auth);
        return;
      }

      // ✅ Open customer portal in new tab
      window.open(`/${lang}/portal`, "_blank", "noopener,noreferrer");

      // ✅ keep this tab on login page or go home (your choice)
      router.push(`/${lang}`);

      alert(t.ok);
    } catch (err) {
      setError(t.invalid);
    } finally {
      setLoading(false);
    }
  }

  async function resendVerification() {
    setError("");
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
      alert(t.sent);
      await signOut(auth);
    } catch {
      setError(t.invalid);
    }
  }

  async function handleResetSubmit() {
    setResetMsg({ type: "", text: "" });

    if (!resetEmail) {
      setResetMsg({ type: "error", text: t.resetNeedEmail });
      return;
    }

    try {
      setResetLoading(true);
      await sendPasswordResetEmail(auth, resetEmail);

      // ✅ success styling
      setResetMsg({ type: "success", text: t.resetSent });

      // ✅ auto-close after 3 seconds + back-to-login flow + focus
      setTimeout(() => {
        setShowResetModal(false);
        setResetMsg({ type: "", text: "" });
        setEmail(resetEmail);
        emailRef.current?.focus();
      }, 3000);
    } catch (e) {
      console.error("RESET ERROR:", e);
      setResetMsg({ type: "error", text: t.resetFail });
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className="authWrap">
      <div className="authCard">
        <h1>{t.title}</h1>

        {error && <div className="authError">{error}</div>}

        {verifyNeeded && (
          <div className="verifyBox">
            <div className="verifyTitle">{t.verifyTitle}</div>
            <div className="verifyMsg">{t.verifyMsg}</div>
            <button
              className="ghostBtn"
              type="button"
              onClick={resendVerification}
            >
              {t.resend}
            </button>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input
            ref={emailRef}
            type="email"
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder={t.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="forgotRow">
            <button
              type="button"
              className="forgotBtn"
              onClick={() => {
                setResetEmail(email);
                setResetMsg({ type: "", text: "" });
                setShowResetModal(true);
              }}
            >
              {t.forgot}
            </button>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "..." : t.login}
          </button>
        </form>

        <button
          className="linkBtn"
          onClick={() => router.push(`/${lang}/signup`)}
        >
          {t.signup}
        </button>
      </div>

      {/* ✅ Reset Password Modal */}
      {showResetModal && (
        <div
          className="modalOverlay"
          onClick={() => {
            setShowResetModal(false);
            setResetMsg({ type: "", text: "" });
          }}
        >
          <div className="modalBox" onClick={(e) => e.stopPropagation()}>
            <h2>{t.resetTitle}</h2>

            <input
              type="email"
              placeholder={t.email}
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />

            {resetMsg?.text && (
              <div
                className={`resetMsg ${
                  resetMsg.type === "success" ? "ok" : "bad"
                }`}
              >
                {resetMsg.text}
              </div>
            )}

            <div className="modalActions">
              <button
                className="ghostBtn"
                type="button"
                onClick={() => {
                  setShowResetModal(false);
                  setResetMsg({ type: "", text: "" });
                }}
              >
                {t.cancel}
              </button>

              {resetMsg?.type === "success" ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowResetModal(false);
                    setResetMsg({ type: "", text: "" });
                    setEmail(resetEmail);
                    emailRef.current?.focus();
                  }}
                >
                  {t.backToLogin}
                </button>
              ) : (
                <button onClick={handleResetSubmit} disabled={resetLoading}>
                  {resetLoading ? "..." : t.resetSend}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .authWrap {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #0b2b3a, #0a2432);
          padding: 20px;
        }
        .authCard {
          background: #fff;
          padding: 40px;
          border-radius: 20px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
        }
        h1 {
          text-align: center;
          margin-bottom: 18px;
          font-weight: 900;
          color: #0b2b3a;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        input {
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #ddd;
          font-size: 14px;
        }
        input:focus {
          outline: none;
          border-color: #d61f26;
        }
        button[type="submit"] {
          margin-top: 6px;
          background: #d61f26;
          color: #fff;
          border: none;
          padding: 12px;
          border-radius: 999px;
          font-weight: 800;
          cursor: pointer;
        }
        button[type="submit"]:hover {
          background: #be1b21;
        }
        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .linkBtn {
          margin-top: 14px;
          width: 100%;
          background: none;
          border: none;
          color: #d61f26;
          font-weight: 800;
          cursor: pointer;
        }
        .authError {
          background: #ffe6e6;
          color: #b10000;
          padding: 10px;
          border-radius: 10px;
          margin-bottom: 12px;
          text-align: center;
          font-weight: 800;
        }
        .verifyBox {
          background: #fff7e6;
          border: 1px solid #ffe1a6;
          border-radius: 14px;
          padding: 12px;
          margin-bottom: 12px;
        }
        .verifyTitle {
          font-weight: 900;
          margin-bottom: 6px;
          color: #5a3b00;
        }
        .verifyMsg {
          font-size: 13px;
          opacity: 0.9;
          margin-bottom: 10px;
        }
        .ghostBtn {
          background: transparent;
          border: 1px solid rgba(0, 0, 0, 0.15);
          padding: 10px 12px;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 800;
        }

        .forgotRow {
          display: flex;
          justify-content: flex-end;
          margin-top: -6px;
        }
        .forgotBtn {
          background: none;
          border: none;
          padding: 0;
          color: #0b2b3a;
          font-weight: 800;
          cursor: pointer;
          text-decoration: underline;
          font-size: 13px;
        }

        /* ===== Modal ===== */
        .modalOverlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 16px;
        }
        .modalBox {
          background: #fff;
          padding: 26px;
          border-radius: 18px;
          width: 100%;
          max-width: 380px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
          animation: fadeIn 0.2s ease;
        }
        .modalBox h2 {
          margin: 0 0 14px;
          font-weight: 900;
          color: #0b2b3a;
        }
        .modalActions {
          display: flex;
          justify-content: space-between;
          margin-top: 14px;
          gap: 10px;
        }
        .modalActions button {
          flex: 1;
          background: #d61f26;
          color: #fff;
          border: none;
          padding: 12px;
          border-radius: 999px;
          font-weight: 900;
          cursor: pointer;
        }
        .modalActions button.ghostBtn {
          background: transparent;
          color: #0b2b3a;
          border: 1px solid rgba(0, 0, 0, 0.15);
        }

        .resetMsg {
          margin-top: 10px;
          font-size: 13px;
          font-weight: 900;
          padding: 10px 12px;
          border-radius: 12px;
        }
        .resetMsg.ok {
          background: #e9fff1;
          border: 1px solid #7be1a6;
          color: #0a5c2f;
        }
        .resetMsg.bad {
          background: #ffecec;
          border: 1px solid #ff9c9c;
          color: #8a0b0b;
        }

        @keyframes fadeIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}