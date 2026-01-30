import { db } from './lib/db';
import { Anthropic } from "@anthropic-ai/sdk";

async function testRegenerateJourney() {
  const journeyId = 'cml0z2pe60005jzdozd5o456v';
  
  // Get the journey and its interview data
  const journey = await db.journey.findUnique({
    where: { id: journeyId },
  });

  if (!journey || !journey.interviewData) {
    console.error("Journey or interview data not found");
    return;
  }

  console.log("📝 Interview Data:", journey.interviewData);

  // Build the improved prompt
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
    const primaryAction = getValueOrDefault('primaryAction');
    const firstAction = getValueOrDefault('firstAction');

    return `
You are an expert user journey designer. Create a SPECIFIC, DETAILED user journey map that captures the UNIQUE value proposition and user context for this product.

PRODUCT:
- Name: ${productType}
- What it does: ${description}
- Problem it solves: ${problem}

TARGET USERS:
- Who they are: ${userType}
- Their specific pain point: ${problem}

HOW USERS DISCOVER IT:
- Discovery method: ${discoveryChannels}

WHAT USERS DO FIRST:
- Initial action: ${primaryAction}
- Key value delivery: ${firstAction}

IMPORTANT: Create a journey that is SPECIFIC to this product, not generic. Include:
- The specific context and use case (e.g., party planning, snack cravings, specific occasions)
- Specific touchpoints and interactions relevant to "${productType}"
- Realistic emotional states and decision points for "${userType}"
- How "${firstAction}" fits into their workflow
- Specific moments of delight unique to this product
- Real friction points they might encounter

Generate 8-12 journey nodes that map the complete user lifecycle. Include:
- 1 START node
- 2-3 ONBOARDING_STEP nodes (specific to the use case)
- 2-3 ACTION nodes (specific to what users do with this product)
- 1-2 DECISION_POINT nodes (realistic decision moments)
- 1-2 MILESTONE nodes (achievement moments)
- 1 CONVERSION or TOUCHPOINT node (if relevant)
- 1 ADVOCACY node (how users promote it)
- Optional: EXIT_POINT if there's a churn risk

For each node, write descriptions that are SPECIFIC to the use case and product, not generic.

Output ONLY valid JSON with this exact structure:
{
  "nodes": [
    {
      "id": "unique_id",
      "type": "NODE_TYPE",
      "label": "Clear label",
      "description": "Specific description mentioning the actual product/use case",
      "position": {"x": number, "y": number},
      "stage": "ENTRY|PROSPECT|CUSTOMER|RECURRING|UPGRADED|TORCHBEARER"
    }
  ],
  "connections": [
    {
      "id": "connection_id",
      "sourceId": "source_node_id",
      "targetId": "target_node_id",
      "label": "What happens between these nodes"
    }
  ],
  "insights": ["insight1", "insight2"],
  "recommendations": ["recommendation1", "recommendation2"]
}`;
  }

  const prompt = buildJourneyPrompt(journey.interviewData as Record<string, any>);
  console.log("\n📨 Sending improved prompt to Claude...\n");

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
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
    const cleanJson = textContent.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanJson);

    console.log("✅ Generated journey with", result.nodes?.length, "nodes:");
    console.log("\n🎯 NODES:");
    result.nodes.forEach((node: any, i: number) => {
      console.log(`${i + 1}. [${node.type}] ${node.label}: ${node.description}`);
    });

    console.log("\n🔗 CONNECTIONS:");
    result.connections.forEach((conn: any) => {
      console.log(`${conn.sourceId} -> ${conn.targetId}: ${conn.label}`);
    });

    console.log("\n💡 INSIGHTS:");
    result.insights.forEach((insight: any) => {
      console.log(`- ${insight}`);
    });

    console.log("\n📋 RECOMMENDATIONS:");
    result.recommendations.forEach((rec: any) => {
      console.log(`- ${rec}`);
    });

  } catch (error) {
    console.error("Error:", error);
  }
}

testRegenerateJourney();
