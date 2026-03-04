"use client";

import { useRouter } from "next/navigation";

export default function TermsPage({ params }) {
  const router = useRouter();
  const lang = params?.lang === "ru" ? "ru" : "en";
  const year = new Date().getFullYear();

  const content = {
    en: {
      pill: "Legal",
      company: "Alim Tax LLC",
      title: "Terms & Conditions",
      updated: "Effective Date",
      back: "Back to Home",
      footerNote:
        "These Terms are intended to set clear expectations for website use and service engagement.",
      blocks: [
        {
          h: "Agreement",
          p: "By using this website or contacting Alim Tax LLC, you agree to these Terms & Conditions. If you do not agree, please do not use the website.",
        },
        {
          h: "Services",
          p: "We provide tax preparation, accounting, and business support services. Website content is for general information and does not create a client relationship until we confirm engagement.",
        },
        {
          h: "Client Responsibilities",
          p: "You are responsible for providing accurate and complete information, responding promptly to requests, and reviewing filings or documents when requested.",
        },
        {
          h: "Fees & Payments",
          p: "Service fees depend on scope and are communicated during engagement. Payment may be required before final filing or completion of services.",
        },
        {
          h: "No Guarantees",
          p: "Tax outcomes depend on facts and documentation. We do not guarantee refunds, outcomes, or acceptance by any tax authority.",
        },
        {
          h: "Limitation of Liability",
          p: "We are not responsible for penalties or losses caused by inaccurate, incomplete, or late information provided by the client or third parties.",
        },
        {
          h: "Updates",
          p: "We may update these Terms at any time. Continued use of the website constitutes acceptance of updated terms.",
        },
      ],
    },
    ru: {
      pill: "Документы",
      company: "Alim Tax LLC",
      title: "Условия использования",
      updated: "Дата вступления в силу",
      back: "На главную",
      footerNote:
        "Эти Условия помогают установить понятные правила использования сайта и сотрудничества по услугам.",
      blocks: [
        {
          h: "Согласие",
          p: "Используя сайт или связываясь с Alim Tax LLC, вы соглашаетесь с этими Условиями. Если вы не согласны — пожалуйста, не используйте сайт.",
        },
        {
          h: "Услуги",
          p: "Мы предоставляем услуги по налогам, бухгалтерии и бизнес-поддержке. Информация на сайте носит общий характер и не создает клиентские отношения до подтверждения сотрудничества.",
        },
        {
          h: "Обязанности клиента",
          p: "Вы обязаны предоставлять точную и полную информацию, оперативно отвечать на запросы и проверять документы/подачи при необходимости.",
        },
        {
          h: "Оплата",
          p: "Стоимость услуг зависит от объема работ и согласуется при начале сотрудничества. Оплата может потребоваться до финальной подачи или завершения услуги.",
        },
        {
          h: "Без гарантий",
          p: "Результаты по налогам зависят от фактов и документов. Мы не гарантируем размер возврата, результат или принятие документов налоговыми органами.",
        },
        {
          h: "Ограничение ответственности",
          p: "Мы не несем ответственности за штрафы/убытки из-за неточной, неполной или несвоевременной информации, предоставленной клиентом или третьими лицами.",
        },
        {
          h: "Обновления",
          p: "Мы можем обновлять эти Условия в любое время. Продолжение использования сайта означает согласие с обновлениями.",
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