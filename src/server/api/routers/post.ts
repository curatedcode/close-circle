import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import cuid2 from "@paralleldrive/cuid2";
import { S3 } from "aws-sdk";
import { env } from "~/env.mjs";

export const post = createTRPCRouter({
  getOne: publicProcedure
    .input(
      z.object({
        where: z.object({ id: z.string() }),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { where } = input;

      let userId: string | undefined = "";

      if (session?.user.id) {
        userId = session.user.id;
      }

      const post = await prisma.post.findUnique({
        where,
        include: {
          likes: {
            where: {
              userId,
            },
          },
          user: {
            select: {
              name: true,
              profileId: true,
              image: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
          images: true,
        },
      });

      return { post };
    }),
  infinite: publicProcedure
    .input(
      z.object({
        where: z
          .object({
            user: z
              .object({
                profileId: z.string().optional(),
              })
              .optional(),
          })
          .optional()
          .optional(),
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(6).default(3),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { cursor, limit, where } = input;
      let userId: string | undefined = "";

      if (session?.user.id) {
        userId = session.user.id;
      }

      const posts = await prisma.post.findMany({
        take: limit + 1,
        where,
        orderBy: [{ createdAt: "desc" }],
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          likes: {
            where: {
              userId,
            },
          },
          user: {
            select: {
              name: true,
              profileId: true,
              image: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
          images: true,
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;

      if (posts.length > limit) {
        const nextItem = posts.pop() as (typeof posts)[number];
        nextCursor = nextItem.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),

  like: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { prisma } = ctx;

      return prisma.postLike.create({
        data: {
          post: {
            connect: {
              id: input.postId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),

  unlike: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return ctx.prisma.postLike.delete({
        where: {
          postId_userId: {
            postId: input.postId,
            userId,
          },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        body: z.string().optional(),
        imageUrls: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { body, imageUrls } = input;
      const userId = session.user.id;
      const postId = cuid2.createId();

      await prisma.post.create({
        data: {
          id: postId,
          body,
          userId,
        },
      });

      if (!imageUrls) return;

      for (let i = 0; i < imageUrls.length; i++) {
        const url = imageUrls[i];
        if (!url) return;

        await prisma.postImage.create({
          data: {
            postId,
            url,
          },
        });
      }
    }),

  getPresignedUrls: protectedProcedure
    .input(
      z.object({
        toCreate: z.number().min(1).max(5),
      })
    )
    .mutation(async ({ input }) => {
      const { toCreate } = input;

      const s3 = new S3({
        signatureVersion: "v4",
      });

      const s3Urls: string[] = [];
      for (let i = 0; i < toCreate; i++) {
        const params = {
          Bucket: env.AWS_BUCKET_NAME,
          Key: cuid2.createId(),
          Expires: 30,
        };
        const url = await s3.getSignedUrlPromise("putObject", params);
        s3Urls.push(url);
      }
      console.log(s3Urls);
      return s3Urls;
    }),
});
