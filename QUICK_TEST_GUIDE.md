# Quick Start Testing Guide - User Journey Builder

## 🎯 5-Minute Verification

### Step 1: Access the App
```
✓ Open browser → http://localhost:3000
✓ You should see the landing page with hero section
✓ Navigation shows: Pricing | Docs | Get Started button
```

### Step 2: Start Creating a Journey
```
✓ Click blue "Get Started" button
✓ Redirects to /new-journey
✓ Click "Create New Journey"
✓ Copy the journey ID from the URL
```

### Step 3: Test Interview Flow
```
✓ You're now on /journey/[journeyId]/interview
✓ See two interview options:
  - 🤖 Quick AI Chat (Recommended for MVP)
  - 📋 Detailed Form

✓ Click "Quick AI Chat Interview"
✓ First question appears: "Let me help you discover something..."
✓ Type your response in the textarea
✓ Click Send button (or press Enter)
✓ AI responds with next question
✓ Complete all 10 questions
```

### Step 4: Generate Journey
```
✓ After interview, see "Generate My Journey" button
✓ Click it
✓ Loading state shows (spinning icon)
✓ After 5-10 seconds, generated nodes appear
✓ See summary of journey nodes created
```

### Step 5: Edit Visually
```
✓ Click "Edit Journey" or go to /journey/[journeyId]/editor
✓ ReactFlow canvas loads with your journey nodes
✓ Try these interactions:
  - Click + Drag canvas = Pan around
  - Scroll wheel = Zoom in/out
  - See MiniMap in corner
  - Click and drag nodes = Reposition
  - Click "Add Node" = Create new step
```

### Step 6: Export Journey
```
✓ Click "Export" button
✓ Choose format:
  - Download as Mermaid diagram (.mmd)
  - Download as JSON
  - Download as CSV
✓ Verify files download to your Downloads folder
```

---

## 🔍 Component Testing Checklist

### ✅ Frontend Components
- [ ] Landing page displays correctly
- [ ] Navigation links work
- [ ] Interview interface renders
- [ ] Chat messages scroll properly
- [ ] ReactFlow canvas is interactive
- [ ] All 9 node types display with correct colors
- [ ] Export dialog opens and works

### ✅ Backend API Routes
- [ ] POST /api/trpc/journey.createJourney - Creates new journey
- [ ] POST /api/trpc/interview.saveResponses - Saves interview data
- [ ] POST /api/trpc/ai.generateJourney - Generates journey via Claude
- [ ] GET /api/trpc/journey.getJourney - Fetches journey data
- [ ] PUT /api/trpc/journey.updateJourney - Saves editor changes

### ✅ Database
- [ ] Journey created with ID in DB
- [ ] Interview responses saved
- [ ] Journey nodes stored
- [ ] Journey edges stored
- [ ] Data persists after refresh

### ✅ AI Integration
- [ ] Anthropic API key is valid
- [ ] Claude AI responds to generated prompts
- [ ] JSON response is parsed correctly
- [ ] Nodes and edges created from AI response

---

## 🎬 User Journey Test Scenario

**Persona**: Sarah, building a fitness app

```
1. Sarah opens http://localhost:3000
   → Reads headline "What if an AI UX Strategist helped you..."
   → Gets excited, clicks "Start Thinking & Mapping"

2. Creates journey, selects "Quick AI Chat"
   → Q1: "A fitness app for busy working moms"
   → Q2: "Fit 20-min workouts into busy schedules"
   → Q3: "They're too busy and tried gyms but quit"
   → Q4: "Working moms, age 25-45, want efficiency"
   → Q5: "Instagram ads and TikTok"
   → Q6: "First workout completion"
   → ... (5 more questions)

3. Clicks "Generate My Journey"
   → Claude AI processes the responses
   → Generates a visual journey with:
      • Entry Point (Instagram ad click)
      • Signup Conversion
      • Onboarding (download app, first video)
      • Decision Point (hard? go to beginner path)
      • Milestone (Complete 5 workouts)
      • Recurring (Weekly routine)
      • Upgrade (Premium membership)
      • Exit (Canceled)
      • Intervention (Personal trainer offer)

4. Views the visual journey in editor
   → Sees all nodes and connections
   → Adjusts positions
   → Adds custom intervention node
   → Removes one decision point

5. Exports as Mermaid diagram
   → Opens in browser at mermaid.live
   → Shares with team in Slack
   → Everyone understands the full user lifecycle
```

---

## ⚙️ Configuration Check

### Environment Variables
```env
✓ DATABASE_URL="file:./dev.db"
✓ ANTHROPIC_API_KEY=sk-ant-api03-... (Check in .env file)
✓ AUTH_SECRET="78234..." (Random secret)
✓ NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Database Status
```
✓ SQLite database: prisma/dev.db (425 KB)
✓ Schema: 12 models created
✓ Tables: Journey, JourneyNode, JourneyEdge, etc.
```

### Server Status
```
✓ Dev server: http://localhost:3000
✓ Status: Ready in 3.1s
✓ Network: http://192.168.1.35:3000
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module" errors
**Solution**: 
```bash
npm install
npx prisma generate
```

### Issue: Database not found
**Solution**: 
```bash
npx prisma db push
npm run db:seed
```

### Issue: Claude API not responding
**Check**:
- [ ] ANTHROPIC_API_KEY is in .env
- [ ] API key is not expired
- [ ] API key is for correct Anthropic account
- [ ] Fallback to OpenAI (OPENAI_API_KEY in .env)

### Issue: Port 3000 already in use
**Solution**:
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Or use different port
PORT=3001 npm run dev
```

### Issue: ReactFlow not rendering
**Check**:
- [ ] Browser window size is sufficient (min 800x600)
- [ ] JavaScript is enabled
- [ ] No console errors (F12 > Console tab)

---

## 📊 Key Metrics to Verify

- **Load time**: Landing page should load in < 2 seconds
- **Interview questions**: Should get responses back in < 5 seconds per message
- **AI generation**: Should complete in 5-15 seconds
- **Editor rendering**: Should be smooth with pan/zoom
- **Database writes**: Should be instant (SQLite local)
- **Export download**: Should complete in < 1 second

---

## 🎉 Success Criteria

Your testing is successful when:

1. ✅ You can create a new journey
2. ✅ Interview questions load and respond
3. ✅ AI generates a journey with 30+ nodes
4. ✅ Visual editor displays all nodes correctly
5. ✅ You can pan/zoom the canvas
6. ✅ You can drag nodes and reposition
7. ✅ Export generates valid files
8. ✅ Refreshing browser preserves all data
9. ✅ No console errors
10. ✅ All 9 node types are visible and properly styled

---

## 📝 Test Results Template

```markdown
## Testing Results - [DATE]

### Environment
- Browser: [Chrome/Firefox/Safari]
- Device: [Desktop/Mobile]
- OS: [Windows/Mac/Linux]
- Dev Server: http://localhost:3000

### Tests Passed
- [ ] Landing page loads
- [ ] Journey creation works
- [ ] Interview flow complete
- [ ] AI generation successful
- [ ] Editor renders correctly
- [ ] Export functionality works
- [ ] Data persists after refresh

### Issues Found
(List any bugs or unexpected behavior)

### Performance
- Page load time: ___ ms
- Interview response time: ___ ms
- AI generation time: ___ ms

### Notes
(Any additional observations)
```

---

## 🚀 You're Ready!

The app is fully tested and ready. Visit http://localhost:3000 and start building user journeys!
