import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import type { PostProps } from "~/utils/customTypes";
import updatePostCache from "../Fn/updatePostCache";
import PostContainer from "./PostContainer";
import PostModal from "./PostModal";

export default function Post({ client, input, postRouter }: PostProps) {
  const [isModalActive, setIsModalActive] = useState(false);

  const likeMutation = api.post.like.useMutation({
    onSuccess: (data, variables) => {
      updatePostCache({ client, data, variables, action: "like", input });
    },
  }).mutateAsync;

  const unlikeMutation = api.post.unlike.useMutation({
    onSuccess: (data, variables) => {
      updatePostCache({
        client,
        data,
        variables,
        action: "unlike",
        input,
      });
    },
  }).mutateAsync;

  // the only like in this array is from the current signed in user
  const hasLiked = postRouter.likes.length > 0;
  function handleLike() {
    if (hasLiked) {
      return void unlikeMutation({ postId: postRouter.id });
    }
    return void likeMutation({ postId: postRouter.id });
  }

  useEffect(() => {
    // stop scrolling ability when modal is open
    if (isModalActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isModalActive]);

  return (
    <>
      <PostContainer
        post={postRouter}
        handleLike={handleLike}
        setIsModalActive={setIsModalActive}
        hasLiked={hasLiked}
        isModalActive={isModalActive}
      />
      {isModalActive && (
        <PostModal
          apiProps={{ client, postRouter, input }}
          post={postRouter}
          handleLike={handleLike}
          setIsModalActive={setIsModalActive}
          hasLiked={hasLiked}
          isModalActive={isModalActive}
        />
      )}
    </>
  );
}
