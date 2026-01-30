import { router, publicProcedure } from "../init";
import { z } from "zod";

// Validation schema for interview responses
const interviewResponseSchema = z.object({
  // Core fields that should be non-empty strings
  productType: z.string().min(3, "Product type must be at least 3 characters").optional(),
  description: z.string().min(3, "Description must be at least 3 characters").optional(),
  problem: z.string().min(3, "Problem description must be at least 3 characters").optional(),
  userType: z.string().min(3, "User type must be at least 3 characters").optional(),
  discoveryChannels: z.string().min(3, "Discovery channels must be at least 3 characters").optional(),
  primaryAction: z.string().min(3, "Primary action must be at least 3 characters").optional(),
  
  // Form-specific fields
  product_type: z.string().min(1).optional(),
  product_description: z.string().min(3).optional(),
  problem_solved: z.string().min(3).optional(),
  user_type: z.string().min(1).optional(),
  experience_level: z.string().min(1).optional(),
  pain_point: z.string().min(3).optional(),
  discovery_channels: z.union([z.string(), z.array(z.string())]).optional(),
  first_action: z.string().min(1).optional(),
  data_collected: z.string().optional(),
  primary_action: z.string().min(3).optional(),
  usage_frequency: z.string().min(1).optional(),
  return_drivers: z.union([z.string(), z.array(z.string())]).optional(),
  revenue_model: z.string().min(1).optional(),
  upgrade_trigger: z.string().optional(),
  churn_reasons: z.union([z.string(), z.array(z.string())]).optional(),
  competitive_advantage: z.string().optional(),
}).passthrough(); // Allow additional fields

export const interviewRouter = router({
  // Get all interview questions by category
  getQuestions: publicProcedure
    .input(
      z.object({
        category: z.enum([
          "PRODUCT_IDENTITY",
          "TARGET_USERS",
          "USER_ACQUISITION",
          "CORE_EXPERIENCE",
          "MONETIZATION",
          "RETENTION_GROWTH",
        ]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const questions = await ctx.db.interviewQuestion.findMany({
        where: {
          isActive: true,
          ...(input.category && { category: input.category }),
        },
        orderBy: [
          { category: "asc" },
          { order: "asc" },
        ],
      });
      
      return questions;
    }),

  // Save interview responses
  saveResponse: publicProcedure
    .input(
      z.object({
        journeyId: z.string(),
        responses: interviewResponseSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Validate that at least some responses are provided
      const responseCount = Object.keys(input.responses).length;
      if (responseCount === 0) {
        throw new Error("At least one interview response is required");
      }

      // Update journey with interview data
      const journey = await ctx.db.journey.update({
        where: { id: input.journeyId },
        data: {
          interviewData: input.responses,
          updatedAt: new Date(),
        },
      });
      
      return journey;
    }),
});
