"use client";

import { useRouter } from "next/navigation";

export default function SmsConsent({ params }) {
  const router = useRouter();
  const lang = params?.lang === "ru" ? "ru" : "en";
  const year = new Date().getFullYear();

  const content = {
    en: {
      pill: "Legal",
      company: "Alim Tax LLC",
      title: "SMS Consent & Text Messaging Policy",
      updated: "Last Updated",
      back: "Back to Home",
      footerNote:
        "This policy explains your consent options for text message communication.",
      blocks: [
        {
          h: "Consent",
          p: "By providing your phone number and contacting Alim Tax LLC, you consent to receive text/SMS messages related to your inquiry, appointments, document requests, and service updates.",
        },
        {
          h: "Message Frequency & Charges",
          p: "Message frequency may vary. Standard message and data rates may apply depending on your carrier and plan.",
        },
        {
          h: "Opt-Out",
          p: "You may opt out at any time by replying STOP. For help, reply HELP or email us at Ua.alimtax@gmail.com.",
        },
        {
          h: "Privacy",
          p: "We do not sell your phone number. We use it only for service-related communication as described above.",
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
      title: "Согласие на SMS и политика сообщений",
      updated: "Последнее обновление",
      back: "На главную",
      footerNote:
        "Этот документ объясняет условия согласия и отказа от SMS-сообщений.",
      blocks: [
        {
          h: "Согласие",
          p: "Предоставляя номер телефона и обращаясь в Alim Tax LLC, вы соглашаетесь получать SMS/сообщения по вашему запросу, записи, документам и обновлениям по услугам.",
        },
        {
          h: "Частота и стоимость",
          p: "Частота сообщений может различаться. Ваш оператор может взимать плату за сообщения и передачу данных согласно вашему тарифу.",
        },
        {
          h: "Отказ от сообщений",
          p: "Вы можете отказаться в любое время, ответив STOP. Для помощи ответьте HELP или напишите нам на Ua.alimtax@gmail.com.",
        },
        {
          h: "Конфиденциальность",
          p: "Мы не продаем ваш номер телефона и используем его только для связи по услугам, описанной выше.",
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