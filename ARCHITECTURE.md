# System Architecture & Component Guide

## 🧠 The Big Picture

**Goal**: Help users understand and visualize their customer journey, with AI assistance

```
INPUT                    PROCESS                    OUTPUT
────────────────────────────────────────────────────────────

User answers             Interview responses        Structured data
questions        →       (10 Q's or 6 pages)   →    about product
                                                    
                            ↓
                        
                        OpenAI GPT-4
                        (Analysis)
                            ↓
                        
                    AI-generated nodes
                    + connections
                    + lifecycle stages
                    
                            ↓
                        
                    ReactFlow Canvas
                    (Visualization)
                    
                            ↓
                        
User edits            Drag/drop nodes       Export as:
visually       ←      Add/delete           • Mermaid
                      Connect             • JSON
                      Comment             • CSV
                      Version
```

---

## 🗂️ File Organization & Purpose

### Frontend Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `app/page.tsx` | Landing page, "Get Started" CTA |
| `/new-journey` | `app/new-journey/page.tsx` | Create new journey, redirect to interview |
| `/journey/[id]/interview` | `interview-choice.tsx` | Choose between AI Chat or Form |
| `/journey/[id]/interview/chat` | `ai-chat-interview.tsx` | 10-question conversational flow |
| `/journey/[id]/interview/form` | `form/page.tsx` | 6-page structured form |
| `/journey/[id]/editor` | `journey-editor.tsx` | **Main editor** - visual canvas |

### Core Editor Components

**`features/journey-editor/components/journey-editor.tsx`**
- Main React component wrapping ReactFlow
- Handles: nodes state, edges state, save/load, export
- Shows: toolbar (Add/Save/Delete), node menu, bottom info
- Why: Central hub for all editing operations

**`features/journey-editor/components/journey-nodes/`** (9 files)
- `journey-start-node.tsx` - Entry point (🚀 green)
- `onboarding-step-node.tsx` - User setup (📋 blue)
- `decision-point-node.tsx` - Branching (🔀 purple)
- `conversion-node.tsx` - Purchase/signup (💰 emerald)
- `milestone-node.tsx` - Lifecycle stage (6 colors)
- `exit-point-node.tsx` - Churn (🛑 red)
- `action-node.tsx` - User action (⚡ yellow)
- `intervention-node.tsx` - Offer service (🤝 orange)
- `touchpoint-node.tsx` - Contact point (📍 indigo)

**Why**: Each node type represents different journey step
**How**: ReactFlow `NodeProps`, custom styling, color-coded

### Interview Components

**`features/interview/interview-choice.tsx`**
- Beautiful 2-option selector
- AI Chat (10 min, conversational)
- Detailed Form (20-30 min, comprehensive)
- Comparison table
- Why: Let users choose based on urgency

**`features/interview/ai-chat-interview.tsx`**
- Chat-like UI (message bubbles)
- 10 sequential questions
- Progress indicator
- Auto-saves answers
- Why: Fast, natural, engaging

**`app/journey/[journeyId]/interview/form/page.tsx`**
- Multi-step form (6 pages)
- Progress bar
- Back/Next navigation
- Question types: text, select, checkbox, textarea
- Why: Comprehensive, allows revisiting

### Backend (tRPC Routers)

**`server/trpc/routers/interview.ts`**
```typescript
- getQuestions(category?) - Fetch interview questions
- saveResponse(journeyId, responses) - Store user answers
```
Why: Manages interview data flow

**`server/trpc/routers/journey.ts`**
```typescript
- create(title, description) - New journey
- getById(id) - Load with nodes/connections
- list(status?) - User's journeys
- update(id, title, status) - Metadata
- delete(id) - Remove journey
- saveNodes(journeyId, nodes[], connections[]) - Batch save
```
Why: CRUD for journeys and their structure

**`server/trpc/routers/ai.ts`**
```typescript
- generateJourney(journeyId, interviewData) - AI magic
- getSuggestion(context, type) - Quick suggestions
```
Why: OpenAI integration, main value add

**`server/trpc/routers/user.ts`**
```typescript
- getProfile() - User data
- updateProfile(fields) - Edit profile
- getUsageStats() - Tier limits
```
Why: User management, tier system

### Utility Libraries

**`lib/export/journey-export.ts`**
- `generateMermaidDiagram(nodes, edges)` → `.mmd`
- `generateJSONExport(journeyId, nodes, edges)` → `.json`
- `generateCSVExport(nodes, edges)` → `.csv`
- `downloadMermaid/JSON/CSV(name, data)` - Browser downloads

Why: Multi-format sharing, documentation

**`lib/versioning/snapshot.ts`**
- `createSnapshot(journeyId, nodes, edges, options)` - Checkpoint
- `diffSnapshots(prev, current)` - What changed
- `summarizeChanges(diff)` - Human readable

Why: Track iterations, rollback capability

**`lib/commenting/comment.ts`**
- `extractSuggestionTypes(text)` - Parse intent
- `prepareCommentContext(comment, target)` - AI context
- `buildCommentAnalysisPrompt()` - AI prompt

Why: Enable feedback loop, AI understanding

---

## 🔄 Data Flow Example

### Flow 1: Interview → Generation → Editing

```
1. USER VISITS /new-journey
   ↓
2. CREATE JOURNEY in database
   ↓ (redirect to interview choice)
3. USER CHOOSES "AI CHAT" (or Form)
   ↓
4. FILL INTERVIEW (10 Q's in 10 min)
   ↓ (interview-choice.tsx → ai-chat-interview.tsx)
5. CLICK "COMPLETE"
   ↓
6. TRPC CALLS:
   a) interview.saveResponse(journeyId, answers)
      → Updates journey.interviewData in DB
   b) ai.generateJourney(journeyId, interviewData)
      → Calls OpenAI
      → Parses JSON response
      → Creates JourneyNode records
      → Creates JourneyConnection records
   ↓ (journey.mutateAsync)
7. REDIRECT TO /journey/[id]/editor
   ↓
8. EDITOR LOADS journey.getById(id)
   → Gets 30+ nodes with positions
   → Gets connections with labels
   ↓
9. REACTFLOW RENDERS canvas with nodes
   ↓
10. USER CAN:
    - Drag nodes (visual position update)
    - Delete nodes (remove from DOM)
    - Add nodes (manually)
    - Connect nodes (draw edges)
    - Save (journey.saveNodes mutation)
    - Export (generateMermaidDiagram export)
```

### Flow 2: Commenting & Feedback

```
USER IN EDITOR:
1. Click node to view details
2. Open comment panel
3. Type feedback: "This should ask for email"
   ↓
4. SUBMIT COMMENT
   ↓ (comment.create mutation)
5. BACKEND:
   - extractSuggestionTypes("should ask")
   - buildCommentAnalysisPrompt()
   - Call OpenAI for response
   - Store comment + AI response
   ↓
6. UI SHOWS:
   - User comment
   - AI interpretation
   - Suggested changes
   ↓
7. USER CLICKS "Apply"
   ↓
8. AI regenerates affected nodes
   ↓
9. Canvas updates visually
```

### Flow 3: Version Management

```
USER MAKING CHANGES:
1. Edit node, add nodes, reorganize
2. Click "Save"
   ↓
3. BACKEND:
   - Snapshot current state
   - Compare to previous version
   - Calculate diff
   - Store as v1, v2, v3, etc.
   ↓
4. USER CLICKS "Version History"
   ↓
5. SIDEBAR SHOWS:
   - v3 (current) - "Added email capture node"
   - v2 - "Reorganized onboarding steps"
   - v1 - "Initial AI generation"
   ↓
6. USER CLICKS "v2"
   ↓
7. SHOW DIFF:
   - Red: Removed in v3
   - Green: Added in v3
   - Changed positions
   ↓
8. USER CLICKS "Restore v2"
   ↓
9. BACKEND:
   - Create snapshot of v3 (backup)
   - Restore v2 nodes/edges
   - Update canvas
```

---

## 🧩 Component Relationships

```
App Root
├── Landing Page (/)
│   └── CTA → /new-journey
│
├── Journey Creation (/new-journey)
│   └── Create → API → /journey/[id]/interview
│
├── Interview Choice (/journey/[id]/interview)
│   ├── Interview Choice Component
│   │   ├── AI Chat → /journey/[id]/interview/chat
│   │   └── Form → /journey/[id]/interview/form
│   │
│   ├── AI Chat Interview (/chat)
│   │   └── 10 questions → generateJourney API
│   │
│   └── Detailed Form (/form)
│       └── 6 pages, 18 Q's → generateJourney API
│
└── Journey Editor (/journey/[id]/editor)
    └── JourneyEditor Component
        ├── ReactFlow Canvas
        │   ├── 9 Node Types
        │   └── Connections (Edges)
        │
        ├── Toolbar
        │   ├── Add Node Menu
        │   ├── Save Button
        │   ├── Delete Selected
        │   └── Export Menu
        │
        ├── Comment Panel (TODO)
        │   ├── New Comment
        │   ├── Threads
        │   └── AI Responses
        │
        ├── Version History (TODO)
        │   ├── Timeline
        │   ├── Diff Viewer
        │   └── Restore Button
        │
        └── Export Panel
            ├── Mermaid Diagram
            ├── JSON File
            └── CSV Spreadsheet
```

---

## 🔐 Security & Data Integrity

**Current State**: Public access (no auth yet)
**After Auth**: Protected with session validation

```typescript
// How tRPC calls get secured (after auth)
publicProcedure    // Anyone can call
protectedProcedure // Requires session
  .input(schema)   // Validates input
  .query/mutation  // Fetches data
  .middleware(({ ctx }) => {
    if (!ctx.user) throw new Error("Unauthorized");
    return data;
  })
```

**Important**: Journey ownership via `userId` field
- Users can only see/edit their own journeys
- Database enforces with indexes

---

## ⚡ Performance Optimizations

| Optimization | Where | Why |
|--------------|-------|-----|
| Batch node save | `saveNodes()` | One query instead of N |
| Memoized components | React components | Prevent unnecessary re-renders |
| Lazy loading | Next.js routes | Load only used code |
| Database indexes | Prisma schema | Fast queries on userId, journeyId |
| MiniMap in editor | ReactFlow | Quick navigation in large graphs |
| Auto-pagination (TODO) | journey.list | Handle 1000+ journeys |

---

## 🔌 API Integration Points

| Service | Usage | Endpoint |
|---------|-------|----------|
| OpenAI | Journey generation | `openai.chat.completions.create()` |
| PostgreSQL | Data storage | `DATABASE_URL` |
| Stripe (TODO) | Payments | `stripe.charges.create()` |
| Resend (TODO) | Email | `resend.emails.send()` |
| Better Auth | Sessions | `auth.api.signIn()` |

---

## 📊 Database Schema Overview

**Core Tables**:
- `Journey` - The main project (title, status, aiResponse)
- `JourneyNode` - Individual steps (type, label, position, stage)
- `JourneyConnection` - Links between nodes (sourceId, targetId, label)
- `User` - Account info
- `UserProfile` - Tier, preferences
- `InterviewQuestion` - Question bank (18 seeded)
- `Comment` (TODO) - Feedback system
- `JourneyVersion` - Version history

**Relationships**:
```
User
├── UserProfile (1:1)
├── Journey (1:N)
│   ├── JourneyNode (1:N)
│   ├── JourneyConnection (1:N)
│   ├── Comment (1:N)
│   └── JourneyVersion (1:N)
└── InterviewQuestion (N:M via responses)
```

---

## 🎯 Testing Checklist

- [ ] Interview Chat completes without errors
- [ ] Interview Form fills all 6 pages
- [ ] Journey generates within 10 seconds
- [ ] Nodes load and display correctly
- [ ] Drag nodes around works smoothly
- [ ] Add node menu appears
- [ ] Save successfully persists
- [ ] Export Mermaid downloads file
- [ ] Export JSON includes all data
- [ ] Delete selected nodes works
- [ ] Multiple nodes connectable
- [ ] Editor responsive on mobile

---

## 🚀 Deployment Considerations

- Use Vercel for Next.js hosting (auto-scaling)
- Use Neon for PostgreSQL (serverless, easy backups)
- Set env vars on Vercel dashboard
- Configure CORS if API accessed from elsewhere
- Set up monitoring (Sentry for errors)
- Enable analytics (PostHog)
- Setup backups (Neon handles this)

---

This architecture is **scalable**, **maintainable**, and **ready for production** once authentication is added.
