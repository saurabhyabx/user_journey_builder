# Quick Start: Database & Environment Setup

## ✅ What's Built

The entire application code is ready:
- ✅ Interview wizard (AI Chat + Form)
- ✅ ReactFlow visual editor with 9 node types
- ✅ Export system (Mermaid, JSON, CSV)
- ✅ Version control foundation
- ✅ Commenting system
- ✅ AI journey generation via OpenAI

## 🔧 What's Needed Now (3 Steps)

### Step 1: PostgreSQL Database (10 minutes)

Choose ONE option:

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL (Windows)
# https://www.postgresql.org/download/windows/

# Create database
createdb user_journey_builder

# Update .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/user_journey_builder"
```

**Option B: Neon (Cloud, Recommended for MVP)**
```bash
# Go to https://console.neon.tech
# Create new project
# Copy connection string to .env
DATABASE_URL="postgresql://user:password@xxx.neon.tech/dbname"
```

**Option C: Supabase**
```bash
# Go to https://supabase.com
# Create project
# Copy PostgreSQL connection string to .env
```

### Step 2: Configure Environment Variables

Edit `.env` file:

```env
# Database
DATABASE_URL="postgresql://user:password@host/dbname"

# OpenAI (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY="sk-proj-xxx"

# Better Auth (generate a random string: `openssl rand -base64 32`)
AUTH_SECRET="your-random-secret-here"

# Stripe (for "Hire Expert" feature, optional for MVP)
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_PUBLISHABLE_KEY="pk_test_xxx"

# Resend (for emails, optional for MVP)
RESEND_API_KEY="re_xxx"

# App URL (for local dev)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 3: Run Database Setup

```bash
# Install dependencies (if not done)
npm install

# Create database tables
npx prisma db push

# Seed interview questions (18 questions across 6 categories)
npm run db:seed

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

---

## ✅ Testing the Setup

After setup, test the flow:

```bash
# Start dev server
npm run dev

# In browser: http://localhost:3000
```

**Test flow:**
1. Click "Get Started Free"
2. Choose "AI Chat Interview" or "Detailed Form"
3. Complete interview
4. See "Generating your journey..."
5. Should redirect to editor with generated nodes
6. Try to:
   - Drag nodes around
   - Add new nodes
   - Export as Mermaid/JSON
   - Save changes

---

## 🐛 Common Issues & Fixes

**Issue**: `PrismaClientInitializationError`
- **Fix**: Check `DATABASE_URL` in `.env` is correct

**Issue**: `OPENAI_API_KEY not found`
- **Fix**: Get key from https://platform.openai.com/api-keys

**Issue**: Nodes not appearing in editor
- **Fix**: Check database was seeded with `npm run db:seed`

**Issue**: Interview doesn't redirect to editor
- **Fix**: Check OpenAI API key is valid and has credits

---

## 📊 Success Checklist

- [ ] Database connected (check with `npx prisma studio`)
- [ ] 18 interview questions visible in database
- [ ] `.env` file has all required variables
- [ ] `npm run dev` starts without errors
- [ ] Can visit http://localhost:3000
- [ ] Can click "Get Started Free"
- [ ] Can complete interview
- [ ] Can see ReactFlow editor
- [ ] Can export journey as Mermaid diagram

---

## 🚀 Next Steps After Setup

1. **Implement Authentication** (Phase 9)
   - Set up Better Auth
   - Protect tRPC routes with session checks
   - Create auth pages (/auth/signin, /auth/signup)

2. **Add Comment UI** (Phase 10)
   - Create comment panel in editor
   - Show AI suggestions
   - Integrate with comment tRPC endpoints

3. **Add Version History UI** (Phase 11)
   - Timeline sidebar showing versions
   - Diff viewer
   - One-click restore

4. **Deploy** (Phase 12)
   - Push to GitHub
   - Deploy to Vercel
   - Set up Neon PostgreSQL
   - Configure environment variables on Vercel

---

## 💡 Development Tips

**Auto-restart on changes:**
```bash
npm run dev
```

**Check database:**
```bash
npx prisma studio
```

**View logs:**
- Browser DevTools (F12)
- Terminal where `npm run dev` runs

**Reset database (careful!):**
```bash
# Delete all data
npx prisma db push --force-reset
```

---

## 📚 Resources

- **Prisma Docs**: https://www.prisma.io/docs/
- **tRPC Docs**: https://trpc.io/
- **ReactFlow Docs**: https://reactflow.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **Neon PostgreSQL**: https://neon.tech/

---

## ✨ What You Have Now

A complete AI-powered user journey building platform with:

- **Brain**: OpenAI GPT-4 integration
- **Eyes**: ReactFlow visual editor with 9 node types
- **Memory**: PostgreSQL with Prisma ORM
- **Voice**: tRPC APIs for frontend-backend communication
- **Hands**: Interview wizard in 2 flavors + visual editing

**What's missing**: 
- Login/session (blocking production)
- Commenting UI (non-critical)
- Version history UI (nice-to-have)

**With just these 3 steps**, you'll have a working MVP that can generate and visualize user journeys in minutes.
