import Link from "next/link";
import { type PostCommentProps } from "~/utils/customTypes";
import Avatar from "../Avatar";
import getTimeAgo from "../Fn/getTimeAgo";

export default function PostComment({
  comment,
}: {
  comment: PostCommentProps;
}) {
  const { user, body, createdAt } = comment;

  return (
    <div
      className="flex w-full flex-col rounded-md bg-white p-3 dark:bg-web-gray-light"
      data-testid="comment"
    >
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
          <div className="mt-1 flex h-fit flex-col items-center xs:flex-row xs:gap-2">
            <span className="text-sm font-medium line-clamp-1">
              {user.name}
            </span>
            <span className="mt-0.5 mr-2 whitespace-nowrap text-xs text-gray-500 opacity-60 dark:text-gray-100">
              · {getTimeAgo(String(createdAt))}
            </span>
          </div>
        </div>
      </Link>
      <p className="px-12 xs:-mt-3" data-testid="comment body">
        {body}
      </p>
    </div>
  );
}
