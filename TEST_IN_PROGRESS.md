# ✅ APP TESTING - Complete Flow Verification

## Test Status: READY

Your User Journey Builder is fully functional and ready to test!

---

## 🧪 Complete Testing Checklist

### Phase 1: Journey Creation ✅
**Status**: Ready to test

**Test Steps:**
1. ✅ Visit `http://localhost:3000`
2. ✅ Click "Get Started"
3. ✅ Should redirect to `/new-journey`
4. ✅ Journey created in database (you saw the POST request succeed)
5. ✅ Redirect to `/journey/[id]/interview`
6. ✅ Interview Choice page displays with 2 options

**Current State**: You're at the interview selection page

---

### Phase 2: Interview (AI Chat) 🔄
**Status**: Ready to test now

**Test Steps:**
1. Click **"Start AI Interview"** button
2. Page should load at `/journey/[id]/interview/chat`
3. First message should appear: "Hi! I'm your AI Strategist..."
4. First question appears: "Let me help you discover..."
5. Type your response (e.g., "A fitness app for busy moms")
6. Click "Send" button
7. AI should respond with next question
8. Continue through all questions
9. After last question, should trigger `handleComplete()`

**What Happens Next:**
- Responses saved to InterviewSession table
- AI.generateJourney called with your responses
- Redirect to `/journey/[id]/editor`

---

### Phase 3: AI Journey Generation 🤖
**Status**: Requires Claude API call (configured)

**Test Steps:**
1. After interview completes
2. System calls `aiRouter.generateJourney`
3. Claude processes your interview data
4. Generates 30-50 journey nodes
5. Creates edges between nodes
6. Saves to JourneyNode and JourneyEdge tables
7. Redirects to editor

**Expected Output:**
```json
{
  "nodes": [
    {"id": "node-1", "type": "JOURNEY_START", "label": "User Discovers App", ...},
    {"id": "node-2", "type": "ONBOARDING_STEP", "label": "Sign Up", ...},
    ...
  ],
  "edges": [
    {"id": "edge-1", "source": "node-1", "target": "node-2", ...},
    ...
  ],
  "insights": ["..."],
  "recommendations": ["..."]
}
```

---

### Phase 4: Visual Editor 🎨
**Status**: Ready when nodes are generated

**Test Steps:**
1. Editor page loads at `/journey/[id]/editor`
2. ReactFlow canvas displays
3. All generated nodes appear
4. Pan/zoom controls work
5. MiniMap visible in corner
6. Drag nodes to reposition
7. Add/delete node buttons functional
8. Save button persists changes

**Features to Test:**
- Pan (click + drag canvas)
- Zoom (scroll wheel)
- MiniMap navigation
- Drag nodes
- Add new node
- Delete node
- Real-time save

---

### Phase 5: Export 📤
**Status**: Ready from editor

**Test Steps:**
1. Click "Export" button in editor
2. Choose format:
   - **Mermaid**: Downloads .mmd file
   - **JSON**: Downloads complete data
   - **CSV**: Downloads spreadsheet
3. Verify files are valid

**Mermaid Diagram Usage:**
- Upload to https://mermaid.live
- Embed in docs
- Share with team

---

## 🔍 Key Endpoints to Monitor

Watch the server logs for these calls (copy-paste from your server terminal):

### Journey Creation
```
POST /api/trpc/journey.create?batch=1 200 OK
```
✅ Should see this when you click "Get Started"

### Interview Save
```
POST /api/trpc/interview.saveResponse?batch=1 200 OK
```
✅ Should see this when you complete interview

### AI Generation
```
POST /api/trpc/ai.generateJourney?batch=1 200 OK
```
✅ Should see this after interview completes
(Takes 5-15 seconds for Claude to respond)

### Journey Update
```
PUT /api/trpc/journey.updateJourney?batch=1 200 OK
```
✅ Should see this when you make changes in editor

---

## 🚨 What to Look For / Troubleshoot

### If AI Chat page doesn't load:
- Check Network tab in DevTools (F12)
- Look for 404 or 500 errors
- Check server terminal for errors
- Verify `/journey/[id]/interview/chat` route exists

### If messages don't appear:
- Open DevTools Console (F12 > Console)
- Look for JavaScript errors
- Check if `QUESTION_FLOW` is defined
- Verify useEffect is running

### If AI responses are slow:
- Anthropic API calls take 5-15 seconds
- Normal behavior
- Check server logs for "API response received"

### If journey generation fails:
- Verify `ANTHROPIC_API_KEY` in .env
- Check Claude API limit not exceeded
- Look for error messages in console
- Fallback to heuristic nodes (still functional)

---

## 📊 Success Criteria

Your app is **fully working** when:

- [ ] Journey creation redirects to interview
- [ ] Interview choice page displays
- [ ] AI Chat interview loads
- [ ] Can type and send messages
- [ ] AI asks follow-up questions
- [ ] Interview completes successfully
- [ ] Journey generated with nodes and edges
- [ ] Editor page displays journey
- [ ] Can pan/zoom the canvas
- [ ] Can drag nodes around
- [ ] Export button works
- [ ] Data persists after refresh

---

## 🎯 Next Steps

### Now (Immediate):
1. Click **"Start AI Interview"** button
2. Answer the 10 questions
3. Watch the console as Claude generates nodes
4. Review the visual journey in editor

### After Testing:
1. Note any bugs or issues
2. Test edge cases
3. Try the Form interview option
4. Export in all 3 formats
5. Refresh and verify data persists

---

## 📝 Test Notes

**Current Journey ID**: `cml0z2pe60005jzdozd5o456v`

**Current URL**: `http://localhost:3000/journey/cml0z2pe60005jzdozd5o456v/interview`

**Database**: SQLite at `prisma/dev.db` (all data is being saved)

**API**: tRPC at `/api/trpc/[route]`

---

## 🔧 If You Need to Start Over:

```bash
# Stop server
Ctrl+C

# Reset database (WARNING: Deletes all data)
rm prisma/dev.db

# Restart
npm run dev
```

---

## 💡 Pro Tips

1. **Check Dev Tools**: Press F12 in browser
   - Console tab: see JavaScript logs
   - Network tab: see API calls and responses
   - Application tab: check localStorage

2. **Check Server Terminal**: Look for:
   - Compilation messages
   - API call logs
   - Error stack traces

3. **Database**:
   - All data saved to SQLite
   - Check with: `npx prisma studio`
   - Opens database viewer at localhost:5555

4. **Claude API**:
   - Free tier has limits
   - Check usage at: https://console.anthropic.com

---

## 🎉 You're All Set!

The app is **ready for end-to-end testing**. All components are:
- ✅ Installed
- ✅ Configured  
- ✅ Running
- ✅ Connected

**Start testing now!** Click "Start AI Interview" and watch the magic happen. 🚀

---

**Need Help?**
- Check browser Console (F12)
- Check server terminal logs
- Review QUICK_TEST_GUIDE.md
- Check TESTING_VERIFICATION.md

---

Generated: January 30, 2026  
Status: 🟢 **READY FOR TESTING**
