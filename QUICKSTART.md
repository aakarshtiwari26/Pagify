# ⚡ Quick Start - Pagify Next.js

## 🚀 Start in 3 Steps:

### 1️⃣ Add Your Credentials

Create `.env.local` file with:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pagify
OPENAI_API_KEY=sk-proj-your-key-here
```

### 2️⃣ Run Development Server

```bash
npm run dev
```

### 3️⃣ Open Browser

```
http://localhost:3000
```

---

## 📝 Common Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
./start.sh           # Quick start with env check
```

---

## 🎨 What Changed?

| Before                    | After                          |
| ------------------------- | ------------------------------ |
| Separate frontend/backend | Single Next.js app             |
| Plain HTML/CSS            | Next.js + Tailwind + shadcn/ui |
| Manual Express server     | Next.js API routes             |
| Port 10000                | Port 3000                      |
| Basic UI                  | Modern, beautiful UI           |

---

## 📂 Key Files

```
app/page.tsx           → Main UI (replaces frontend/index.html)
app/api/upload/route.ts → Upload endpoint
app/api/ask/route.ts   → Q&A endpoint
lib/db.ts              → MongoDB connection
.env.local             → Your credentials (CREATE THIS!)
```

---

## ✅ Features (All Working!)

- ✅ PDF Upload (5MB, 10 pages)
- ✅ AI Summarization
- ✅ Question & Answer
- ✅ Text-to-Speech (Indian English)
- ✅ MongoDB Storage
- ✅ Responsive Design

---

## 🚀 Deploy to Vercel

```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

Then:

1. Go to vercel.com
2. Import repository
3. Add MONGODB_URI and OPENAI_API_KEY
4. Deploy!

---

## 🆘 Help

**MongoDB URI:** MongoDB Atlas → Connect → Connection String  
**OpenAI Key:** platform.openai.com/api-keys  
**Port in use:** `lsof -ti:3000 | xargs kill -9`

---

## 📚 Full Docs

- `README.md` - Complete guide
- `MIGRATION_GUIDE.md` - Migration details
- `SUMMARY.md` - Full overview

---

**Ready? Just add credentials to `.env.local` and run `npm run dev`! 🎉**
