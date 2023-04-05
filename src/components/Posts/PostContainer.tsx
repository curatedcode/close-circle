import {
  ArrowUpTrayIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ClipboardIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import type { PostContainerProps, PostImage } from "~/utils/customTypes";
import Avatar from "~/components/Avatar";
import getTimeAgo from "../Fn/getTimeAgo";
import Popover from "../Popover";
import { useEffect, useState } from "react";
import Carousel from "../Carousel";
import { env } from "~/env.mjs";

export function PostInteractButton({
  icon,
  label,
  onClick,
  ariaLabel,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hover:bg inline-flex w-full justify-center gap-2 rounded-md px-1 py-1.5 transition-colors hover:bg-web-white hover:dark:bg-web-gray"
      aria-label={ariaLabel}
    >
      {icon}
      <span className="hidden xs:inline-block">{label}</span>
    </button>
  );
}

function ImageSection({
  images,
  isModalActive,
}: {
  images: Array<PostImage> | null;
  isModalActive: boolean;
}) {
  if (!images) return null;

  if (isModalActive) {
    return (
      <div className="mb-3">
        <Carousel
          slides={images}
          options={{}}
          isNavigationVisible={isModalActive}
        />
      </div>
    );
  }

  return (
    <div className="mb-3 overflow-clip rounded-lg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="w-full" src={images[0]?.url} alt="" />
    </div>
  );
}

export default function PostContainer({
  post,
  handleLike,
  setIsModalActive,
  hasLiked,
  isModalActive,
}: PostContainerProps) {
  const { id, body, images, createdAt, user, _count } = post;

  const [isCopyConfirmVisible, setIsCopyConfirmVisible] = useState(false);

  async function copyToClipboard() {
    const postURL = `${env.NEXT_PUBLIC_BASE_URL}/posts/${id}`;
    try {
      await navigator.clipboard.writeText(postURL);
      setIsCopyConfirmVisible(true);
    } catch (error) {
      console.error("Unable to copy text to clipboard");
    }
  }

  useEffect(() => {
    if (isCopyConfirmVisible) {
      setTimeout(() => {
        setIsCopyConfirmVisible(false);
      }, 2000);
    }
  }, [isCopyConfirmVisible]);

  return (
    <div
      className="flex w-full max-w-[42rem] flex-col rounded-md bg-white px-4 pt-3 shadow-md dark:bg-web-gray-light"
      data-testid="post container"
    >
      <div className="inline-flex justify-between">
        <Link
          href={`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/profiles/${
            user.profileId
          }`}
          aria-label={`Visit ${user.name}'s profile`}
        >
          <div className="inline-flex gap-2">
            <Avatar
              src={user.image ?? "profile-placeholder.jpg"}
              name={user.name}
            />
            <div className="grid">
              <span className="text-sm font-medium line-clamp-1">
                {user.name}
              </span>
              <div className="mt-0.5 mr-2 text-xs text-gray-500 opacity-60 dark:text-gray-100">
                · {getTimeAgo(String(createdAt))}
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div
        className="mt-1 flex flex-col"
        onClick={() => setIsModalActive(true)}
      >
        <p
          className="ml-1 mb-2.5 leading-tight line-clamp-6"
          data-testid="post body"
        >
          {body}
        </p>
        <ImageSection images={images} isModalActive={isModalActive} />
      </div>
      <div className="flex justify-between">
        <span
          className="text-xs text-gray-500 opacity-60 dark:text-gray-100"
          data-testid="like count"
        >
          {_count.likes} likes
        </span>
        <span
          className="text-xs text-gray-500 opacity-60 dark:text-gray-100"
          data-testid="comment count"
        >
          {_count.comments} comments
        </span>
      </div>
      <div className="mt-1 border-1 border-web-white dark:border-web-gray"></div>
      <div className="my-1.5 grid grid-cols-3">
        <PostInteractButton
          icon={
            <HandThumbUpIcon
              className={`w-6 ${hasLiked ? "fill-logo-blue" : ""}`}
            />
          }
          label="Like"
          ariaLabel="Like Post"
          onClick={handleLike}
        />
        <PostInteractButton
          icon={<ChatBubbleOvalLeftEllipsisIcon className="w-6" />}
          label="Comment"
          ariaLabel="Comment on Post"
          onClick={() => setIsModalActive(true)}
        />
        <Popover
          trigger={
            <PostInteractButton
              icon={<ArrowUpTrayIcon className="w-6" />}
              label="Share"
              ariaLabel="Share Post"
            />
          }
          offset={{ mainAxis: -2 }}
        >
          <div className="rounded-md bg-white text-base dark:bg-web-gray">
            <button
              type="button"
              onClick={() => void copyToClipboard()}
              className="inline-flex items-center justify-between gap-4 rounded-md py-3 px-6 shadow-sm shadow-black transition-colors hover:bg-web-white hover:dark:bg-web-gray-light"
            >
              <ClipboardIcon className="w-6" />
              Copy link to post
            </button>
          </div>
        </Popover>
        {isCopyConfirmVisible && (
          <div className="fixed left-1/2 bottom-4 z-50 -translate-x-1/2 rounded-md bg-logo-blue px-4 py-2 font-medium text-white shadow-md shadow-gray-600">
            Copied to clipboard
          </div>
        )}
      </div>
    </div>
  );
}
