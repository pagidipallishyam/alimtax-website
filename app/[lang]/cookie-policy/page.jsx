"use client";

import { useRouter } from "next/navigation";

export default function CookiePolicy({ params }) {
  const router = useRouter();
  const lang = params?.lang === "ru" ? "ru" : "en";
  const year = new Date().getFullYear();

  const content = {
    en: {
      pill: "Legal",
      company: "Alim Tax LLC",
      title: "Cookie Policy",
      updated: "Last Updated",
      back: "Back to Home",
      footerNote:
        "Cookies help us keep the website functional and improve the user experience.",
      blocks: [
        {
          h: "What Are Cookies?",
          p: "Cookies are small text files stored on your device that help websites function and improve user experience.",
        },
        {
          h: "How We Use Cookies",
          p: "We may use cookies for essential site functionality, performance/analytics, and security. Some cookies may be set by third-party tools used to operate the site.",
        },
        {
          h: "Your Choices",
          p: "You can control cookies through your browser settings. Disabling cookies may affect some features or functionality.",
        },
        {
          h: "Contact",
          p: "Questions? Email: Ua.alimtax@gmail.com",
        },
      ],
    },
    ru: {
      pill: "Документы",
      company: "Alim Tax LLC",
      title: "Политика файлов cookie",
      updated: "Последнее обновление",
      back: "На главную",
      footerNote:
        "Cookie помогают сайту работать корректно и улучшают пользовательский опыт.",
      blocks: [
        {
          h: "Что такое cookie?",
          p: "Cookie — это небольшие текстовые файлы, которые сохраняются на вашем устройстве и помогают сайту работать и улучшать пользовательский опыт.",
        },
        {
          h: "Как мы используем cookie",
          p: "Мы можем использовать cookie для работы сайта, аналитики/улучшения производительности и безопасности. Некоторые cookie могут устанавливаться сторонними сервисами.",
        },
        {
          h: "Ваш выбор",
          p: "Вы можете управлять cookie через настройки браузера. Отключение cookie может повлиять на работу отдельных функций сайта.",
        },
        {
          h: "Контакты",
          p: "Вопросы? Email: Ua.alimtax@gmail.com",
        },
      ],
    },
  };

  const t = content[lang];

  return (
    <section style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topRow}>
          <div style={styles.leftTop}>
            <div style={styles.pill}>{t.pill}</div>
            <div style={styles.company}>{t.company}</div>
          </div>

          <button onClick={() => router.push(`/${lang}`)} style={styles.backBtn}>
            <span style={{ opacity: 0.9 }}>←</span>
            <span style={{ opacity: 0.95 }}>{t.back}</span>
          </button>
        </div>

        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.h1}>{t.title}</h1>
            <div style={styles.meta}>
              {t.updated}: {year}
            </div>
          </div>

          <div style={styles.blocks}>
            {t.blocks.map((b, i) => (
              <div key={i} style={styles.blockCard}>
                <div style={styles.blockTitle}>{b.h}</div>
                <div style={styles.blockText}>{b.p}</div>
              </div>
            ))}
          </div>

          <div style={styles.footerNote}>{t.footerNote}</div>
        </div>

        <div style={styles.bottomCopyright}>
          © {year} Alim Tax LLC. All Rights Reserved.
        </div>
      </div>
    </section>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "70px 18px",
    background:
      "radial-gradient(1200px 600px at 20% 10%, rgba(70, 170, 180, 0.25), transparent 55%), radial-gradient(900px 500px at 90% 20%, rgba(120, 80, 220, 0.18), transparent 55%), linear-gradient(180deg, #071a21 0%, #07141a 100%)",
    color: "#fff",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Apple Color Emoji","Segoe UI Emoji"',
  },
  container: { maxWidth: 980, margin: "0 auto" },
  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 18,
  },
  leftTop: { display: "flex", alignItems: "center", gap: 10 },
  pill: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.12)",
    letterSpacing: 0.4,
  },
  company: { fontSize: 13, opacity: 0.85 },
  backBtn: {
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  card: {
    borderRadius: 20,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow:
      "0 20px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
    padding: "26px 20px",
    backdropFilter: "blur(10px)",
  },
  header: { padding: "6px 6px 10px" },
  h1: { fontSize: 34, lineHeight: 1.15, margin: 0, letterSpacing: -0.6 },
  meta: { marginTop: 10, fontSize: 13, opacity: 0.75 },
  blocks: { marginTop: 18, display: "grid", gap: 14 },
  blockCard: {
    borderRadius: 16,
    background: "rgba(0,0,0,0.18)",
    border: "1px solid rgba(255,255,255,0.10)",
    padding: "18px 16px",
  },
  blockTitle: { fontSize: 16, fontWeight: 650, marginBottom: 8, letterSpacing: -0.2 },
  blockText: { lineHeight: 1.7, fontSize: 14.5, opacity: 0.92 },
  footerNote: {
    marginTop: 18,
    paddingTop: 16,
    borderTop: "1px solid rgba(255,255,255,0.10)",
    fontSize: 13,
    opacity: 0.75,
    lineHeight: 1.6,
  },
  bottomCopyright: { marginTop: 18, textAlign: "center", fontSize: 12, opacity: 0.55 },
};