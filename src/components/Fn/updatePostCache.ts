import { type InfiniteData } from "@tanstack/react-query";
import { type RouterOutputs } from "~/utils/api";
import { type UpdatePostCacheProps } from "~/utils/customTypes";

export default function updatePostCache({
  client,
  variables,
  data,
  action,
  input,
}: UpdatePostCacheProps) {
  client.setQueryData(
    [
      ["post", "infinite"],
      {
        input,
        type: "infinite",
      },
    ],
    (oldData) => {
      const newData = oldData as InfiniteData<
        RouterOutputs["post"]["infinite"]
      >;
      const value = action === "like" ? 1 : -1;
      const newPosts = newData.pages.map((page) => {
        return {
          posts: page.posts.map((post) => {
            if (post.id === variables.postId) {
              return {
                ...post,
                likes: action === "like" ? [data.userId] : [],
                _count: {
                  likes: post._count.likes + value,
                  comments: post._count.comments,
                },
              };
            }
            return post;
          }),
        };
      });
      return {
        ...newData,
        pages: newPosts,
      };
    }
  );
}
