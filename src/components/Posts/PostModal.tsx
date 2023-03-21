import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { api } from "~/utils/api";
import type { PostModalProps } from "~/utils/customTypes";
import PostComment from "./PostComment";
import PostContainer from "./PostContainer";
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  offset as offsetFunc,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  useTransitionStyles,
} from "@floating-ui/react";
import getAnimation from "../Animations/animations";
import { type FormEvent, useState } from "react";
import TextInput from "../Inputs/TextInput";
import Button from "../Button";
import { useSession } from "next-auth/react";
import updateCommentCache from "../Fn/updateCommentCache";

export default function PostModal({
  post,
  handleLike,
  setIsModalActive,
  hasLiked,
  isModalActive,
  where = { postId: post.id },
  offset = 10,
  placement = "bottom",
  animation = "FadeInOut",
  apiProps,
}: PostModalProps) {
  const { data } = api.comment.get.useQuery({
    where,
  });

  const { client, input, postRouter } = apiProps;

  const { refs, context } = useFloating({
    open: isModalActive,
    onOpenChange: setIsModalActive,
    middleware: [offsetFunc(offset), flip(), shift()],
    whileElementsMounted: autoUpdate,
    placement: placement,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getFloatingProps } = useInteractions([click, dismiss, role]);

  const { styles } = useTransitionStyles(context, getAnimation(animation));

  const comments = data?.comments ?? [];

  const [commentBody, setCommentBody] = useState("");

  const addComment = api.comment.add.useMutation({
    onSuccess: async () => {
      updateCommentCache({
        client: client,
        input: input,
        variables: { postId: postRouter.id },
      });
      await client.invalidateQueries([["comment", "get"]]);
    },
  });

  async function postComment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await addComment.mutateAsync({
        postId: post.id,
        body: commentBody,
      });
      setCommentBody("");
    } catch (err) {
      console.log("unable to post comment");
    }
  }

  const { status } = useSession();

  return (
    <div className="fixed top-0 left-0 z-20 h-screen w-screen overflow-hidden bg-black bg-opacity-80 py-6">
      <FloatingFocusManager context={context}>
        <div
          className="absolute left-1/2 z-30 flex h-[95%] w-full max-w-[42rem] -translate-x-1/2 flex-col items-end overflow-y-auto rounded-md bg-web-white dark:bg-web-gray"
          ref={refs.setFloating}
          style={{
            ...styles,
          }}
          {...getFloatingProps()}
        >
          <div className="-mb-1 inline-flex w-full justify-end bg-white dark:bg-web-gray-light">
            <button
              type="button"
              aria-label="Close"
              className="m-1.5 mr-1.5 rounded-full bg-web-white p-1 transition-opacity hover:opacity-80 dark:bg-web-gray"
              onClick={() => setIsModalActive(false)}
            >
              <XMarkIcon className="h-6" />
            </button>
          </div>
          <PostContainer
            post={post}
            handleLike={handleLike}
            setIsModalActive={setIsModalActive}
            hasLiked={hasLiked}
            isModalActive={isModalActive}
          />
          <div className="flex w-full flex-col gap-4 overflow-visible px-6 py-4 dark:bg-web-gray">
            {status === "authenticated" && (
              <form
                onSubmit={(e) => void postComment(e)}
                className="mb-6 inline-flex w-full gap-2"
              >
                <fieldset disabled={addComment.isLoading} className="w-full">
                  <label htmlFor="comment" className="sr-only">
                    Comment
                  </label>
                  <TextInput
                    variant="outline"
                    id="comment"
                    className="w-full bg-white py-2 focus-within:ring-black dark:bg-web-gray-light dark:focus-within:ring-white"
                    placeholder="Write a comment..."
                    onChange={(e) => setCommentBody(e.currentTarget.value)}
                    width="100%"
                    value={commentBody}
                  />
                </fieldset>
                <Button
                  type="submit"
                  variant="filled"
                  className="inline-flex h-min items-center"
                  aria-label="publish comment"
                >
                  <PaperAirplaneIcon className="w-6" />
                </Button>
              </form>
            )}
            {comments.map((comment) => (
              <PostComment comment={comment} key={crypto.randomUUID()} />
            ))}
          </div>
        </div>
      </FloatingFocusManager>
    </div>
  );
}
