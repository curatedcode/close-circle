import { type SearchUsers } from "~/utils/customTypes";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

export const profile = createTRPCRouter({
  getProfileId: publicProcedure
    .input(
      z.object({
        where: z.object({
          id: z.string(),
        }),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { where } = input;

      if (!session) return null;

      const profileId = await prisma.user.findUnique({
        where,
        select: {
          profileId: true,
        },
      });

      return profileId;
    }),
  get: publicProcedure
    .input(
      z.object({
        where: z.object({
          user: z.object({
            profileId: z.string(),
          }),
        }),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { where } = input;
      const profileId = where.user.profileId;

      if (session) {
        const user = await prisma.user.findUnique({
          where: {
            profileId,
          },
          select: {
            name: true,
            image: true,
            bio: true,
            id: true,
          },
        });
        if (!user) return;

        const friendsData = await prisma.friends.findUnique({
          where: {
            friendId_userId: {
              userId: session.user.id,
              friendId: user.id,
            },
          },
        });
        // strip id from user data for secrecy
        const profileData = {
          name: user.name,
          image: user.image,
          bio: user.bio,
        };

        // if data is null then no friendship exists
        const areFriends = friendsData === null ? false : true;
        return {
          profileData,
          areFriends,
        };
      }

      const profileData = await prisma.user.findUnique({
        where: {
          profileId,
        },
        select: {
          name: true,
          image: true,
          bio: true,
        },
      });
      return {
        profileData,
        areFriends: null,
      };
    }),
  search: publicProcedure
    .input(
      z.object({
        where: z.object({ name: z.string() }),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { where } = input;

      const users: SearchUsers =
        await prisma.$queryRaw`SELECT name, image, profileId FROM User WHERE name LIKE ${`%${where.name}%`}`;

      return { users };
    }),
  addFriend: protectedProcedure
    .input(
      z.object({
        friendId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { friendId } = input;
      const userId = session.user.id;

      const friend = await prisma.user.findUnique({
        where: {
          profileId: friendId,
        },
      });

      if (!friend) return;

      return prisma.friends.create({
        data: {
          friendId: friend.id,
          userId,
        },
      });
    }),
  removeFriend: protectedProcedure
    .input(
      z.object({
        friendId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { friendId } = input;
      const userId = session.user.id;

      const friend = await prisma.user.findUnique({
        where: {
          profileId: friendId,
        },
      });

      if (!friend) return;

      return prisma.friends.delete({
        where: {
          friendId_userId: {
            friendId: friend.id,
            userId,
          },
        },
      });
    }),

  updateBio: protectedProcedure
    .input(
      z.object({
        bio: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { bio } = input;
      const userId = session.user.id;

      await prisma.user.update({
        data: {
          bio,
        },
        where: {
          id: userId,
        },
      });

      return;
    }),
});
