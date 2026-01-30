import { router, publicProcedure } from "../init";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const aiRouter = router({
  // Generate journey from interview data
  generateJourney: publicProcedure
    .input(
      z.object({
        journeyId: z.string(),
        interviewData: z.record(z.any()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Build prompt from interview data
      const prompt = buildJourneyPrompt(input.interviewData);

      try {
        console.log("🚀 Generating journey for:", input.journeyId);
        console.log("📝 Interview data keys:", Object.keys(input.interviewData));

        const message = await anthropic.messages.create({
          model: "claude-opus-4-20250514",
          max_tokens: 4000,
          system: `You are an expert user journey mapper. You analyze product information and create detailed, comprehensive user journey diagrams. 
            
You must respond with a valid JSON object containing:
- nodes: array of journey nodes with id, type, label, description, position (x, y), and stage
- connections: array of connections between nodes with id, sourceId, targetId, label
- insights: array of key insights about the journey
- recommendations: array of recommendations to improve the journey

Node types: JOURNEY_START, ONBOARDING_STEP, DECISION_POINT, INTERVENTION, CONVERSION, MILESTONE, EXIT_POINT, ACTION, TOUCHPOINT

Lifecycle stages: ENTRY, PROSPECT, CUSTOMER, RECURRING, UPGRADED, TORCHBEARER

Output ONLY the JSON object. Do not include markdown code blocks.`,
          messages: [
            { role: "user", content: prompt }
          ]
        });

        const textContent = message.content[0].type === 'text' ? message.content[0].text : "{}";
        console.log("✅ Claude response received. Length:", textContent.length);

        // Robust JSON Extraction
        let cleanJson = textContent.trim();

        // 1. Remove markdown code blocks if present
        if (cleanJson.includes("```json")) {
          cleanJson = cleanJson.replace(/```json/g, "").replace(/```/g, "");
        } else if (cleanJson.includes("```")) {
          cleanJson = cleanJson.replace(/```/g, "");
        }

        // 2. Extract content between first { and last }
        const firstBrace = cleanJson.indexOf("{");
        const lastBrace = cleanJson.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1) {
          cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
        }

        let result;
        try {
          result = JSON.parse(cleanJson);
        } catch (parseError: any) {
          console.error("❌ JSON Parse Failed!");
          console.error("Parse Error:", parseError.message);
          console.error("Raw Response Length:", textContent.length);
          console.error("Raw Response Start:", textContent.substring(0, 1000));
          console.error("Raw Response End:", textContent.substring(textContent.length - 500));
          console.error("Cleaned JSON Start:", cleanJson.substring(0, 500));
          throw new Error("Failed to parse AI response as JSON. Please try again.");
        }

        console.log("📊 Parsed journey with", result.nodes?.length || 0, "nodes");

        // Save AI response to journey
        await ctx.db.journey.update({
          where: { id: input.journeyId },
          data: {
            aiPrompt: prompt,
            aiResponse: result,
            updatedAt: new Date(),
          },
        });

        // Create nodes and connections
        // Map Claude's node IDs to database node IDs
        const idMapping: Record<string, string> = {};

        if (result.nodes && result.nodes.length > 0) {
          console.log("💾 Creating", result.nodes.length, "nodes in database...");

          // Delete any existing nodes for this journey first
          await ctx.db.journeyNode.deleteMany({
            where: { journeyId: input.journeyId },
          });

          const createdNodes = await ctx.db.journeyNode.createMany({
            data: result.nodes.map((node: any, index: number) => ({
              journeyId: input.journeyId,
              type: node.type || "ACTION",
              label: node.label || `Step ${index + 1}`,
              description: node.description,
              positionX: node.position?.x || index * 200,
              positionY: node.position?.y || 100,
              data: node.data || {},
              stage: node.stage,
            })),
          });

          // Build mapping from Claude IDs to database IDs
          // Fetch ONLY the nodes we just created for this journey, in creation order
          const dbNodes = await ctx.db.journeyNode.findMany({
            where: { journeyId: input.journeyId },
            orderBy: { createdAt: 'asc' },
          });

          console.log("📍 Mapping", result.nodes.length, "Claude IDs to DB IDs");
          result.nodes.forEach((node: any, index: number) => {
            if (dbNodes[index]) {
              idMapping[node.id] = dbNodes[index].id;
              console.log(`   ${node.id} -> ${dbNodes[index].id}`);
            }
          });
        }

        if (result.connections && result.connections.length > 0) {
          console.log("🔗 Creating", result.connections.length, "connections in database...");

          // Delete existing connections
          await ctx.db.journeyConnection.deleteMany({
            where: { journeyId: input.journeyId },
          });

          await ctx.db.journeyConnection.createMany({
            data: result.connections.map((conn: any) => ({
              journeyId: input.journeyId,
              // Map Claude's IDs to database IDs, fallback to original if no mapping
              sourceId: idMapping[conn.sourceId] || conn.sourceId || conn.source || "",
              targetId: idMapping[conn.targetId] || conn.targetId || conn.target || "",
              label: conn.label,
              type: conn.type || "default",
            })),
          });

          // Verify connections are valid
          const createdConnections = await ctx.db.journeyConnection.findMany({
            where: { journeyId: input.journeyId },
          });
          const allNodeIds = new Set((await ctx.db.journeyNode.findMany({
            where: { journeyId: input.journeyId },
            select: { id: true },
          })).map((n: any) => n.id));

          let validCount = 0;
          let invalidCount = 0;
          createdConnections.forEach((conn: any) => {
            if (allNodeIds.has(conn.sourceId) && allNodeIds.has(conn.targetId)) {
              validCount++;
            } else {
              invalidCount++;
              console.warn(`Invalid connection: ${conn.sourceId} -> ${conn.targetId}`);
            }
          });
          console.log(`📊 Connection validation: ${validCount} valid, ${invalidCount} invalid`);
        }

        console.log("✨ Journey generation complete!");
        return result;
      } catch (error: any) {
        console.error("❌ Journey generation error:", error.message || error);
        console.error("Stack:", error.stack);
        console.error("Full error:", error);
        throw new Error(`Failed to generate journey: ${error.message || "Unknown error"}`);
      }
    }),

  // Get AI suggestion for improvement
  getSuggestion: publicProcedure
    .input(
      z.object({
        context: z.string(),
        type: z.enum(["improvement", "question", "alternative"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const message = await anthropic.messages.create({
          model: "claude-3-haiku-20240307",
          max_tokens: 300,
          system: "You are a helpful UX expert providing concise suggestions for user journey improvements.",
          messages: [
            {
              role: "user",
              content: `${input.type === "improvement" ? "Suggest an improvement for" : input.type === "question" ? "Answer this question about" : "Provide an alternative for"}: ${input.context}`
            }
          ]
        });

        return {
          suggestion: message.content[0].type === 'text' ? message.content[0].text : "",
        };
      } catch (error) {
        console.error("Anthropic API error:", error);
        throw new Error("Failed to get AI suggestion.");
      }
    }),
});

function buildJourneyPrompt(interviewData: Record<string, any>): string {
  const getValueOrDefault = (key: string, fallback: string = "Not specified") => {
    const value = interviewData[key];
    if (!value) return fallback;
    if (Array.isArray(value)) return value.join(", ");
    return String(value).trim() || fallback;
  };

  const productType = getValueOrDefault('productType');
  const description = getValueOrDefault('description');
  const problem = getValueOrDefault('problem');
  const userType = getValueOrDefault('userType');
  const discoveryChannels = getValueOrDefault('discoveryChannels');

  // For chat interviews, primaryAction IS the first aha moment action
  const firstAhaAction = getValueOrDefault('primaryAction') || getValueOrDefault('firstAction');

  return `
You are an empathetic Product Strategist and User Experience Expert. 
Your goal is NOT to build a "sales funnel". Your goal is to map a "User Success Path".
Revenue is a byproduct of user success.

CORE PHILOSOPHY (FIRST PRINCIPLES):
1. Users don't buy products; they "hire" products to make progress in their lives.
2. Every journey starts with a "Struggle" (Anxiety) before discovery.
3. You must "Give Value" (Reward) before you "Take Value" (Revenue).
4. Trust is earned in drops and lost in buckets.

CONTEXT:
Product: "${productType}"
Value Proposition: "${description}"
User Persona: "${userType}"
The Struggle (Problem): "${problem}"
Discovery Channel: "${discoveryChannels}"
The "Aha" Moment: "${firstAhaAction}"

TASK:
Create a detailed, 18-25 step user journey map that follows this psychological arc:

PHASE 1: THE STRUGGLE & HOPE (Acquisition/Entry)
- Start BEFORE the product. Show the user feeling the pain of "${problem}".
- Show the "Spark" of discovery via ${discoveryChannels}.
- The user is skeptical but hopeful.

PHASE 2: THE COMMITMENT (Activation/Onboarding)
- The user has to do "Work" (Sign up, setup). This is friction.
- Show a node where they might hesitate or drop out (Anxiety spikes).
- Show the "First Victory" - the moment they successfully do "${firstAhaAction}".

PHASE 3: THE HABIT & TRUST (Retention)
- The user sees the value. They feel relief/excitement.
- They start using it regularly.
- Trust is established.

PHASE 4: THE INVESTMENT (Monetization/Growth)
- ONLY NOW, after value is proven, do you ask for money or deeper data.
- Show the upgrade/conversion event as a natural next step to get MORE value, not a paywall blocking basic value.
- Final stage: They become a "Torchbearer" (Referral), telling others because they are genuinely helped.

REQUIREMENTS:
1. **Node Descriptions**: Must describe the USER'S MINDSET/EMOTION, not just the interface action. 
   - BAD: "User clicks signup."
   - GOOD: "User feels overwhelmed by current chaos, sees the landing page promise, and decides to give it a try."
2. **Specifics**: Mention "${productType}" features specifically. No generic "User uses feature" text.
3. **Logic**: Ensure the flow makes sense. Don't ask for payment before the "Aha Moment".
4. **Swimlanes**: Use these Y-coordinates to group phases:
   - THE STRUGGLE / DISCOVERY (Acquisition): y=0
   - THE WORK / "AHA" (Activation): y=250
   - THE HABIT (Retention): y=500
   - THE INVESTMENT (Monetization): y=750
   - THE TORCHBEARER (Referral): y=1000

Format as JSON only:
{
  "nodes": [
    {"id": "n1", "type": "JOURNEY_START", "label": "The Struggle", "description": "User is frustrated by ${problem} and looking for a solution.", "position": {"x": 0, "y": 0}, "stage": "ENTRY", "data": {"funnelStage": "ACQUISITION"}}
  ],
  "connections": [
    {"id": "c1", "sourceId": "n1", "targetId": "n2", "label": "Searches online"}
  ],
  "insights": ["Key insight about user anxiety..."],
  "recommendations": ["Make the signup friction lower because..."]
}`;
}
