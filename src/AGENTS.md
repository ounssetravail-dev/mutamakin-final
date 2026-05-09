# 🚀 Mutamakin (Production Guide)

## 🎯 Overview
Mutamakin is a clean, modern LMS (Learning Management System) built with:
- Media (Video / YouTube / PDF)
- Exercises (Quiz system)
- Live Meetings (Google Meet)
- Subscription system

---

## 🧠 Architecture

### Core Structure
- src/
- app/ → pages (Next.js App Router)
- services/ → business logic (Supabase)
- utils/supabase/ → client + server
- components/ → UI components
- types/ → database types

---

## ⚙️ Tech Stack

- Next.js (App Router)
- TypeScript (strict)
- Supabase (Auth + DB + Storage)
- Tailwind CSS
- Cloudinary (media upload)

---

## 🗃 Database (Core Tables)

- profiles
- categories
- modules
- media_resources
- exercises
- questions
- exercise_submissions
- meetings
- subscriptions

---

## 🔐 Auth System

- Managed by Supabase
- Protected via `proxy.ts`
- Roles:
  - student
  - admin

---

## 📺 Media System

Supports:
- Upload (Cloudinary)
- YouTube links
- PDF (Supabase Storage)

---

## 🧠 Exercise System

- Exercises → table
- Questions → separate table
- Submissions → exercise_submissions

---

## 🔴 Meetings

- Google Meet links
- Status:
  - live
  - upcoming
  - finished

---

## 🎯 Rules

1. No direct Supabase calls in UI
2. Always use services
3. No unused files
4. Keep UI simple
5. Use server components when possible

---

## 🚀 Deployment

- Vercel (frontend)
- Supabase (backend)

---

## 🏁 Status

✔️ Production Ready  
✔️ Clean Architecture  
✔️ Scalable  

---

Mutamakin is ready for real-world usage.