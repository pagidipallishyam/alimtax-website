# ALIM TAX – Full-stack (Next.js + Firebase + Vercel)

## 1) Install
```bash
npm install
```

## 2) Configure env
Copy `.env.example` to `.env.local` and fill values:
```bash
cp .env.example .env.local
```

## 3) Run
```bash
npm run dev
```
Open: http://localhost:3000

## 4) Firebase Setup (required)
- Enable Firestore
- Enable Auth (Email/Password)
- Create a Service Account key (Project Settings → Service accounts → Generate new private key)
- Create an admin user in Auth and then add Firestore document:
  `users/{uid}` = `{ "role": "admin" }`

## Admin
- Login: `/admin/login`
- Dashboard: `/admin`
