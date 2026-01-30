# User Journey Builder 🚀

> AI-Powered App Planning Platform - Transform ideas into visual user journeys with intelligent interventions and lifecycle tracking

---

## 🎯 What is This?

An intelligent platform that **interviews users about their product idea** and **automatically generates visual user journey diagrams** using AI. It maps the complete customer lifecycle from entry to advocacy, with smart interventions (like "hire an expert") at strategic touchpoints.

### The Core Concept
Users describe their product in natural language → AI understands their intent → Platform generates an interactive visual journey map with all touchpoints, decision points, and user paths.

**Built 100% From Scratch**: This is a completely original project. We studied ReactFlow documentation and various open-source examples (including NodeBase and others) to understand node-based editor patterns. We're choosing the best technologies for our specific needs and building everything custom - this is our own "piece of art" focused purely on **user journey mapping**.

### Key Innovation
When a user building an app indicates they're "starting for the first time" at any onboarding step, the system intelligently routes them to an intervention offering expert help with pricing quotes - but they can skip and continue their journey anytime.

---

## ✨ Core Features

### 🤖 AI Interview System
- Conversational wizard that asks about app type, features, integrations, target users
- Smart follow-up questions based on previous answers
- Auto-saves progress for resume later
- Generates AppProfile from responses

### 🎨 Visual Journey Editor
- Drag-and-drop node-based interface (powered by ReactFlow)
- Multiple node types: Entry, Onboarding Steps, Decision Points, Interventions, Milestones, Exits
- Conditional branching (expert vs beginner paths)
- Real-time visual feedback

### 🧠 AI Journey Generation
- GPT-4/Claude generates complete user journeys from interview data
- Automatically positions nodes for optimal flow
- Includes lifecycle stage tagging (Entry → Customer → Recurring → Upgraded → Torchbearer)
- Suggests intervention points based on user profile

### 💡 Smart Interventions
- Context-aware service offers (hire expert, consultation)
- Dynamic quote generation based on app complexity
- "Accept" or "Skip" routing options
- Seamless integration into main journey flow

### 📊 Analytics & Export
- Lifecycle funnel visualization
- Journey complexity metrics
- Export to Mermaid diagrams
- Export to PNG/SVG images
- Share/embed capabilities

---

## 🏗️ Tech Stack

**Frontend**
- Next.js 14+ (App Router)
- React 18+ with TypeScript
- ReactFlow (visual editor)
- TanStack Query (data fetching)
- Jotai (state management)
- Tailwind CSS + shadcn/ui

**Backend**
- Next.js API Routes
- tRPC (type-safe APIs)
- PostgreSQL + Prisma ORM
- Better Auth (authentication)

**AI**
- OpenAI GPT-4 / Anthropic Claude
- Vercel AI SDK

**Deployment**
- Vercel (hosting)
- Neon/Supabase (database)

---

## 📂 Project Structure

```
user-journey-builder/
├── implementation.md    # Complete technical implementation guide
├── tasklist.md         # Detailed checklist for building the platform
├── README.md           # This file
└── src/                # (To be created)
    ├── app/            # Next.js App Router pages
    ├── features/       # Feature modules (interview, editor, nodes)
    ├── server/         # tRPC routers and API logic
    ├── lib/            # Utilities (AI, export, quote generation)
    └── components/     # Shared UI components
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (or Neon/Supabase account)
- OpenAI API key (for AI journey generation)

### Setup Instructions

1. **Read the Documentation**
   - Start with [`implementation.md`](./implementation.md) for technical architecture
   - Review [`tasklist.md`](./tasklist.md) for step-by-step build tasks

2. **Next Steps** (After reading docs)
   - Initialize Next.js project: `npx create-next-app@latest`
   - Set up Prisma and database schema
   - Configure authentication
   - Build interview wizard
   - Integrate AI journey generation
   - Create visual editor with node components

3. **Follow the Phases**
   - Phase 0: Project Setup (3 days)
   - Phase 1: Interview System (6 days)
   - Phase 2: AI Generator (5 days)
   - Phase 3: Visual Editor (5 days)
   - Phase 4: Node Components (8 days)
   - Phase 5: Conditional Logic (4 days)
   - Phase 6: Export (3.5 days)
   - Phase 7: Analytics (6 days)
   - Phase 8: Polish (8 days)
   - Phase 9: Deployment (2.5 days)
   - Phase 10: Launch (2 days + 1 week beta)

**Total Timeline**: 12-14 weeks to launch

---

## 💡 Use Case Example

### Web Dev App Builder Journey

1. **Interview** - User answers questions:
   - App type: "Web App"
   - Features: ["User auth", "Dashboard", "API integration"]
   - Target users: "Mixed (experts and beginners)"

2. **AI Generation** - System creates journey with:
   - Onboarding steps 1-3: Basic info collection
   - **Step 4: Decision Point** - "Are you an expert or starting first time?"
     - **If "Starting first time"** → Route to **Intervention Node**
       - Shows: "Get help from an expert"
       - Displays: Auto-generated quote ($12,500 for their app)
       - Options: "Accept" → Lead to expert consultation OR "Skip" → Continue normal journey
     - **If "Expert"** → Continue to advanced setup

3. **Lifecycle Stages** - Journey tagged with:
   - Entry: First visit
   - Prospect: Exploring features
   - Customer: First project created
   - Recurring: Multiple projects
   - Upgraded: Premium features
   - Torchbearer: Referrals and advocacy

4. **Export** - User downloads:
   - Mermaid diagram for documentation
   - PNG image for presentations
   - JSON for further editing

---

## 🎯 Key Features in Detail

### Decision Nodes with Branching
```
[Onboarding Step 4] 
    ↓
{Are you expert or beginner?}
    ├─→ [Expert] → Continue normal journey
    └─→ [Beginner] → [Hire Expert Offer]
                          ├─→ [Accept] → Expert consultation flow
                          └─→ [Skip] → Rejoin normal journey
```

### Intervention Node Configuration
- Service type: Hire expert, Consultation, Custom
- Auto quote generation: Yes/No
- Allow skip: Yes/No
- Pricing rules: Based on complexity + features + integrations

### Lifecycle Tracking
- **Entry**: Landing page, first visit
- **Prospect**: Browsing, exploring
- **Customer**: First purchase/signup
- **Recurring**: Repeat usage, retention
- **Upgraded**: Premium tier, advanced features
- **Torchbearer**: Referrals, advocacy, community

---

## 📚 Documentation

- [`implementation.md`](./implementation.md) - Complete technical guide with code examples
- [`tasklist.md`](./tasklist.md) - Detailed task breakdown with time estimates

---

## 🤝 Contributing

This project is in planning/development phase. Contributions welcome once core structure is built.

---

## 📝 License

TBD

---

## 🗓️ Roadmap

### MVP (Weeks 1-12)
- ✅ Documentation complete
- ⏳ Core interview system
- ⏳ AI journey generation
- ⏳ Visual editor
- ⏳ Node types implementation
- ⏳ Export functionality

### Post-MVP (Future)
- Journey templates library
- Real user tracking integration
- Team collaboration
- A/B testing for journeys
- Export to code
- Multi-language support

---

**Status**: 📝 Planning & Documentation Phase  
**Next Action**: Begin Phase 0 - Project Setup

---

Built with ❤️ for app builders who need clarity on their user journey from day one.
