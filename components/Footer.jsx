// components/Footer.jsx

"use client";

import Link from "next/link";

export default function Footer({ lang = "en" }) {
  const t = {
    en: {
      company: "Alim Tax LLC",
      rights: "All Rights Reserved.",
      licensed:
        "Licensed Accounting & Tax Preparation Services – Serving All 50 States",
      services: "Services",
      tax: "Tax Services",
      business: "Business Services",
      contact: "Contact Us",
      consultation: "Request Consultation",
      privacy: "Privacy Policy",
      terms: "Terms",
      cookie: "Cookie Policy",
      sms: "SMS Consent",
      disclaimer: "Disclaimer",
    },
    ru: {
      company: "Alim Tax LLC",
      rights: "Все права защищены.",
      licensed:
        "Лицензированные бухгалтерские и налоговые услуги – Работаем во всех 50 штатах",
      services: "Услуги",
      tax: "Налоговые услуги",
      business: "Бизнес услуги",
      contact: "Контакты",
      consultation: "Запросить консультацию",
      privacy: "Политика конфиденциальности",
      terms: "Условия",
      cookie: "Политика cookie",
      sms: "Согласие на SMS",
      disclaimer: "Отказ от ответственности",
    },
  };

  const text = t[lang];

  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
        
        {/* Company Info */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-4">
            {text.company}
          </h2>
          <p className="text-sm leading-relaxed opacity-80">
            {text.licensed}
          </p>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            {text.services}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/services/tax" className="hover:text-red-400">
                {text.tax}
              </Link>
            </li>
            <li>
              <Link href="/services/business" className="hover:text-red-400">
                {text.business}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            {text.contact}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="tel:+16198675619" className="hover:text-red-400">
                +1 (619) 867-5619
              </a>
            </li>
            <li>
              <a href="tel:+14129920773" className="hover:text-red-400">
                +1 (412) 992-0773
              </a>
            </li>
            <li>
              <a
                href="mailto:Ua.alimtax@gmail.com"
                className="hover:text-red-400"
              >
                Ua.alimtax@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <div className="flex items-start md:justify-end">
          <Link
            href="/contact"
            className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-full text-white font-semibold shadow-lg"
          >
            {text.consultation}
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="mb-3 md:mb-0">
            © 2026 {text.company}. {text.rights}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/privacy-policy" className="hover:text-red-400">
              {text.privacy}
            </Link>
            <Link href="/terms" className="hover:text-red-400">
              {text.terms}
            </Link>
            <Link href="/cookie-policy" className="hover:text-red-400">
              {text.cookie}
            </Link>
            <Link href="/sms-consent" className="hover:text-red-400">
              {text.sms}
            </Link>
            <Link href="/disclaimer" className="hover:text-red-400">
              {text.disclaimer}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}