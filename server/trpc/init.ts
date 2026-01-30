import { initTRPC, TRPCError } from "@trpc/server";
import { db } from "@/lib/db";
import { headers } from "next/headers";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db,
    headers: opts.headers,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure - requires authentication
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  // TODO: Implement session check with Better Auth
  // For now, return error
  throw new TRPCError({
    code: "UNAUTHORIZED",
    message: "You must be logged in to access this resource",
  });
  
  return next({
    ctx: {
      ...ctx,
      // user: session.user,
    },
  });
});
