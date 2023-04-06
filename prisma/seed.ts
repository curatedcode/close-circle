import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const USERS = 50;

// min/max posts per user
const POSTS_MIN = 1;
const POSTS_MAX = 10;

// min/max likes per post
const LIKE_MIN = 1;
const LIKE_MAX = 15;

// comments per post
const COMMENT_MIN = 2;
const COMMENT_MAX = 20;

// images per post
const IMAGE_MIN = 0;
const IMAGE_MAX = 5;

type Post = {
  userId: string;
  body: string;
  createdAt: Date;
};

type PostLike = {
  postId: string;
  userId: string;
};

type Comment = {
  body: string;
  postId: string;
  userId: string;
  createdAt: Date;
};

type PostImage = {
  url: string;
  postId: string;
};

const userData = Array.from({ length: USERS }).map(() => ({
  name: faker.name.fullName(),
  email: faker.internet.email(),
  image: faker.internet.avatar(),
  bio: faker.lorem.sentence(),
}));

function getRandomPostBody(): string {
  const body = faker.lorem.paragraph(1);
  // posts can't be longer than 280 characters
  if (body.length > 280) return getRandomPostBody();
  return body;
}

function getRandomDate() {
  const today = new Date().toISOString();
  return faker.date.between("2022-01-01T00:00:00.000Z", today);
}

function getRandomCommentBody() {
  // randomly return 3 words or an emoji
  const randomNum = Math.abs(Math.floor(Math.random() * 3));

  if (randomNum > 1) return faker.internet.emoji();
  return faker.lorem.words(3);
}

function getRandomPhotoCategory() {
  const categories = [
    "dog",
    "car",
    "house",
    "paris",
    "brazil",
    "ocean",
    "boat",
    "building",
    "travel",
    "football",
  ];
  const randomNum = Math.abs(Math.floor(Math.random() * 10));

  return categories[randomNum];
}

async function run() {
  // create random users

  await prisma.user.createMany({ data: userData });

  const users = await prisma.user.findMany({ select: { id: true } });

  function getRandomUserId(userIndex: number): string {
    const user = users[userIndex];

    if (!user) return getRandomUserId(userIndex - 1);

    return user.id;
  }

  // create random amount of posts for each user
  const postData: Post[] = [];

  users.forEach((user) => {
    const postAmount = faker.datatype.number({
      min: POSTS_MIN,
      max: POSTS_MAX,
    });

    for (let i = 0; i < postAmount; i++) {
      postData.push({
        userId: user.id,
        body: getRandomPostBody(),
        createdAt: getRandomDate(),
      });
    }
  });

  await prisma.post.createMany({ data: postData });

  const posts = await prisma.post.findMany({ select: { id: true } });

  // create random amount of likes for each post
  const postLikeData: PostLike[] = [];

  posts.forEach((post) => {
    const likeAmount = faker.datatype.number({
      min: LIKE_MIN,
      max: LIKE_MAX,
    });

    for (let i = 0; i < likeAmount; i++) {
      postLikeData.push({
        postId: post.id,
        userId: getRandomUserId(i),
      });
    }
  });

  await prisma.postLike.createMany({ data: postLikeData });

  // create random amount of comments for each post
  const commentData: Comment[] = [];

  posts.forEach((post) => {
    const commentAmount = faker.datatype.number({
      min: COMMENT_MIN,
      max: COMMENT_MAX,
    });

    for (let i = 0; i < commentAmount; i++) {
      commentData.push({
        postId: post.id,
        userId: getRandomUserId(i),
        body: getRandomCommentBody(),
        createdAt: getRandomDate(),
      });
    }
  });

  await prisma.comment.createMany({ data: commentData });

  // create random images for some posts

  const postImageData: PostImage[] = [];

  posts.forEach((post, index) => {
    const imageAmount = faker.datatype.number({
      min: IMAGE_MIN,
      max: IMAGE_MAX,
    });

    // stop every post having an image
    if (index % 2 === 0) {
      for (let i = 0; i < imageAmount; i++) {
        postImageData.push({
          postId: post.id,
          url: faker.image.imageUrl(
            undefined,
            undefined,
            getRandomPhotoCategory(),
            true
          ),
        });
      }
    }
  });

  await prisma.postImage.createMany({ data: postImageData });

  await prisma.$disconnect();
}

run().catch((e) => {
  console.log(e);
  process.exit(1);
});
