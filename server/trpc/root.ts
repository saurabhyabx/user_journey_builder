import { router } from "./init";
import { interviewRouter } from "./routers/interview";
import { journeyRouter } from "./routers/journey";
import { aiRouter } from "./routers/ai";
import { userRouter } from "./routers/user";

export const appRouter = router({
  interview: interviewRouter,
  journey: journeyRouter,
  ai: aiRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
