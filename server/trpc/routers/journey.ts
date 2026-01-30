import { router, publicProcedure, protectedProcedure } from "../init";
import { z } from "zod";

export const journeyRouter = router({
  // Create a new journey
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1).max(200),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Get userId from session
      const userId = "temp-user-id"; // Placeholder

      const journey = await ctx.db.journey.create({
        data: {
          userId,
          title: input.title,
          description: input.description,
          status: "DRAFT",
        },
      });

      return journey;
    }),

  // Get journey by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const journey = await ctx.db.journey.findUnique({
        where: { id: input.id },
        include: {
          nodes: true,
          connections: true,
          comments: {
            orderBy: { createdAt: "desc" },
          },
          versions: {
            orderBy: { versionNumber: "desc" },
            take: 5,
          },
        },
      });

      return journey;
    }),

  // List user's journeys
  list: publicProcedure
    .input(
      z.object({
        status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // TODO: Get userId from session
      const userId = "temp-user-id";

      const journeys = await ctx.db.journey.findMany({
        where: {
          userId,
          ...(input.status && { status: input.status }),
        },
        orderBy: { updatedAt: "desc" },
        include: {
          _count: {
            select: {
              nodes: true,
              comments: true,
            },
          },
        },
      });

      return journeys;
    }),

  // Update journey
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const journey = await ctx.db.journey.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      return journey;
    }),

  // Delete journey
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.journey.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // Save nodes and connections
  saveNodes: publicProcedure
    .input(
      z.object({
        journeyId: z.string(),
        nodes: z.array(
          z.object({
            id: z.string(),
            type: z.string(),
            label: z.string(),
            description: z.string().optional(),
            positionX: z.number(),
            positionY: z.number(),
            data: z.any().optional(),
            stage: z.string().optional(),
          })
        ),
        connections: z.array(
          z.object({
            id: z.string(),
            sourceId: z.string(),
            targetId: z.string(),
            label: z.string().optional(),
            type: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Delete existing nodes and connections
      await ctx.db.journeyNode.deleteMany({
        where: { journeyId: input.journeyId },
      });
      await ctx.db.journeyConnection.deleteMany({
        where: { journeyId: input.journeyId },
      });

      // Create new nodes
      await ctx.db.journeyNode.createMany({
        data: input.nodes.map((node) => ({
          journeyId: input.journeyId,
          type: node.type as any,
          label: node.label,
          description: node.description,
          positionX: node.positionX,
          positionY: node.positionY,
          data: node.data,
          stage: node.stage as any,
        })),
      });

      // Create new connections
      await ctx.db.journeyConnection.createMany({
        data: input.connections.map((conn) => ({
          journeyId: input.journeyId,
          sourceId: conn.sourceId,
          targetId: conn.targetId,
          label: conn.label,
          type: conn.type || "default",
        })),
      });

      return { success: true };
    }),
  // Analyze conversation with Claude
  analyzeConversation: publicProcedure
    .input(
      z.object({
        journeyId: z.string(),
        messages: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string()
        })),
        currentStage: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Initialize Anthropic
      // Ideally, the API key should be in process.env.ANTHROPIC_API_KEY
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error("ANTHROPIC_API_KEY is not set");
      }

      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      // 2. Construct System Prompt
      const systemPrompt = `You are an expert UX Strategist and Product Manager. 
      Your goal is to analyze the conversation with the user and generate a "User Journey Map" in real-time.
      
      Return ONLY a valid JSON object matching this schema:
      {
        "nodes": [
          { 
            "id": "string (unique)", 
            "type": "JOURNEY_START" | "MILESTONE" | "ACTION" | "DECISION_POINT" | "TOUCHPOINT" | "CONVERSION" | "EXIT_POINT", 
            "label": "string (short title)", 
            "description": "string (insight or detail)",
            "position": { "x": number, "y": number } 
          }
        ],
        "edges": [
          { "id": "string", "source": "string", "target": "string", "label": "string (optional)" }
        ]
      }
      
      RULES:
      1. Visualize the user's flow based on what they just said.
      2. If they mention a problem, create a node for it (ACTION or TOUCHPOINT).
      3. If they mention a goal, create a MILESTONE.
      4. Place nodes logically continuously from left to right (x: 0, 200, 400...).
      5. Do NOT return markdown formatting, just the raw JSON.
      `;

      // 3. Call Claude
      // Convert messages to Anthropic format
      const anthropicMessages = input.messages.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content
      }));

      const response = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 4096,
        system: systemPrompt,
        messages: anthropicMessages,
      });

      // 4. Parse Response
      try {
        const textContent = response.content[0].type === 'text' ? response.content[0].text : "";
        // Extract JSON if wrapped in code blocks
        const jsonMatch = textContent.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : textContent;

        const result = JSON.parse(jsonStr);
        return result;
      } catch (e) {
        console.error("Failed to parse Claude response", e);
        return { nodes: [], edges: [] };
      }
    }),
});
