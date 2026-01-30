import { router, publicProcedure } from "../init";
import { z } from "zod";

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
        responses: z.record(z.any()),
      })
    )
    .mutation(async ({ ctx, input }) => {
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
