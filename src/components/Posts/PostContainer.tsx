/* eslint-disable @next/next/no-img-element */
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
  images: Array<PostImage>;
  isModalActive: boolean;
}) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

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

  if (!images[0]) return <></>;

  return (
    <div className="rounded-lg">
      <img
        className="w-full rounded-lg"
        src={images[0].url}
        alt=""
        onLoad={() => setIsImageLoaded(true)}
        hidden={!isImageLoaded}
      />
      <div hidden={isImageLoaded}>
        <img
          className="w-full"
          src="/blur-placeholder.png"
          alt="placeholder image"
        />
      </div>
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
              <div className="mr-2 mt-0.5 text-xs text-gray-500 opacity-60 dark:text-gray-100">
                · {getTimeAgo(String(createdAt))}
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div
        className="mb-3 mt-1 flex flex-col gap-2"
        onClick={() => setIsModalActive(true)}
      >
        <p className="leading-tight line-clamp-6" data-testid="post body">
          {body}
        </p>
        {images && images.length > 0 && (
          <ImageSection images={images} isModalActive={isModalActive} />
        )}
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
              className="inline-flex items-center justify-between gap-4 rounded-md px-6 py-3 shadow-sm shadow-black transition-colors hover:bg-web-white hover:dark:bg-web-gray-light"
            >
              <ClipboardIcon className="w-6" />
              Copy link to post
            </button>
          </div>
        </Popover>
        {isCopyConfirmVisible && (
          <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-md bg-logo-blue px-4 py-2 font-medium text-white shadow-md shadow-gray-600">
            Copied to clipboard
          </div>
        )}
      </div>
    </div>
  );
}
