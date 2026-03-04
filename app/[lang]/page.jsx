"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const BRAND = {
  email: "Ua.alimtax@gmail.com",
  phone1_display: "+1 (619) 867-5619",
  phone1_tel: "+16198675619",
  phone2_display: "+1 (412) 992-0773",
  phone2_tel: "+14129920773",
  address: "3701 W Algonquin Rd Suit 633, Rolling Meadows IL 60008",
  instagram:
    "https://www.instagram.com/ulanbek_alim?igsh=ZnVnNzJuNTJ5ZnVl&utm_source=qr",
  whatsapp1: "https://wa.me/16198675619",
  whatsapp2: "https://wa.me/14129920773",
  mapQuery: "3701 W Algonquin Rd Suit 633, Rolling Meadows IL 60008",
};

const copy = {
  en: {
    nav: {
  services: "Services",
  tax: "Tax Services",
  biz: "Business Services",
  contact: "Contact Us",
  request: "Request Consultation",
  login: "Login",
  customerLogin: "Customer Login",   // ✅ ADD
  adminLogin: "Admin Login",         // ✅ ADD
  signup: "Sign Up",                 // ✅ ADD
},
    header: {
      name: "ALIM TAX LLC",
      tagline: "Tax Preparation & Accounting Services",
    },

    heroTitle: "All-State Tax Preparation & Accounting Services",
    heroSub:
      "Serving individuals and businesses across all 50 states with fast, secure, and professional support.",

    ctas: {
      consult: "Request Consultation",
      file: "File Taxes",
      open: "Open Company",
    },

    // ✅ NEW: WHY CHOOSE US (NEAR HERO)
    whyTitle: "Why Choose Us",
    why: [
      {
        title: "Fast Response",
        desc: "Quick replies by call, text, or WhatsApp — so you get answers without waiting.",
      },
      {
        title: "Secure Document Handling",
        desc: "Your documents are handled confidentially and shared only when required.",
      },
      {
        title: "All 50 States Service",
        desc: "We support clients nationwide — individuals, self-employed, and small businesses.",
      },
      {
        title: "Accurate, Audit-Ready Filing",
        desc: "Clean documentation, correct forms, and careful review to reduce errors.",
      },
    ],

    taxTitle: "TAX SERVICES",
    bizTitle: "BUSINESS SERVICES",

    tax: [
      {
        title: "Individual Tax Return (1040)",
        desc:
          "We prepare and file your federal and state tax return (Form 1040). This includes W-2/1099 income, dependents, deductions, and credits. We review your documents, apply all eligible tax savings, and ensure accurate, on-time filing.",
      },
      {
        title: "Self-Employed / Schedule C",
        desc:
          "For freelancers, contractors, and small business owners. We file Schedule C and help organize income/expenses, mileage, home office, equipment, and deductions. You get clean documentation and maximum legal deductions with proper reporting.",
      },
      {
        title: "LLC & S-Corp Tax Filing (1120 / 1120S)",
        desc:
          "We handle business tax returns for LLCs and S-Corps, including Forms 1120/1120S, business deductions, compliance review, and (if required) K-1 reporting. We keep your filing accurate and audit-ready.",
      },
      {
        title: "Amendments (1040X)",
        desc:
          "Need to fix a previously filed return? We prepare amendments (Form 1040X) to correct income, deductions, credits, or filing mistakes. We explain what changes, the impact, and file the corrected federal/state forms properly.",
      },
      {
        title: "Tax Planning",
        desc:
          "We plan ahead to reduce taxes legally. This includes tax estimates, strategy for deductions/credits, choosing the right structure (LLC vs S-Corp), and guidance for quarterly payments so you avoid surprises and penalties.",
      },
      {
        title: "Tax Extension",
        desc:
          "If you need more time, we file your extension correctly and on time. We also estimate expected tax due to help reduce penalties, and we provide a clear plan to complete the final return before the deadline.",
      },
    ],

    biz: [
      {
        title: "LLC Formation",
        desc:
          "We register your LLC correctly in your chosen state, guide name selection, and help with the setup steps after formation. You’ll be ready for business banking, payments, and legal operation with proper documentation.",
      },
      {
        title: "S-Corp Election",
        desc:
          "If you qualify, S-Corp election can reduce self-employment taxes. We file Form 2553 correctly and on time, explain eligibility, and guide basic payroll setup so your structure stays compliant and optimized.",
      },
      {
        title: "EIN Registration",
        desc:
          "We help you obtain your EIN (Employer Identification Number). This is required for business banking, payroll, vendors, and tax filings. We ensure your EIN details match your business documents to avoid issues.",
      },
      {
        title: "Registered Agent Service",
        desc:
          "A Registered Agent receives legal and state compliance mail for your company. We help ensure you don’t miss deadlines, notices, or important documents—especially helpful if you want privacy or operate in another state.",
      },
      {
        title: "Annual Reports & Compliance",
        desc:
          "Most states require annual filings to keep your business active. We track deadlines and assist with annual reports so you avoid late fees, penalties, and business suspension. Great for stress-free compliance.",
      },
      {
        title: "Business Consultation",
        desc:
          "One-on-one support for business setup, bookkeeping direction, and tax strategy. Ideal for new owners or growing businesses. You’ll get clear steps, better structure, and guidance for tax-ready operations.",
      },
    ],

    aboutTitle: "About",
    aboutText:
      "Licensed tax and accounting professionals delivering nationwide service across all 50 states. We help individuals, entrepreneurs, and businesses stay compliant, reduce tax liability, and grow with confidence through accurate filings, strategic guidance, and dependable year-round support.",

    trust: [
      "IRS Registered",
      "All 50 States Service",
      "Fast Response",
      "Secure Document Handling",
      "Confidential & Compliant",
    ],

    consultTitle: "Request Consultation",
    form: {
      name: "Name",
      phone: "Phone",
      email: "Email (optional)",
      msg: "Message",
      send: "Send",
      note: "You can also call/text us directly for quick help.",
    },

    hoursTitle: "Hours of Operation",
    hours: [
      "Monday – Friday: 10:00 AM – 5:00 PM",
      "Saturday: By Appointment Only",
      "Sunday: By Appointment Only",
    ],

    footerLinks: {
      tax: "Tax Services",
      biz: "Business Services",
      contact: "Contact Us",
    },
    footerCta: "Request Consultation",
  },

  ru: {
    nav: {
  services: "Услуги",
  tax: "Налоговые услуги",
  biz: "Бизнес услуги",
  contact: "Контакты",
  request: "Запросить консультацию",
  login: "Вход",
  customerLogin: "Вход для клиента",     // ✅ ADD
  adminLogin: "Вход для администратора", // ✅ ADD
  signup: "Регистрация",                 // ✅ ADD
},
    header: {
      name: "ALIM TAX LLC",
      tagline: "Налоговые и бухгалтерские услуги",
    },

    heroTitle: "Профессиональные услуги по налогам и бухгалтерскому учёту во всех штатах США",
    heroSub:
      "Поддержка физических лиц и бизнеса во всех 50 штатах — быстро, безопасно и профессионально.",

    ctas: {
      consult: "Запросить консультацию",
      file: "Подать налоги",
      open: "Открыть компанию",
    },

    // ✅ NEW: WHY CHOOSE US (RU)
    whyTitle: "Почему выбирают нас",
    why: [
      {
        title: "Быстрый ответ",
        desc: "Оперативно отвечаем по телефону, SMS или WhatsApp — без ожидания.",
      },
      {
        title: "Безопасная работа с документами",
        desc: "Конфиденциальная обработка и передача только при необходимости.",
      },
      {
        title: "Услуги во всех 50 штатах",
        desc: "Работаем по всей стране: частные лица, самозанятые и малый бизнес.",
      },
      {
        title: "Точная подача, готовая к проверке",
        desc: "Аккуратные формы, корректные расчеты и внимательная проверка.",
      },
    ],

    taxTitle: "НАЛОГОВЫЕ УСЛУГИ",
    bizTitle: "БИЗНЕС УСЛУГИ",

    tax: [
      {
        title: "Индивидуальная декларация (1040)",
        desc:
          "Подготовим и подадим федеральную и штатную декларацию (Form 1040). Включаем доходы W-2/1099, иждивенцев, вычеты и кредиты. Проверяем документы, применяем все законные льготы и подаем вовремя без ошибок.",
      },
      {
        title: "Самозанятые / Schedule C",
        desc:
          "Для фрилансеров и индивидуальных предпринимателей. Заполняем Schedule C, помогаем правильно учесть доходы и расходы, mileage, home office, оборудование и другие вычеты. Вы получаете чистую отчетность и максимум законных списаний.",
      },
      {
        title: "Налоги LLC и S-Corp (1120 / 1120S)",
        desc:
          "Подготовка бизнес-деклараций для LLC и S-Corp (Forms 1120/1120S). Учитываем бизнес-расходы, проверяем соответствие требованиям, при необходимости готовим K-1. Всё оформляем корректно и “audit-ready”.",
      },
      {
        title: "Исправления (Amendments / 1040X)",
        desc:
          "Если вы уже подали декларацию и нашли ошибку или забыли документы — исправим. Готовим Form 1040X, корректируем доходы/вычеты/кредиты и правильно подаем изменения по федеральным и штатным формам.",
      },
      {
        title: "Налоговое планирование",
        desc:
          "Помогаем планировать налоги заранее, чтобы платить меньше законно. Рассчитываем прогноз, подбираем стратегию вычетов/кредитов, помогаем выбрать структуру (LLC vs S-Corp) и настроить quarterly payments.",
      },
      {
        title: "Продление (Extension)",
        desc:
          "Если не успеваете — подадим extension вовремя и корректно. Также оценим возможную сумму к оплате, чтобы снизить штрафы, и составим план, чтобы вы успели подать финальную декларацию до срока.",
      },
    ],

    biz: [
      {
        title: "Регистрация LLC",
        desc:
          "Регистрируем LLC в выбранном штате, помогаем с названием и правильной подачей документов. После регистрации подскажем следующие шаги, чтобы вы могли открыть банковский счет и вести бизнес легально.",
      },
      {
        title: "Переход на S-Corp",
        desc:
          "Если вы подходите по условиям, S-Corp может снизить налоги. Подаем Form 2553 правильно и вовремя, объясняем требования, и даем рекомендации по payroll, чтобы всё было compliant.",
      },
      {
        title: "Получение EIN",
        desc:
          "Поможем получить EIN (Employer Identification Number). Он нужен для банковского счета, payroll, контрактов и налоговой отчетности. Следим, чтобы данные EIN совпадали с документами компании.",
      },
      {
        title: "Registered Agent Service",
        desc:
          "Registered Agent получает официальные письма от штата и юридические уведомления. Мы помогаем организовать надежное получение почты и контроль сроков, чтобы вы ничего не пропустили (особенно если нужна приватность).",
      },
      {
        title: "Годовые отчеты и compliance",
        desc:
          "Во многих штатах требуется ежегодная подача отчетов. Мы помогаем отслеживать дедлайны и правильно подавать annual reports, чтобы избежать штрафов и приостановки деятельности компании.",
      },
      {
        title: "Бизнес консультация",
        desc:
          "Персональная консультация по структуре бизнеса, налоговой стратегии и базовому учету. Подходит для старта или роста. Даем четкие шаги и помогаем настроить систему, чтобы налоги были простыми и понятными.",
      },
    ],

    aboutTitle: "О нас",
    aboutText:
      "Лицензированные специалисты по налогам и бухгалтерии, предоставляющие услуги во всех 50 штатах США. Мы помогаем физическим лицам, предпринимателям и бизнесу соблюдать требования законодательства, снижать налоговую нагрузку и уверенно развиваться благодаря точной отчетности, стратегическим рекомендациям и надежной поддержке круглый год.",

    trust: [
      "Зарегистрированы в IRS",
      "Обслуживание во всех 50 штатах",
      "Быстрый ответ",
      "Безопасная обработка документов",
      "Конфиденциальность и соответствие требованиям",
    ],

    consultTitle: "Запросить консультацию",
    form: {
      name: "Имя",
      phone: "Телефон",
      email: "Email (необязательно)",
      msg: "Сообщение",
      send: "Отправить",
      note: "Также можете позвонить или написать — ответим быстро.",
    },

    hoursTitle: "Часы работы",
    hours: [
      "Понедельник – Пятница: 10:00 – 17:00",
      "Суббота: По записи",
      "Воскресенье: По записи",
    ],

    footerLinks: {
      tax: "Налоговые услуги",
      biz: "Бизнес услуги",
      contact: "Контакты",
    },
    footerCta: "Запросить консультацию",
  },
};

function scrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Page() {
  const router = useRouter();
  const params = useParams();

  const lang = params?.lang === "ru" ? "ru" : "en";
  const t = useMemo(() => copy[lang], [lang]);

const [menuOpen, setMenuOpen] = useState(false);
const [servicesOpen, setServicesOpen] = useState(false);
const dropdownRef = useRef(null);

const [loginOpen, setLoginOpen] = useState(false); // ✅ ADD
const loginRef = useRef(null);                     // ✅ ADD

  useEffect(() => {
  const close = (e) => {
    // close Services dropdown if click outside it
    if (dropdownRef.current && dropdownRef.current.contains(e.target)) {
      return;
    } else {
      setServicesOpen(false);
    }

    // close Login dropdown if click outside it
    if (loginRef.current && loginRef.current.contains(e.target)) {
      return;
    } else {
      setLoginOpen(false);
    }
  };

  window.addEventListener("click", close);
  return () => window.removeEventListener("click", close);
}, []);

  const [openTax, setOpenTax] = useState(null);
  const [openBiz, setOpenBiz] = useState(null);

  function navGo(id) {
    scrollTo(id);
    setMenuOpen(false);
    setServicesOpen(false);
  }

  function goContactInfo() {
    navGo("contact-info");
  }

  function goConsultForm() {
    navGo("consult");
  }

  function switchLang() {
    const next = lang === "en" ? "ru" : "en";
    router.push(`/${next}`);
  }

  async function submitLead(e) {
  e.preventDefault();

  const formEl = e.currentTarget; // ✅ save form reference first
  const fd = new FormData(formEl);

  const payload = {
    name: String(fd.get("name") || ""),
    phone: String(fd.get("phone") || ""),
    email: String(fd.get("email") || ""),
    message: String(fd.get("message") || ""),
    language: lang,
  };

  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    alert(lang === "ru" ? "Отправлено! Мы свяжемся с вами." : "Sent! We’ll contact you.");

    if (formEl && formEl.reset) formEl.reset(); // ✅ safe reset

    goContactInfo();
  } else {
    const data = await res.json().catch(() => ({}));
    alert(data?.error || "Error");
  }
}

  return (
    <div>
      {/* ===== Header ===== */}
      <div className="headerWrap">
        <div className="container headerInner">
          <div
            className="brandLogo headerBrand"
            role="button"
            tabIndex={0}
            onClick={() => navGo("top")}
            onKeyDown={(e) => e.key === "Enter" && navGo("top")}
          >
            <img
              src="/brand/alimtax-logo.png"
              alt="ALIM TAX"
              style={{ height: "42px", width: "auto", objectFit: "contain" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="brandDivider" />
            <div className="brandText">
              <div className="brandName">{t.header.name}</div>
              <div className="brandTagline">{t.header.tagline}</div>
            </div>
          </div>

          <div className="navBar">
            <div className="dropdownWrap" ref={dropdownRef}>
              <button
                className="navBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  setServicesOpen((v) => !v);
                }}
              >
                {t.nav.services} <span className="caret">▼</span>
              </button>

              {servicesOpen && (
                <div className="dropdownMenu" onClick={(e) => e.stopPropagation()}>
                  <button type="button" onClick={() => navGo("tax")}>
                    {t.nav.tax}
                  </button>
                  <button type="button" onClick={() => navGo("biz")}>
                    {t.nav.biz}
                  </button>
                </div>
              )}
            </div>

            <button className="navBtn" onClick={goContactInfo}>
              {t.nav.contact}
            </button>

            <button className="navCta" onClick={goConsultForm}>
              {t.nav.request}
            </button>

            {/* Login Dropdown */}
<div className="dropdownWrap" ref={loginRef}>
  <button
    className="navLogin"
    onClick={(e) => {
      e.stopPropagation();
      setLoginOpen((v) => !v);
    }}
  >
    {t.nav.login} <span className="caret">▼</span>
  </button>

{loginOpen && (
  <div className="dropdownMenu" onClick={(e) => e.stopPropagation()}>
    <button
      type="button"
      onClick={() => {
        setLoginOpen(false);
        router.push(`/${lang}/login`);
      }}
    >
      <span className="dropIcon">👤</span>
      {t.nav.customerLogin}
    </button>

    <button
      type="button"
      className="adminDrop"
      onClick={() => {
        setLoginOpen(false);
        router.push(`/${lang}/admin/login`);
      }}
    >
      <span className="dropIcon">🔒</span>
      {t.nav.adminLogin}
    </button>
  </div>
)}
</div>

{/* Separate Signup Button */}
<button className="navSignup" onClick={() => router.push(`/${lang}/signup`)}>
  {t.nav.signup}
</button>
          </div>

          <div className="rightControls">
            <button className="langBtn" onClick={switchLang} title="Toggle language">
              {lang === "en" ? "RU" : "EN"}
            </button>

            <button className="menuBtn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              ≡
            </button>
          </div>
        </div>
      </div>

      {/* ===== Mobile Menu ===== */}
      {menuOpen && (
        <div className="mobileMenuOverlay" onClick={() => setMenuOpen(false)}>
          <div className="mobileMenu" onClick={(e) => e.stopPropagation()}>
            <button className="mobileClose" onClick={() => setMenuOpen(false)}>
              ✕
            </button>

            <button className="mobileLink" onClick={() => navGo("tax")}>
              {t.nav.tax}
            </button>
            <button className="mobileLink" onClick={() => navGo("biz")}>
              {t.nav.biz}
            </button>

            <button className="mobileLink" onClick={goContactInfo}>
              {t.nav.contact}
            </button>

            <button className="mobilePrimary" onClick={goConsultForm}>
              {t.nav.request}
            </button>

            <button className="mobileLogin" onClick={() => router.push(`/${lang}/login`)}>
  {t.nav.customerLogin}
</button>

<button className="mobileLogin" onClick={() => router.push(`/${lang}/admin/login`)}>
  {t.nav.adminLogin}
</button>

<button className="mobilePrimary" onClick={() => router.push(`/${lang}/signup`)}>
  {t.nav.signup}
</button>

            <div className="mobileDivider" />
            <a className="mobileCall" href={`tel:${BRAND.phone1_tel}`} onClick={() => setMenuOpen(false)}>
              Call {BRAND.phone1_display}
            </a>
          </div>
        </div>
      )}

      {/* ===== Hero ===== */}
      <section className="hero" id="top">
        <div className="container heroInner">
          <div>
            <h1 className="h1">{t.heroTitle}</h1>
            <p className="sub">{t.heroSub}</p>

            <div className="ctaRow ctaCenter">
              <button className="btnPrimary" onClick={goConsultForm}>
                {t.ctas.consult}
              </button>
              <button className="btnGhost" onClick={() => navGo("tax")}>
                {t.ctas.file}
              </button>
              <button className="btnGhost" onClick={() => navGo("biz")}>
                {t.ctas.open}
              </button>
            </div>

            {/* ✅ NEW: WHY CHOOSE US BLOCK (NEAR HERO) */}
            <div className="whyWrap">
              <div className="whyTitle">{t.whyTitle}</div>
              <div className="whyGrid">
                {t.why.map((w) => (
                  <div key={w.title} className="whyCard">
                    <div className="whyCardTitle">{w.title}</div>
                    <div className="whyCardDesc">{w.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="aboutMini">
              <div className="aboutTitle">{t.aboutTitle}</div>
              <div className="aboutText">{t.aboutText}</div>

              <div className="aboutTrustRow trustCenter">
                {t.trust.map((x) => (
                  <div key={x} className="aboutTrustBadge">
                    {x}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Services ===== */}
      <section className="sectionAlt">
        <div className="container servicesGrid">
          <div className="card" id="tax">
            <div className="sectionTitle">{t.taxTitle}</div>

            {t.tax.map((item, i) => {
              const isOpen = openTax === i;
              return (
                <div key={item.title} className={`serviceCard ${isOpen ? "open" : ""}`}>
                  <button
                    className="serviceRowBtn"
                    onClick={() => setOpenTax(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <div className="serviceLeft">
                      <div className="serviceTitle">{item.title}</div>
                    </div>
                    <div className="chev">{isOpen ? "⌄" : "›"}</div>
                  </button>

                  {isOpen && <div className="serviceDesc">{item.desc}</div>}
                </div>
              );
            })}
          </div>

          <div className="card" id="biz">
            <div className="sectionTitle">{t.bizTitle}</div>

            {t.biz.map((item, i) => {
              const isOpen = openBiz === i;
              return (
                <div key={item.title} className={`serviceCard ${isOpen ? "open" : ""}`}>
                  <button
                    className="serviceRowBtn"
                    onClick={() => setOpenBiz(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <div className="serviceLeft">
                      <div className="serviceTitle">{item.title}</div>
                    </div>
                    <div className="chev">{isOpen ? "⌄" : "›"}</div>
                  </button>

                  {isOpen && <div className="serviceDesc">{item.desc}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

{/* ===== Contact ===== */}
<section className="consultationBg" id="contact">
  <div className="container">
    <div className="contactGrid">
      {/* ✅ Consultation Form with glass card */}
      <div className="consultCardWrap" id="consult">
        <div className="sectionTitle">{t.consultTitle}</div>

        <form className="form" onSubmit={submitLead}>
          <label>
            {t.form.name}
            <input name="name" required />
          </label>

          <label>
            {t.form.phone}
            <input name="phone" required />
          </label>

          <label>
            {t.form.email}
            <input name="email" />
          </label>

          <label>
            {t.form.msg}
            <textarea name="message" rows={5} required />
          </label>

          <button className="btnPrimary" type="submit">
            {t.form.send}
          </button>

          <div className="smallMuted">{t.form.note}</div>
        </form>
      </div>

      {/* ✅ Keep your contact info card exactly */}
      <div className="card contactPanel" id="contact-info">
        <div className="contactPanelGrid">
          <div>
            <div className="panelTitle">{t.nav.contact}</div>
            <div className="panelText">
              <div className="panelLine">
                <b>{BRAND.address}</b>
              </div>

              <div className="panelLine">
                <b>Phone:</b>{" "}
                <a href={`tel:${BRAND.phone1_tel}`}>{BRAND.phone1_display}</a> •{" "}
                <a href={BRAND.whatsapp1} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </div>

              <div className="panelLine">
                <b>Phone:</b>{" "}
                <a href={`tel:${BRAND.phone2_tel}`}>{BRAND.phone2_display}</a> •{" "}
                <a href={BRAND.whatsapp2} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </div>

              <div className="panelLine">
                <b>Email:</b> <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
              </div>

              <div className="panelLine">
                <b>Instagram:</b>{" "}
                <a href={BRAND.instagram} target="_blank" rel="noreferrer">
                  ulanbek_alim
                </a>
              </div>
            </div>
          </div>

          <div>
            <div className="panelTitle">{t.hoursTitle}</div>
            <ul className="hoursList">
              {t.hours.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mapWrap">
          <iframe
            className="mapFrameSmall"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              BRAND.mapQuery || BRAND.address
            )}&output=embed`}
            title="Map"
          />
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ===== Footer ===== */}
      <footer className="footer">
        <div className="container footerInner">
          <div
            className="brandLogo footerBrandStack"
            onClick={() => navGo("top")}
            role="button"
            tabIndex={0}
          >
            <img
              src="/brand/alimtax-logo.png"
              alt="ALIM TAX"
              style={{ height: "38px", width: "auto", objectFit: "contain" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            <div className="footerBrandTextStack">
              <div className="footerBrandName">ALIM TAX LLC</div>
              <div className="footerBrandTagline">Tax Preparation & Accounting Services</div>
            </div>
          </div>

          <div className="footerNav">
            <button className="footerLink" onClick={() => navGo("tax")}>
              {t.footerLinks.tax}
            </button>
            <button className="footerLink" onClick={() => navGo("biz")}>
              {t.footerLinks.biz}
            </button>
            <button className="footerLink" onClick={goContactInfo}>
              {t.footerLinks.contact}
            </button>
          </div>

          <button className="footerCta" onClick={goConsultForm}>
            {t.footerCta}
          </button>
        </div>

        <div className="footerBottom">
          <div className="container footerBottomInnerCentered">
            <div className="footerCopyright">
              © {new Date().getFullYear()} Alim Tax LLC. All Rights Reserved.
            </div>

            <div className="footerLegalLinks">
              <a href={`/${lang}/privacy-policy`}>Privacy Policy</a>
              <span className="dot">•</span>
              <a href={`/${lang}/terms`}>Terms</a>
              <span className="dot">•</span>
              <a href={`/${lang}/cookie-policy`}>Cookie Policy</a>
              <span className="dot">•</span>
              <a href={`/${lang}/sms-consent`}>SMS Consent</a>
              <span className="dot">•</span>
              <a href={`/${lang}/disclaimer`}>Disclaimer</a>
            </div>

            <div className="footerSubText">
              Licensed Tax Preparation & Accounting Services – Serving All 50 States
            </div>
          </div>
        </div>
      </footer>

      <a
        href={BRAND.whatsapp1}
        target="_blank"
        rel="noreferrer"
        className="whatsappFloat"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        💬
      </a>

      <style jsx global>{`
        .ctaCenter {
          justify-content: center !important;
          flex-wrap: wrap;
        }
        .trustCenter {
          justify-content: center !important;
          flex-wrap: wrap;
        }

        /* ✅ NEW: WHY CHOOSE US STYLES */
        .whyWrap {
          margin-top: 18px;
          padding: 14px 12px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
        }

        .whyTitle {
          font-weight: 900;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          font-size: 13px;
          opacity: 0.9;
          margin-bottom: 10px;
          text-align: center;
          color: #fff;
        }

        .whyGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }

        .whyCard {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          padding: 12px 12px;
        }

        .whyCardTitle {
          color: #fff;
          font-weight: 900;
          font-size: 14px;
          margin-bottom: 6px;
        }

        .whyCardDesc {
          color: rgba(255, 255, 255, 0.86);
          font-size: 13px;
          line-height: 1.35;
        }

        @media (max-width: 980px) {
          .whyGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 520px) {
          .whyGrid {
            grid-template-columns: 1fr;
          }
        }

        /* ===== HEADER BRAND (logo + text SIDE BY SIDE) ===== */
        .headerBrand {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 14px !important;
        }

        .headerBrand .brandText {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .headerBrand .brandName {
          font-size: 18px;
          font-weight: 900;
          letter-spacing: 1px;
          color: #fff;
        }

        .headerBrand .brandTagline {
          font-size: 11px;
          letter-spacing: 1px;
          text-transform: uppercase;
          opacity: 0.75;
        }

        .brandDivider {
          width: 1px;
          height: 38px;
          background: rgba(255, 255, 255, 0.25);
        }

        /* =========================
           PREMIUM FOOTER OVERRIDES
           ========================= */
        .footer {
          background: linear-gradient(90deg, #0b2b3a, #0a2432);
          color: #fff;
          margin-top: 60px;
        }

        .footerInner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 28px 0;
        }

        .footer .brandLogo img {
          height: 38px;
          width: auto;
          cursor: pointer;
        }

        .footerNav {
          display: flex;
          align-items: center;
          gap: 28px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .footerLink {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          letter-spacing: 0.2px;
          padding: 6px 8px;
          border-radius: 10px;
          transition: all 0.2s ease;
        }

        .footerLink:hover {
          color: #fff;
          text-decoration: underline;
          opacity: 1;
        }

        .footerCta {
          background: #d61f26;
          color: #fff;
          font-weight: 800;
          border: none;
          padding: 12px 22px;
          border-radius: 999px;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(214, 31, 38, 0.25);
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .footerCta:hover {
          transform: translateY(-1px);
          background: #be1b21;
        }

        .footerBottom {
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          padding: 18px 0 22px;
        }

        .footerBottomInnerCentered {
          display: flex;
          flex-direction: column;
          gap: 10px;
          text-align: center;
          align-items: center;
          justify-content: center;
        }

        .footerCopyright {
          font-size: 14px;
          opacity: 0.92;
          font-weight: 600;
        }

        .footerLegalLinks {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          font-size: 13px;
          opacity: 0.9;
        }

        .footerLegalLinks a {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .footerLegalLinks a:hover {
          text-decoration: underline;
          color: #fff;
        }

        .footerLegalLinks .dot {
          opacity: 0.5;
        }

        .footerSubText {
          font-size: 13px;
          opacity: 0.85;
          max-width: 900px;
          line-height: 1.4;
        }

        @media (max-width: 860px) {
          .footerInner {
            flex-direction: column;
            text-align: center;
            gap: 14px;
            padding: 26px 0;
          }
        }
      `}</style>
    </div>
  );
}