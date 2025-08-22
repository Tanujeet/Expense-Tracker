# 💰 Expense Tracker

A simple expense tracking app built with **Next.js**, **Prisma**, and **PostgreSQL**.

## 🚀 Features

- User auth (register/login)
- Add, edit, delete expenses
- Category & date-wise tracking
- Monthly/Yearly stats
- Responsive UI

## 🛠️ Tech Stack

- Next.js (App Router)
- Prisma ORM
- PostgreSQL
- Tailwind CSS

## ⚙️ Setup

```bash
git clone <repo-url>
cd expense-tracker
npm install
# add .env with DATABASE_URL & NEXTAUTH_SECRET
npx prisma migrate dev
npm run dev
```
