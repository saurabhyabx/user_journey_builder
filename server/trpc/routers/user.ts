import { router, publicProcedure } from "../init";
import { z } from "zod";

export const userRouter = router({
  // Get user profile
  getProfile: publicProcedure.query(async ({ ctx }) => {
    // TODO: Get userId from session
    const userId = "temp-user-id";
    
    const profile = await ctx.db.userProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });
    
    return profile;
  }),

  // Update profile
  updateProfile: publicProcedure
    .input(
      z.object({
        displayName: z.string().optional(),
        bio: z.string().optional(),
        company: z.string().optional(),
        website: z.string().url().optional(),
        theme: z.enum(["light", "dark"]).optional(),
        emailNotifications: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Get userId from session
      const userId = "temp-user-id";
      
      const profile = await ctx.db.userProfile.update({
        where: { userId },
        data: input,
      });
      
      return profile;
    }),

  // Get usage stats
  getUsageStats: publicProcedure.query(async ({ ctx }) => {
    // TODO: Get userId from session
    const userId = "temp-user-id";
    
    const profile = await ctx.db.userProfile.findUnique({
      where: { userId },
      select: {
        tier: true,
        journeysCreated: true,
        exportsCount: true,
        storageUsed: true,
      },
    });
    
    const journeyCount = await ctx.db.journey.count({
      where: { userId },
    });
    
    return {
      ...profile,
      actualJourneyCount: journeyCount,
      limits: getTierLimits(profile?.tier || "FREE"),
    };
  }),
});

function getTierLimits(tier: string) {
  switch (tier) {
    case "PRO":
      return {
        journeys: Infinity,
        aiGenerations: Infinity,
        exports: Infinity,
        storage: 10000, // 10GB in MB
      };
    case "ENTERPRISE":
      return {
        journeys: Infinity,
        aiGenerations: Infinity,
        exports: Infinity,
        storage: 100000, // 100GB in MB
      };
    default: // FREE
      return {
        journeys: 5,
        aiGenerations: 10,
        exports: 50,
        storage: 100, // 100MB
      };
  }
}
