/* eslint-disable @next/next/no-img-element */
import type { AvatarProps, Sizes } from "~/utils/customTypes";

function getSize(size: Sizes) {
  switch (size) {
    case "sm":
      return 30;
    case "md":
      return 40;
    case "lg":
      return 50;
    case "xl":
      return 70;
  }
}

export default function UserImage({ src, size = "md", name }: AvatarProps) {
  const dimensions = getSize(size);

  if (!src)
    return (
      <img
        src={"/profile-placeholder.jpg"}
        alt={`${name}'s profile picture`}
        className="rounded-full"
        height={dimensions}
        width={dimensions}
      />
    );

  return (
    <img
      src={src}
      alt={`${name}'s profile picture`}
      className="rounded-full"
      height={dimensions}
      width={dimensions}
      onError={(e) => (e.currentTarget.src = "/profile-placeholder.jpg")}
    />
  );
}
