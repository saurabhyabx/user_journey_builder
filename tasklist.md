# Task List: User Journey Builder

> Organized checklist to build and launch the AI-powered User Journey Builder

---

## 📋 Phase 0: Project Setup

### 0.1 Initial Setup
- [ ] Create new Next.js 14 project (or fork NodeBase)
- [ ] Install dependencies:
  - [ ] `@tanstack/react-query`
  - [ ] `@trpc/server` `@trpc/client` `@trpc/next`
  - [ ] `@xyflow/react` (ReactFlow)
  - [ ] `prisma` `@prisma/client`
  - [ ] `zod` `react-hook-form` `@hookform/resolvers`
  - [ ] `openai` or `@anthropic-ai/sdk`
  - [ ] `lucide-react` `tailwindcss`
  - [ ] `better-auth` or `next-auth`
- [ ] Set up project structure:
  - [ ] `/src/app` (routes)
  - [ ] `/src/features` (feature modules)
  - [ ] `/src/server` (tRPC routers)
  - [ ] `/src/lib` (utilities)
  - [ ] `/prisma` (database)

**Time: 1 day**

---

### 0.2 Database Setup
- [ ] Create Prisma schema with tables:
  - [ ] `User` (existing or new)
  - [ ] `AppProfile`
  - [ ] `Journey`
  - [ ] `JourneyNode`
  - [ ] `JourneyConnection`
  - [ ] `InterviewSession`
- [ ] Define enums:
  - [ ] `JourneyType`
  - [ ] `JourneyNodeType`
  - [ ] `LifecycleStage`
- [ ] Run initial migration: `npx prisma migrate dev --name init`
- [ ] Generate Prisma Client: `npx prisma generate`
- [ ] Create seed script with sample data

**Time: 1 day**

---

### 0.3 Authentication Setup
- [ ] Install and configure Better Auth or NextAuth
- [ ] Create sign-up/sign-in pages
- [ ] Set up protected routes middleware
- [ ] Create `requireAuth()` utility
- [ ] Test authentication flow

**Time: 1 day**

---

### 0.4 tRPC Configuration
- [ ] Set up tRPC server in `/src/server/api`
- [ ] Create base router with context (user, db)
- [ ] Configure tRPC client for Next.js App Router
- [ ] Create API route handler: `/api/trpc/[trpc]/route.ts`
- [ ] Test with simple ping endpoint

**Time: 0.5 days**

---

## 📝 Phase 1: Interview System

### 1.1 Interview Data Model
- [ ] Create `InterviewSession` Prisma model
- [ ] Define interview questions structure in config file
- [ ] Create types for interview responses
- [ ] Build interview router (`interviewRouter`):
  - [ ] `getSession` query
  - [ ] `saveResponse` mutation
  - [ ] `complete` mutation

**Time: 1 day**

---

### 1.2 Interview UI Components
- [ ] Create interview wizard layout:
  - [ ] `InterviewWizard.tsx` (main container)
  - [ ] `InterviewProgress.tsx` (stepper)
  - [ ] `InterviewNavigation.tsx` (back/next buttons)
- [ ] Build step components:
  - [ ] `WelcomeStep.tsx`
  - [ ] `AppTypeStep.tsx` (radio select)
  - [ ] `FeaturesStep.tsx` (multi-select checkboxes)
  - [ ] `IntegrationsStep.tsx` (searchable multi-select)
  - [ ] `UserProfileStep.tsx` (your "expert vs beginner" question)
  - [ ] `MonetizationStep.tsx`
  - [ ] `ReviewStep.tsx` (summary)
- [ ] Add form validation with Zod
- [ ] Implement auto-save on each step
- [ ] Add loading states

**Time: 3 days**

---

### 1.3 Interview Flow Logic
- [ ] Implement navigation (next/previous)
- [ ] Add conditional steps (show/hide based on previous answers)
- [ ] Handle interview resume (continue from where user left off)
- [ ] Add progress persistence (save to InterviewSession)
- [ ] Create completion handler (creates AppProfile)

**Time: 1 day**

---

### 1.4 Interview Page
- [ ] Create route: `/app/(dashboard)/interview/page.tsx`
- [ ] Handle new vs. resumed interviews
- [ ] Add exit/save draft functionality
- [ ] Create success screen after completion
- [ ] Redirect to journey generation on completion

**Time: 1 day**

---

## 🤖 Phase 2: AI Journey Generator

### 2.1 OpenAI Integration
- [ ] Set up OpenAI API client
- [ ] Create prompt templates:
  - [ ] System prompt for journey generation
  - [ ] User prompt builder from AppProfile
- [ ] Test prompt with sample data
- [ ] Handle API errors and retries
- [ ] Add rate limiting

**Time: 1 day**

---

### 2.2 Journey Generation Logic
- [ ] Create `journey-generator.ts` utility:
  - [ ] `generateJourney(appProfile)` function
  - [ ] `buildJourneyPrompt()` function
  - [ ] `parseAIResponse()` function
- [ ] Implement response validation (ensure valid JSON)
- [ ] Create fallback for AI failures
- [ ] Add position auto-layout algorithm (arrange nodes)

**Time: 2 days**

---

### 2.3 Journey Creation Flow
- [ ] Add "Generate Journey" button to AppProfile page
- [ ] Create loading screen with progress animation
- [ ] Call AI generation API
- [ ] Parse AI response into nodes/connections
- [ ] Save journey to database (Journey + JourneyNodes + JourneyConnections)
- [ ] Handle generation errors gracefully
- [ ] Redirect to journey editor after success

**Time: 1 day**

---

### 2.4 AI Router
- [ ] Create `aiRouter` with:
  - [ ] `generateJourney` mutation
  - [ ] `regenerateNode` mutation (regenerate single node)
  - [ ] `suggestImprovements` query
- [ ] Add streaming support (optional, for live updates)
- [ ] Test with various app profiles

**Time: 1 day**

---

## 🎨 Phase 3: Journey Editor (Visual Canvas)

### 3.1 Editor Setup
- [ ] Copy/adapt editor from NodeBase:
  - [ ] `JourneyEditor.tsx` (main editor component)
  - [ ] `EditorHeader.tsx` (save, export, etc.)
- [ ] Configure ReactFlow:
  - [ ] Set up node/edge state
  - [ ] Add snap-to-grid
  - [ ] Enable minimap, controls, background
- [ ] Create journey router (`journeyRouter`):
  - [ ] `getOne` query (fetch journey with nodes)
  - [ ] `update` mutation (save changes)
  - [ ] `delete` mutation
  - [ ] `export` query

**Time: 2 days**

---

### 3.2 Node Registration System
- [ ] Create node component registry:
  - [ ] `journey-node-components.ts` config
  - [ ] Map `JourneyNodeType` → React component
- [ ] Add node palette UI:
  - [ ] `NodePalette.tsx` (sidebar or modal)
  - [ ] Drag-and-drop to add nodes
  - [ ] Search/filter nodes by category
- [ ] Implement add node functionality

**Time: 1 day**

---

### 3.3 Connection/Edge System
- [ ] Configure edge types (straight, smooth, step)
- [ ] Add connection validation (prevent invalid connections)
- [ ] Implement labeled edges (for decision branches)
- [ ] Add conditional edge styling (color by condition)
- [ ] Create edge context menu (edit label, delete)

**Time: 1 day**

---

### 3.4 Editor Page
- [ ] Create route: `/app/(dashboard)/journeys/[id]/page.tsx`
- [ ] Add loading/error states
- [ ] Implement auto-save (debounced)
- [ ] Add manual save button
- [ ] Show save status indicator

**Time: 1 day**

---

## 🔷 Phase 4: Journey Node Components

### 4.1 Base Journey Node
- [ ] Create `BaseJourneyNode.tsx`:
  - [ ] Icon, name, description props
  - [ ] Lifecycle stage badge
  - [ ] Status indicator (active/completed/pending)
  - [ ] Double-click to configure
  - [ ] Right-click context menu (edit, delete)
  - [ ] Input/output handles
- [ ] Style with Tailwind (journey-themed colors)
- [ ] Add hover effects

**Time: 1 day**

---

### 4.2 Core Node Types
Implement these node components (each with dialog):

- [ ] **EntryNode** (JOURNEY_START)
  - [ ] Component with play icon
  - [ ] No configuration needed (just start point)
  
- [ ] **OnboardingStepNode** (ONBOARDING_STEP)
  - [ ] Component with form icon
  - [ ] Dialog: step name, description, fields to collect
  
- [ ] **ActionButtonNode** (ACTION_BUTTON)
  - [ ] Component with pointer icon
  - [ ] Dialog: button text, action type

- [ ] **EmailNode** (EMAIL_SENT)
  - [ ] Component with mail icon
  - [ ] Dialog: email template, trigger condition

**Time: 2 days**

---

### 4.3 Decision Node (Critical)
- [ ] Create `DecisionNode.tsx`:
  - [ ] Component with branch icon
  - [ ] Multiple output handles (one per option)
  - [ ] Display decision question
- [ ] Create `DecisionDialog.tsx`:
  - [ ] Input: question text
  - [ ] Add/remove options
  - [ ] Set conditions for each option
  - [ ] Define routing logic
- [ ] Test branching in editor

**Time: 2 days**

---

### 4.4 Intervention Node (Your Key Feature)
- [ ] Create `InterventionNode.tsx`:
  - [ ] Component with helping hand icon
  - [ ] Two outputs: "Accept" and "Skip"
  - [ ] Display service offer
- [ ] Create `InterventionDialog.tsx`:
  - [ ] Service type (hire expert, consultation, custom)
  - [ ] Offer title and description
  - [ ] Enable/disable quote generation
  - [ ] Toggle "allow skip" option
- [ ] Integrate with quote calculator
- [ ] Add pricing fields

**Time: 2 days**

---

### 4.5 Milestone Nodes
- [ ] Create `ConversionNode.tsx` (CONVERSION):
  - [ ] Component with shopping cart icon
  - [ ] Dialog: conversion type, value
  
- [ ] Create `MilestoneNode.tsx` (MILESTONE):
  - [ ] Component with flag icon
  - [ ] Dialog: milestone name, lifecycle stage selector
  - [ ] Auto-tag with lifecycle colors

**Time: 1 day**

---

### 4.6 Exit Node
- [ ] Create `ExitNode.tsx` (JOURNEY_END):
  - [ ] Component with finish flag icon
  - [ ] Dialog: exit reason, outcome

**Time: 0.5 days**

---

## 🔀 Phase 5: Conditional Logic & Routing

### 5.1 Condition Builder
- [ ] Create `ConditionBuilder.tsx` component:
  - [ ] Field selector (user properties)
  - [ ] Operator selector (equals, contains, greater than)
  - [ ] Value input
  - [ ] Add multiple conditions (AND/OR)
- [ ] Store conditions in edge data
- [ ] Display conditions on edge labels

**Time: 2 days**

---

### 5.2 Intervention Routing
- [ ] Implement "hire expert" flow:
  - [ ] When user selects "starting first time" at step 4
  - [ ] Route to InterventionNode
  - [ ] Show quote calculation
  - [ ] Provide "Accept" or "Skip" options
- [ ] Test routing in editor
- [ ] Validate that skip path continues normal journey

**Time: 1 day**

---

### 5.3 Quote Generator
- [ ] Create `quote-generator.ts`:
  - [ ] Calculate base cost by app complexity
  - [ ] Add per-node costs
  - [ ] Add integration costs
  - [ ] Generate itemized breakdown
- [ ] Create `QuoteDisplay.tsx` component
- [ ] Integrate into InterventionNode dialog
- [ ] Add "Request Quote" action

**Time: 1 day**

---

## 📤 Phase 6: Export & Visualization

### 6.1 Mermaid Export
- [ ] Create `mermaid-exporter.ts`:
  - [ ] Convert nodes to Mermaid syntax
  - [ ] Handle different node shapes
  - [ ] Add connections with labels
  - [ ] Support conditional branches
- [ ] Add "Export to Mermaid" button
- [ ] Copy to clipboard functionality
- [ ] Show preview

**Time: 1 day**

---

### 6.2 Image Export
- [ ] Install `html-to-image` or similar
- [ ] Create export function for PNG/SVG
- [ ] Add download button
- [ ] Handle large canvases (zoom to fit)

**Time: 1 day**

---

### 6.3 JSON Export
- [ ] Export journey as JSON
- [ ] Include all node data and connections
- [ ] Add import functionality (upload JSON)
- [ ] Validate imported data

**Time: 0.5 days**

---

### 6.4 Share/Embed
- [ ] Create public share link (read-only journey view)
- [ ] Generate shareable URL
- [ ] Add embed code for iframe
- [ ] Set permissions (public/private)

**Time: 1 day**

---

## 📊 Phase 7: Lifecycle Tracking & Analytics

### 7.1 Lifecycle Stage Detection
- [ ] Create `lifecycle-tracker.ts`:
  - [ ] Auto-detect stages from node types
  - [ ] Identify entry, conversion, milestone nodes
  - [ ] Tag nodes with lifecycle stages
- [ ] Add lifecycle badge to nodes
- [ ] Color-code by stage

**Time: 1 day**

---

### 7.2 Funnel Visualization
- [ ] Create `LifecycleFunnel.tsx`:
  - [ ] Display stages as funnel chart
  - [ ] Show node count per stage
  - [ ] Calculate drop-off percentages
- [ ] Add to journey analytics page
- [ ] Make it interactive (click to highlight nodes)

**Time: 2 days**

---

### 7.3 Journey Metrics
- [ ] Calculate journey complexity score
- [ ] Count decision points
- [ ] Identify bottlenecks (nodes with many connections)
- [ ] Detect orphaned nodes
- [ ] Show journey health indicators

**Time: 1 day**

---

### 7.4 Analytics Dashboard
- [ ] Create route: `/app/(dashboard)/journeys/[id]/analytics`
- [ ] Display:
  - [ ] Lifecycle funnel
  - [ ] Journey metrics
  - [ ] Node statistics
  - [ ] Conversion paths
- [ ] Add export analytics as PDF

**Time: 2 days**

---

## 🎯 Phase 8: Polish & Testing

### 8.1 UI/UX Polish
- [ ] Review all pages for consistency
- [ ] Add loading skeletons
- [ ] Improve error messages
- [ ] Add empty states
- [ ] Mobile responsiveness check
- [ ] Accessibility audit (keyboard navigation, ARIA labels)

**Time: 2 days**

---

### 8.2 Testing
- [ ] Test interview flow end-to-end
- [ ] Test AI journey generation with various inputs
- [ ] Test all node types and dialogs
- [ ] Test export functionality
- [ ] Test edge cases:
  - [ ] Very large journeys (100+ nodes)
  - [ ] Complex branching
  - [ ] AI generation failures
- [ ] Cross-browser testing

**Time: 3 days**

---

### 8.3 Documentation
- [ ] Write user guide:
  - [ ] How to create a journey
  - [ ] How to use decision nodes
  - [ ] How to add interventions
  - [ ] How to export
- [ ] Create demo video
- [ ] Add tooltips/help text in UI
- [ ] Write developer documentation (if open-sourcing)

**Time: 2 days**

---

### 8.4 Performance Optimization
- [ ] Optimize large journey rendering
- [ ] Add lazy loading for node components
- [ ] Implement virtualization if needed
- [ ] Optimize AI API calls (caching)
- [ ] Database query optimization
- [ ] Add loading states everywhere

**Time: 1 day**

---

## 🚀 Phase 9: Deployment

### 9.1 Environment Setup
- [ ] Set up production database (Neon/Supabase)
- [ ] Configure environment variables
- [ ] Set up secrets management
- [ ] Configure CORS and security headers

**Time: 0.5 days**

---

### 9.2 Deployment
- [ ] Deploy to Vercel:
  - [ ] Connect GitHub repo
  - [ ] Configure build settings
  - [ ] Add environment variables
  - [ ] Run production build
- [ ] Run database migrations on production
- [ ] Test production deployment

**Time: 0.5 days**

---

### 9.3 Monitoring & Analytics
- [ ] Set up Sentry for error tracking
- [ ] Add PostHog or Google Analytics
- [ ] Set up uptime monitoring
- [ ] Configure alerts
- [ ] Create admin dashboard

**Time: 1 day**

---

### 9.4 Domain & DNS
- [ ] Purchase domain
- [ ] Configure DNS
- [ ] Set up SSL certificate (automatic with Vercel)
- [ ] Test custom domain

**Time: 0.5 days**

---

## 🎉 Phase 10: Launch

### 10.1 Pre-Launch
- [ ] Final security audit
- [ ] Final UX review
- [ ] Create launch checklist
- [ ] Prepare launch announcement
- [ ] Set up support channels

**Time: 1 day**

---

### 10.2 Soft Launch
- [ ] Invite beta users (10-20 people)
- [ ] Gather feedback
- [ ] Fix critical bugs
- [ ] Monitor performance
- [ ] Iterate on feedback

**Time: 1 week**

---

### 10.3 Public Launch
- [ ] Open registration
- [ ] Post on Product Hunt, Hacker News, Reddit
- [ ] Share on social media
- [ ] Send to email list
- [ ] Monitor for issues

**Time: 1 day + ongoing**

---

## 📈 Post-Launch (Ongoing)

### Features to Add Later
- [ ] Journey templates library
- [ ] A/B testing for journeys
- [ ] Real user tracking integration
- [ ] Team collaboration features
- [ ] Journey versioning
- [ ] AI improvement suggestions
- [ ] Export to code (generate React components)
- [ ] Multi-language support

---

## ⏱️ Time Estimates Summary

| Phase | Estimated Time |
|-------|---------------|
| Phase 0: Setup | 3 days |
| Phase 1: Interview | 6 days |
| Phase 2: AI Generator | 5 days |
| Phase 3: Editor | 5 days |
| Phase 4: Node Components | 8 days |
| Phase 5: Logic & Routing | 4 days |
| Phase 6: Export | 3.5 days |
| Phase 7: Analytics | 6 days |
| Phase 8: Polish & Testing | 8 days |
| Phase 9: Deployment | 2.5 days |
| Phase 10: Launch | 2 days |
| **Total** | **53 days** (~10-11 weeks) |

Add buffer for unforeseen issues: **12-14 weeks to launch**

---

## 🎯 Milestone Checkpoints

**Week 2**: Interview system working ✅  
**Week 4**: AI generates journeys ✅  
**Week 6**: Visual editor functional ✅  
**Week 8**: All node types complete ✅  
**Week 10**: Export & analytics done ✅  
**Week 12**: Polished & deployed ✅  
**Week 14**: Public launch 🚀

---

**Next Action**: Start with Phase 0, Task 0.1 (Initial Setup). Check off each task as you complete it!
