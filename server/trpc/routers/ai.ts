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
          model: "claude-3-haiku-20240307",
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
        console.log("✅ Claude response received, parsing JSON...");
        
        // Naive cleanup for markdown if it slips through
        const cleanJson = textContent.replace(/```json/g, "").replace(/```/g, "").trim();
        const result = JSON.parse(cleanJson);

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
  // Handle both detailed form data and simple chat data
  const getValueOrDefault = (key: string, fallback: string = "Not specified") => {
    const value = interviewData[key];
    if (!value) return fallback;
    if (Array.isArray(value)) return value.join(", ");
    return String(value).trim() || fallback;
  };

  const recommendBusinessModel = () => {
    const productText = `${getValueOrDefault("productType")} ${getValueOrDefault("description")}`.toLowerCase();
    const userText = `${getValueOrDefault("userType")} ${getValueOrDefault("problem")}`.toLowerCase();

    if (productText.includes("api") || productText.includes("usage") || productText.includes("credits")) {
      return {
        model: "Usage-Based Credits",
        rationale: "Value is delivered per-use and usage varies by user. Credits keep pricing aligned with value.",
        conversionPath: "free credits → use → credits low → pay → continue use",
      };
    }

    if (productText.includes("marketplace") || productText.includes("booking") || productText.includes("transactions")) {
      return {
        model: "Marketplace Fee",
        rationale: "Core value happens at the transaction moment. Monetize per transaction or take a platform fee.",
        conversionPath: "discover → list/browse → transaction → fee",
      };
    }

    if (userText.includes("enterprise") || userText.includes("b2b") || productText.includes("saas")) {
      return {
        model: "Free Trial → Paid",
        rationale: "Users need full product experience before committing; trials drive trust and conversion.",
        conversionPath: "signup → trial → value → upgrade → payment",
      };
    }

    return {
      model: "Freemium → Upgrade",
      rationale: "Low-friction entry is best for broad acquisition; monetize after clear value moments.",
      conversionPath: "signup → use free tier → hit limit → upgrade",
    };
  };

  const recommendedModel = recommendBusinessModel();

  // For chat interviews, primaryAction IS the first aha moment action
  const firstAhaAction = getValueOrDefault('primaryAction') || getValueOrDefault('firstAction');

  const productType = getValueOrDefault('productType');
  const description = getValueOrDefault('description');
  const problem = getValueOrDefault('problem');
  const userType = getValueOrDefault('userType');
  const discoveryChannels = getValueOrDefault('discoveryChannels');

  return `
You are an expert user journey designer. Your task: Create a SPECIFIC, DETAILED, REALISTIC user journey for this exact product. Make it concrete - not generic.

PRODUCT INFO:
Product: "${productType}"
What it does: "${description}"
Problem solved: "${problem}"

BUSINESS MODEL INTELLIGENCE (use this to shape the conversion path):
Recommended model: "${recommendedModel.model}"
Why it fits: "${recommendedModel.rationale}"
Conversion path: "${recommendedModel.conversionPath}"

USER INFO:
User type: "${userType}"
User pain: "${problem}"
Discovery method: "${discoveryChannels}"
First key action: "${firstAhaAction}"

CRITICAL REQUIREMENTS:
1. EVERY node description must mention "${productType}" or its specific features/workflow
2. Match the tone and mindset of "${userType}"
3. Show how "${firstAhaAction}" creates value
4. Include realistic decision points and friction specific to this product
5. NO GENERIC CONTENT - be specific to this product type
6. Cover ALL funnel stages: ACQUISITION → ACTIVATION → RETENTION → MONETIZATION → REFERRAL
7. Include at least one dropout path per funnel stage with a recovery intervention
8. Include standard touchpoints: email, payment, form submission, sharing/referral
9. Label each node with data.funnelStage (ACQUISITION/ACTIVATION/RETENTION/MONETIZATION/REFERRAL)
10. Use swimlane positioning:
    - ACQUISITION y=0
    - ACTIVATION y=250
    - RETENTION y=500
    - MONETIZATION y=750
    - REFERRAL y=1000
    x should increase left-to-right in each stage (x=0, 250, 500, ...)

Create 18-28 nodes. ALLOWED node types ONLY: JOURNEY_START, ONBOARDING_STEP, ACTION, DECISION_POINT, INTERVENTION, CONVERSION, MILESTONE, TOUCHPOINT, EXIT_POINT
Use stages: ENTRY, PROSPECT, CUSTOMER, RECURRING, UPGRADED, TORCHBEARER

Return ONLY valid JSON (no markdown):
{
  "nodes": [
    {"id": "n1", "type": "JOURNEY_START", "label": "Discover ${productType}", "description": "Users discover ${productType} via ${discoveryChannels}", "position": {"x": 0, "y": 0}, "stage": "ENTRY", "data": {"funnelStage": "ACQUISITION"}},
    {"id": "n2", "type": "ONBOARDING_STEP", "label": "Sign Up", "description": "User signs up to access ${productType}", "position": {"x": 250, "y": 0}, "stage": "PROSPECT", "data": {"funnelStage": "ACQUISITION"}}
  ],
  "connections": [
    {"id": "c1", "sourceId": "n1", "targetId": "n2", "label": "User creates account"}
  ],
  "insights": ["insight1"],
  "recommendations": ["recommendation1"]
}`;
}
