# Two-Flow Interview System Implementation

## Overview
Created a dual-path interview system allowing users to choose between:
1. **AI Chat Flow** - Quick, conversational, 1-on-1 with AI (⚡ ~10 minutes)
2. **Detailed Form Flow** - Structured pages, comprehensive input (📋 ~20-30 minutes)

---

## User Journey

```
Landing Page (/page.tsx)
    ↓
New Journey (/new-journey/page.tsx) - Creates journey ID
    ↓
Interview Choice (/journey/[journeyId]/interview/page.tsx)
    ├─→ AI Chat Flow (/journey/[journeyId]/interview/chat/page.tsx)
    │     └─→ AIChatInterview Component (10 questions, conversational)
    │
    └─→ Form Flow (/journey/[journeyId]/interview/form/page.tsx)
          └─→ 6 Pages × 3 Questions = 18 Total Questions
              - Page 1: Product Identity (SaaS, description, problem)
              - Page 2: Target Users (user type, experience, pain point)
              - Page 3: Acquisition (discovery channels, first action, data)
              - Page 4: Core Experience (primary action, usage, return drivers)
              - Page 5: Monetization (revenue model, upgrade trigger, pricing)
              - Page 6: Retention & Growth (success definition, growth, churn)
```

---

## Components Created

### 1. **Interview Choice Component**
**File**: `features/interview/interview-choice.tsx`

**Purpose**: Landing page for selecting between AI Chat or Form flow

**Features**:
- Side-by-side comparison cards (AI Chat vs Form)
- Comparison table showing:
  - Time to complete (10 min vs 20-30 min)
  - Ease of use
  - Detail level
  - AI adaptation
  - Follow-up questions
  - Journey quality
- Interactive selection with visual feedback
- Feature lists for each option:
  - **AI Chat**: Conversational, AI adapts, quick, best for validation
  - **Form**: Organized pages, deeper insights, comprehensive, best for planning
- Responsive design with Tailwind CSS
- Navigation to both flows via Link components

**Visual Design**:
- Blue theme for AI Chat (⚡ Fastest badge)
- Purple theme for Form (📋 More Rich badge)
- Icon-based features list
- Responsive grid layout

---

### 2. **AI Chat Interview Component**
**File**: `features/interview/ai-chat-interview.tsx`

**Purpose**: Conversational interface for quick journey building

**Features**:
- Chat-style interface with message history
- 10 sequential questions (automated flow)
- User messages appear on right (blue)
- AI messages appear on left (white)
- Real-time message scrolling
- Progress indicator (Question X of 10)
- Progress percentage
- Auto-answer storage in state
- Textarea input with Shift+Enter for multiline
- Loading state with "AI is thinking..." indicator
- Questions cover all 6 interview categories:
  1. Product type
  2. One-sentence description
  3. Problem solved
  4. Primary user type
  5. User experience level
  6. Main pain point
  7. Discovery channels
  8. First user action
  9. Revenue model
  10. Success definition

**UX Design**:
- Encouraging messages and emojis
- Simulated 1.5s response time (feels natural)
- Smooth scrolling to new messages
- Help text: "Just answer naturally! The AI will understand..."
- Message bubbles with appropriate styling

---

### 3. **Detailed Form Component**
**File**: `app/journey/[journeyId]/interview/form/page.tsx`

**Purpose**: Structured form pages for comprehensive input

**Features**:
- 6 organized category pages
- Multi-step form with progress bar
- Back/Previous navigation
- Next/Complete button
- Progress tracking (Page X of 6 + percentage)
- Question types:
  - **Text**: Simple input field
  - **Textarea**: Multi-line text area
  - **Select**: Dropdown single choice
  - **Checkbox**: Multi-select options
- Required field validation (*)
- Page-level state management
- Smooth transitions between pages
- Loading state on submit
- Success/completion screen with spinner

**Page Structure**:
```
Page 1: Product Identity (Blue)
  - Product type (SaaS, Mobile, etc.)
  - One-sentence description
  - Problem solved

Page 2: Target Users (Purple)
  - Primary user type
  - Experience level
  - Main pain point

Page 3: User Acquisition (Green)
  - Discovery channels (multi-select)
  - First action user takes
  - Signup data collected

Page 4: Core Experience (Orange)
  - Primary user action
  - Usage frequency
  - Return drivers (multi-select)

Page 5: Monetization (Red)
  - Revenue model
  - Upgrade trigger
  - Price range

Page 6: Retention & Growth (Indigo)
  - Success definition
  - Growth mechanisms (multi-select)
  - Churn reasons (multi-select)
```

---

### 4. **UI Components Added**
Created missing shadcn/ui components:
- **Card**: `components/ui/card.tsx` - Card container with header, title, description, content, footer
- **Input**: `components/ui/input.tsx` - Text input field
- **Textarea**: `components/ui/textarea.tsx` - Multi-line text area

---

## Page Routes Created

### Entry Points:
1. **`/new-journey`** - Creates journey ID, shows loading spinner, redirects to interview choice
2. **`/journey/[journeyId]/interview`** - Shows interview choice (AI vs Form)
3. **`/journey/[journeyId]/interview/chat`** - AI Chat flow
4. **`/journey/[journeyId]/interview/form`** - Detailed Form flow

---

## Key Features

### AI Chat Flow Advantages:
✅ 10 minutes vs 20-30 minutes  
✅ Natural, conversational feel  
✅ AI can adapt follow-up questions based on answers  
✅ Best for people in a hurry / quick validation  
✅ No decision fatigue from form fields  
✅ Feels like talking to a co-founder  

### Form Flow Advantages:
✅ Comprehensive 18-question interview  
✅ Deeper strategic insights  
✅ Organized by category  
✅ More time to think about answers  
✅ Can skip back to previous pages  
✅ Better for detailed planning  

---

## Data Flow (To Be Integrated)

### AI Chat Flow:
```
1. User answers 10 sequential questions
2. Answers stored in component state: { question_0: answer, question_1: answer, ... }
3. onComplete() called with full data object
4. TODO: Save to database via tRPC interview.saveResponse()
5. TODO: Call tRPC ai.generateJourney() with interview data
6. TODO: Redirect to editor with auto-generated nodes
```

### Form Flow:
```
1. User fills 6 pages × 3 questions = 18 fields
2. Form data stored in component state: { product_type: "SaaS", ... }
3. On submit, call tRPC to save form data
4. TODO: Call tRPC ai.generateJourney() 
5. TODO: Redirect to editor
```

---

## TODO - Integration Points

These components are ready to connect to the backend:

1. **In `ai-chat-interview.tsx`** (line ~120):
   ```typescript
   const handleSendMessage = async () => {
     // TODO: Call tRPC interview.saveResponse(journeyId, answer)
     // TODO: Call tRPC interview.getQuestions() to get next question
   }
   ```

2. **In `/journey/[journeyId]/interview/chat/page.tsx`** (line ~25):
   ```typescript
   const handleComplete = async (data: Record<string, any>) => {
     // TODO: Save interview data: trpc.interview.saveResponse()
     // TODO: Generate journey: trpc.ai.generateJourney()
     // TODO: Redirect: router.push(`/journey/${journeyId}/editor`)
   }
   ```

3. **In `/journey/[journeyId]/interview/form/page.tsx`** (line ~140):
   ```typescript
   const handleSubmit = async () => {
     // TODO: Save form data: trpc.interview.saveResponse()
     // TODO: Generate journey: trpc.ai.generateJourney()
     // TODO: Redirect: router.push(`/journey/${journeyId}/editor`)
   }
   ```

4. **In `/new-journey/page.tsx`** (line ~10):
   ```typescript
   useEffect(() => {
     // TODO: Call tRPC journey.create() to create actual journey
     // const { id } = await trpc.journey.create.mutate({ ... })
   }, [])
   ```

---

## Styling

- **Colors**: Blue for AI (fast), Purple for Form (detailed)
- **Responsive**: Mobile-first with `sm:` and `md:` breakpoints
- **Animations**: Smooth transitions, loading spinners, progress bar animations
- **Accessibility**: Proper labels, required field indicators, semantic HTML

---

## Component Dependencies

```
interview-choice.tsx
  ├─ Card (ui/card.tsx)
  ├─ Button (ui/button.tsx)
  ├─ Icons (lucide-react)

ai-chat-interview.tsx
  ├─ Button (ui/button.tsx)
  ├─ Card (ui/card.tsx)
  ├─ Textarea (ui/textarea.tsx)
  ├─ Icons (lucide-react)

form/page.tsx
  ├─ Button (ui/button.tsx)
  ├─ Card (ui/card.tsx)
  ├─ Input (ui/input.tsx)
  ├─ Textarea (ui/textarea.tsx)
  ├─ Icons (lucide-react)
```

---

## Next Steps

1. ✅ Create two-flow interview system (DONE)
2. ⏳ Connect tRPC interview.saveResponse() to AI Chat
3. ⏳ Connect tRPC interview.saveResponse() to Form
4. ⏳ Create ReactFlow editor page
5. ⏳ Implement ai.generateJourney() integration
6. ⏳ Build node components (9 types)
7. ⏳ Add commenting system
8. ⏳ Implement authentication
9. ⏳ Add Stripe payments
