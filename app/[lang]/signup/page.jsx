"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";

import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function SignupPage() {
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang === "ru" ? "ru" : "en";

  const t = useMemo(
    () => ({
      en: {
        title: "Create Account",
        name: "Full Name",
        phone: "Phone Number",
        email: "Email",
        password: "Password",
        confirm: "Re-enter Password",
        show: "Show",
        hide: "Hide",
        signup: "Create Account",
        login: "Already have an account? Login",
        success: "Account created! Please verify your email.",
        emailUsed: "This email is already registered.",
        weakPass: "Password must be at least 6 characters.",
        mismatch: "Passwords do not match.",
        invalidPhone: "Enter a valid phone number.",
      },
      ru: {
        title: "Создать аккаунт",
        name: "Полное имя",
        phone: "Телефон",
        email: "Email",
        password: "Пароль",
        confirm: "Повторите пароль",
        show: "Показать",
        hide: "Скрыть",
        signup: "Создать аккаунт",
        login: "Уже есть аккаунт? Войти",
        success: "Аккаунт создан! Подтвердите email.",
        emailUsed: "Этот email уже зарегистрирован.",
        weakPass: "Пароль должен быть не менее 6 символов.",
        mismatch: "Пароли не совпадают.",
        invalidPhone: "Введите корректный номер телефона.",
      },
    }),
    []
  )[lang];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); // E.164 like +16198675619
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError(t.mismatch);
      return;
    }

    if (!phone || !isValidPhoneNumber(phone)) {
      setError(t.invalidPhone);
      return;
    }

    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        phone, // ✅ E.164 saved
        role: "customer",
        createdAt: serverTimestamp(),
      });

      await sendEmailVerification(user);

      alert(t.success);
      router.push(`/${lang}/login`);
    } catch (err) {
      console.log("Signup error:", err);

      if (err.code === "auth/email-already-in-use") setError(t.emailUsed);
      else if (err.code === "auth/weak-password") setError(t.weakPass);
      else setError("Something went wrong. Check console.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="authWrap">
      <div className="authCard">
        <button
  className="backHomeBtn"
  onClick={() => router.push(`/${lang}`)}
>
  ← Back to Home
</button>
        <h1>{t.title}</h1>

        {error && <div className="authError">{error}</div>}

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder={t.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="phoneWrap">
            <PhoneInput
              international
              defaultCountry="US"
              value={phone}
              onChange={setPhone}
              placeholder={t.phone}
            />
          </div>

          <input
            type="email"
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="passRow">
            <input
              type={showPass ? "text" : "password"}
              placeholder={t.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" className="eyeBtn" onClick={() => setShowPass((v) => !v)}>
              {showPass ? t.hide : t.show}
            </button>
          </div>

          <div className="passRow">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder={t.confirm}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <button type="button" className="eyeBtn" onClick={() => setShowConfirm((v) => !v)}>
              {showConfirm ? t.hide : t.show}
            </button>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "..." : t.signup}
          </button>
        </form>

        <button className="linkBtn" onClick={() => router.push(`/${lang}/login`)}>
          {t.login}
        </button>
      </div>

      <style jsx>{`
        .authWrap {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: radial-gradient(circle at top, #0b2b3a, #081b27);
          padding: 20px;
        }
        .authCard {
          background: #fff;
          padding: 40px;
          border-radius: 22px;
          width: 100%;
          max-width: 520px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
        }
        h1 {
          text-align: center;
          margin-bottom: 18px;
          font-weight: 900;
          color: #0b2b3a;
          font-size: 34px;
          font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
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
          width: 100%;
          background: #fff;
        }
        input:focus {
          outline: none;
          border-color: #d61f26;
        }

        /* Phone input library styling */
        .phoneWrap :global(.PhoneInput) {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .phoneWrap :global(.PhoneInputCountry) {
          border: 1px solid #ddd;
          border-radius: 12px;
          padding: 6px 10px;
          background: #fff;
        }
        .phoneWrap :global(.PhoneInputInput) {
          flex: 1;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #ddd;
          font-size: 14px;
        }
        .phoneWrap :global(.PhoneInputInput:focus) {
          outline: none;
          border-color: #d61f26;
        }

        .passRow {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .eyeBtn {
          border: 1px solid #e5e7eb;
          background: #fff;
          border-radius: 999px;
          padding: 10px 14px;
          font-weight: 900;
          cursor: pointer;
          white-space: nowrap;
        }
        .eyeBtn:hover {
          border-color: #d61f26;
          color: #d61f26;
        }
        button[type="submit"] {
          margin-top: 10px;
          background: #d61f26;
          color: #fff;
          border: none;
          padding: 12px;
          border-radius: 999px;
          font-weight: 900;
          cursor: pointer;
          font-size: 15px;
        }
        button[type="submit"]:hover {
          background: #be1b21;
        }
        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .linkBtn {
          margin-top: 15px;
          width: 100%;
          background: none;
          border: none;
          color: #d61f26;
          font-weight: 900;
          cursor: pointer;
        }
        .authError {
          background: #ffe6e6;
          color: #b10000;
          padding: 10px;
          border-radius: 10px;
          margin-bottom: 12px;
          text-align: center;
          font-weight: 900;
        }
      `}</style>
    </div>
  );
}