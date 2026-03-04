import "./globals.css";

export const metadata = {
  title: "ALIM TAX | Professional Accounting Company",
  description: "All state tax preparation company. Start a business, manage bookkeeping, and file taxes — all in one place.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
