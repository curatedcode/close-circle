import { createTRPCRouter } from "~/server/api/trpc";
import { post } from "./routers/post";
import { profile } from "./routers/profile";
import { comment } from "./routers/comment";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post,
  profile,
  comment,
});

// export type definition of API
export type AppRouter = typeof appRouter;
