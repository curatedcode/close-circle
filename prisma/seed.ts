import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const USERS_TO_CREATE = 20;

// posts per user
const USER_POSTS_MIN = 1;
const USER_POSTS_MAX = 10;

// likes per post
const POST_LIKE_MIN = 1;
const POST_LIKE_MAX = 5;

// comments per post
const COMMENT_MIN = 2;
const COMMENT_MAX = 20;

// images per post
const POST_IMAGE_MIN = 0;
const POST_IMAGE_MAX = 5;

type Id = {
  connect: {
    id: string;
  };
};

type Post = {
  user: Id;
  body: string;
  createdAt: Date;
};

type PostLike = {
  post: Id;
  user: Id;
};

type Comment = {
  body: string;
  post: Id;
  user: Id;
  createdAt: Date;
};

type PostImage = {
  url: string;
  post: Id;
};

async function run() {
  const userData = Array(USERS_TO_CREATE)
    .fill(null)
    .map(() => {
      return {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        image: faker.image.avatar(),
        bio: faker.lorem.sentence(),
      };
    });

  const createUsers = userData.map((user) =>
    prisma.user.create({ data: user })
  );
  const users = await prisma.$transaction(createUsers);

  const postsArr: Post[] = [];

  users.forEach((user) => {
    const postAmount = faker.datatype.number({
      min: USER_POSTS_MIN,
      max: USER_POSTS_MAX,
    });

    for (let b = 0; b < postAmount; b++) {
      const date = faker.date.between(
        "2023-01-01T00:00:00.000Z",
        "2023-03-023T00:00:00.000Z"
      );
      postsArr.push({
        user: {
          connect: {
            id: user.id,
          },
        },
        body: faker.lorem.paragraph(1),
        createdAt: date,
      });
    }
  });

  const createPosts = postsArr.map((post) =>
    prisma.post.create({ data: post })
  );
  const posts = await prisma.$transaction(createPosts);

  const postLikesArr: PostLike[] = [];
  const commentsArr: Comment[] = [];
  const postImagesArr: PostImage[] = [];

  posts.forEach((post) => {
    const likeAmount = faker.datatype.number({
      min: POST_LIKE_MIN,
      max: POST_LIKE_MAX,
    });
    for (let b = 0; b < likeAmount; b++) {
      const user = users[b] ? users[b]?.id : users[0]?.id;
      postLikesArr.push({
        post: {
          connect: {
            id: post.id,
          },
        },
        user: {
          connect: {
            id: user ?? "",
          },
        },
      });
    }

    const commentAmount = faker.datatype.number({
      min: COMMENT_MIN,
      max: COMMENT_MAX,
    });
    // alternate between emojis and words
    function randomBody() {
      const randomNum = Math.abs(Math.floor(Math.random() * 2));

      if (randomNum > 1) return faker.internet.emoji();
      return faker.lorem.words(3);
    }

    for (let b = 0; b < commentAmount; b++) {
      const user = users[b] ? users[b]?.id : users[0]?.id;
      const date = faker.date.between(
        "2022-05-01T00:00:00.000Z",
        "2023-03-016T00:00:00.000Z"
      );
      commentsArr.push({
        body: randomBody(),
        post: {
          connect: {
            id: post.id,
          },
        },
        user: {
          connect: {
            id: user ?? "",
          },
        },
        createdAt: date,
      });
    }

    function getRandomPostId(max: number): string | void {
      const randomNum = Math.abs(Math.floor(Math.random() * (max - 1)));

      if (posts[randomNum]?.id) return posts[randomNum]?.id ?? "";

      return getRandomPostId(max);
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

    const postImageAmount = faker.datatype.number({
      min: POST_IMAGE_MIN,
      max: POST_IMAGE_MAX,
    });
    for (let b = 0; b < postImageAmount; b++) {
      postImagesArr.push({
        url: faker.image.imageUrl(
          undefined,
          undefined,
          getRandomPhotoCategory(),
          true
        ),
        post: {
          connect: {
            // assign images randomly
            id: getRandomPostId(200) ?? "",
          },
        },
      });
    }
  });

  const createPostLikes = postLikesArr.map((like) =>
    prisma.postLike.create({ data: like })
  );
  await prisma.$transaction(createPostLikes);

  const createComments = commentsArr.map((comment) =>
    prisma.comment.create({ data: comment })
  );
  await prisma.$transaction(createComments);

  const createPostImage = postImagesArr.map((img) =>
    prisma.postImage.create({ data: img })
  );
  await prisma.$transaction(createPostImage);
  await prisma.$disconnect();
}

void run();
