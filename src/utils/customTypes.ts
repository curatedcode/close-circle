import { type Placement } from "@floating-ui/react";
import { type QueryClient } from "@tanstack/react-query";
import { type EmblaOptionsType } from "embla-carousel-react";
import { type Dispatch, type SetStateAction } from "react";
import { type RouterOutputs, type RouterInputs } from "./api";

export declare type SearchUsers = {
  name: string;
  profileId: string;
  image: string | null;
}[];

export declare type UpdatePostCacheProps = {
  client: QueryClient;
  variables: {
    postId: string;
  };
  data: {
    userId: string;
  };
  action: "like" | "unlike";
  input: RouterInputs["post"]["infinite"];
};

export declare type UpdateCommentCacheProps = {
  client: QueryClient;
  variables: {
    postId: string;
  };
  input: RouterInputs["post"]["infinite"];
};

export declare type UserInfo = {
  name: string;
  image: string | null;
  profileId: string;
};

export declare type Post = {
  id: string;
  user: UserInfo;
  body: string | null;
  images: Array<PostImage> | null;
  createdAt: Date;
  _count: {
    likes: number;
    comments: number;
  };
};

export declare type PostProps = {
  client: QueryClient;
  input: RouterInputs["post"]["infinite"];
  postRouter: RouterOutputs["post"]["infinite"]["posts"][number];
};

export declare interface PostContainerProps extends FloatingOptions {
  post: Post;
  handleLike: () => void;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
  hasLiked: boolean;
  isModalActive: boolean;
  where?: RouterInputs["comment"]["get"]["where"];
}

export declare interface PostModalProps extends PostContainerProps {
  apiProps: PostProps;
}

export declare type PostCommentProps = {
  user: UserInfo;
  body: string;
  createdAt: Date;
};

export declare type PostImage = {
  url: string;
};

export declare type Variants = "filled" | "outline" | "default";
export declare type BorderRadii =
  | "none"
  | "sm"
  | "reg"
  | "md"
  | "lg"
  | "xl"
  | "full";

export declare type InteractiveElement = {
  variant?: Variants;
  icon?: React.ReactNode;
  radius?: BorderRadii;
};

export declare interface ButtonProps
  extends React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    InteractiveElement {}

export declare type LayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export declare interface TextInputProps
  extends React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    InteractiveElement {}

export declare type OffsetValue =
  | number
  | {
      mainAxis?: number;
      crossAxis?: number;
      alignmentAxis?: number | null;
    };

export declare type FloatingOptions = {
  children?: React.ReactNode;
  offset?: OffsetValue;
  placement?: Placement;
  delay?: number | Partial<{ open: number; close: number }>;
  animation?: FloatingAnimations;
};

export declare interface TooltipProps extends FloatingOptions {
  label: string;
  arrow?: boolean;
  className?: string;
}

export declare interface PopoverProps extends FloatingOptions {
  trigger: React.ReactNode;
  className?: Partial<{ trigger: string; children: string }>;
}

export declare type FloatingAnimations =
  | "SlideInFromRight"
  | "SlideDownFromTop"
  | "FadeInOut";

export declare type Sizes = "sm" | "md" | "lg" | "xl";

export declare type AvatarProps = {
  src: string | null;
  name: string;
  size?: Sizes;
};

export declare type CarouselProps = {
  slides: PostImage[];
  options: EmblaOptionsType;
  isNavigationVisible?: boolean;
};

export declare type CarouselButtonProps = {
  isActive: boolean;
  onClick: () => void;
};
