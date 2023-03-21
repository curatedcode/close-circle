import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

export const comment = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        where: z
          .object({
            postId: z.string(),
          })
          .optional()
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { where } = input;

      const comments = await prisma.comment.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        include: {
          user: {
            select: {
              name: true,
              profileId: true,
              image: true,
            },
          },
        },
      });

      return { comments };
    }),
  add: protectedProcedure
    .input(z.object({ postId: z.string(), body: z.string().min(1).max(280) }))
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { postId, body } = input;
      const userId = session.user.id;

      await prisma.comment.create({
        data: {
          body,
          postId,
          userId,
        },
      });
      return "posted";
    }),
});
