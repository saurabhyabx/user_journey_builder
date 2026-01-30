# Meta-Strategic Implementation Plan

## 🌀 Vision Alignment
**Goal**: Shift from "Diagramming Tool" to "Strategic Thinking Partner".
**Core Loop**: Conversation (Discovery) -> Insight (Aha!) -> Visualization (Diagram) -> Refinement.

---

## 📅 Phase 1: The "Meta" Onboarding (Immediate Priority)

### 1. 🎨 Landing Page Refactor
- **Objective**: Align messaging with the "AI UX Strategist" persona.
- **Changes**:
  - Headline: "What if an AI UX strategist helped you think through your entire user journey?"
  - Subhead: Focus on "Strategic clarity" rather than just "Diagrams".
  - CTA: "Start Your Journey" (Direct to conversation).

### 2. ⚡ "Magic 60 Seconds" Activation
- **Objective**: Remove "Account Creation" and "Mode Selection" friction. Show value immediately.
- **New Flow**:
  1. User clicks "Start" -> Lands on `/live-builder`.
  2. **Combined View**: Split screen (Chat | Canvas).
  3. **Q1**: "What are you building?"
  4. **A1**: User answers "A fitness app".
  5. **Instant Feedback**: A "Journey Start" node appears on the canvas labeled "Fitness App User".
  6. **Q2**: "Who is the user?" -> Node updates or splits.

### 3. 🧠 Insight-Driven Conversation
- **Refactor `AIChatInterview`**:
  - Move from "Batch Collection" to "Stream Processing".
  - Implement `onPartialUpdate` callback to drive the Live Canvas.
  - Add "Insight" bubbles in the chat (e.g., "💡 That's a competitive niche...").

---

## 📅 Phase 2: Core Value Realization

### 1. 🗺️ Live Diagramming Engine
- Create a `LiveMapBuilder` hook that translates partial interview data into ReactFlow nodes/edges.
- **Mechanism (MVP)**:
  - Answer 1 (Product) -> Creates `StartNode`.
  - Answer 2 (User) -> Adds `PersonaTag` to StartNode.
  - Answer 3 (Pain point) -> Creates `ProblemNode`.
  - Answer 4 (Acquisition) -> Creates `ChannelNode` + `Edge`.

### 2. 💡 The "Gap Analysis"
- After the basic flow is mapped, the AI should analyze:
  - "I see you have a Sign Up step, but no Onboarding. 40% of users drop here."
  - Highlight "Missing Nodes" in the diagram (ghost nodes).

---

## 📅 Phase 3: Retention & Revenue (Later)

### 1. 💾 Smart Saves
- "Your journey is looking great. Enter email to save this permanent link."
- Export options with "Strategic Annotation" layers.

### 2. 🔄 Version Control
- Track the evolution of the journey map as the "Product" evolves.

---

## 🛠️ Technical Refactor Plan

1. **`app/page.tsx`**: Update copy/design.
2. **`features/journey-editor/live-experience.tsx`**: Create the container for Chat + Canvas.
3. **`features/interview/ai-chat-interview.tsx`**: Update to support "Live Mode" (layout changes + event emitting).
4. **`routers/ai.ts`**: (Backend) Add `generatePartialJourney` endpoint (optional for MVP, can use client-side heuristic first).

