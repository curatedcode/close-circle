import { type InfiniteData } from "@tanstack/react-query";
import { type RouterOutputs } from "~/utils/api";
import { type UpdateCommentCacheProps } from "~/utils/customTypes";

export default function updateCommentCache({
  client,
  variables,
  input,
}: UpdateCommentCacheProps) {
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
      const newPosts = newData.pages.map((page) => {
        return {
          posts: page.posts.map((post) => {
            if (post.id === variables.postId) {
              return {
                ...post,
                _count: {
                  comments: post._count.comments + 1,
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
