"use client";

import { useRouter } from "next/navigation";

export default function PrivacyPolicy({ params }) {
  const router = useRouter();
  const lang = params?.lang === "ru" ? "ru" : "en";
  const year = new Date().getFullYear();

  const content = {
    en: {
      pill: "Legal",
      company: "Alim Tax LLC",
      title: "Privacy Policy",
      updated: "Last Updated",
      back: "Back to Home",
      footerNote:
        "This policy is provided for transparency and customer protection. If you have questions, contact us.",
      blocks: [
        {
          h: "Overview",
          p: "Alim Tax LLC (“we”, “our”, “us”) respects your privacy. This Privacy Policy explains how we collect, use, and protect information when you use our website, contact us, or request services.",
        },
        {
          h: "Information We Collect",
          p: "We may collect: (1) contact information such as name, phone number, and email; (2) details you provide related to tax or business services; and (3) basic technical information such as device/browser data and pages visited.",
        },
        {
          h: "How We Use Information",
          p: "We use your information to respond to your requests, provide services, communicate about appointments and document needs, improve our website, and comply with legal obligations.",
        },
        {
          h: "Sharing of Information",
          p: "We do not sell your personal information. We may share information only with trusted service providers as needed to operate our business or when required by law.",
        },
        {
          h: "Security",
          p: "We use reasonable safeguards to protect your information. However, no online transmission or storage method is guaranteed to be 100% secure.",
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
      title: "Политика конфиденциальности",
      updated: "Последнее обновление",
      back: "На главную",
      footerNote:
        "Этот документ создан для прозрачности и защиты клиентов. Если есть вопросы — напишите нам.",
      blocks: [
        {
          h: "Общая информация",
          p: "Alim Tax LLC («мы», «наш», «нас») уважает вашу конфиденциальность. Этот документ объясняет, как мы собираем, используем и защищаем информацию.",
        },
        {
          h: "Какие данные мы собираем",
          p: "Мы можем собирать: (1) контактные данные (имя, телефон, email); (2) данные, которые вы предоставляете для налоговых или бизнес-услуг; (3) базовые технические данные (устройство/браузер, посещенные страницы).",
        },
        {
          h: "Как мы используем данные",
          p: "Мы используем данные, чтобы отвечать на запросы, предоставлять услуги, связываться по поводу записи/документов, улучшать сайт и соблюдать требования закона.",
        },
        {
          h: "Передача данных",
          p: "Мы не продаем персональные данные. Мы можем передавать информацию только надежным поставщикам сервисов (при необходимости) или если это требуется по закону.",
        },
        {
          h: "Безопасность",
          p: "Мы применяем разумные меры защиты, однако ни один метод передачи/хранения данных не гарантирует 100% безопасность.",
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