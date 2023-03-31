import type { UseTransitionStylesProps } from "@floating-ui/react";
import type { FloatingAnimations } from "~/utils/customTypes";

export const SlideInFromRight: UseTransitionStylesProps = {
  duration: 150,
  initial: {
    opacity: 0,
    transform: "translateX(100%)",
    left: "-100%",
  },
  open: {
    opacity: 1,
    transform: "translateX(0%)",
  },
  close: {
    opacity: 0,
    transform: "translateX(100%)",
  },
};

export const SlideDownFromTop: UseTransitionStylesProps = {
  duration: 150,
  initial: {
    opacity: 0,
    transform: "translateY(100%)",
    top: "-100%",
  },
  open: {
    opacity: 1,
    transform: "translateY(0%)",
  },
  close: {
    opacity: 0,
    transform: "translateY(100%)",
  },
};

export const FadeInOut: UseTransitionStylesProps = {
  duration: 150,
  initial: {
    opacity: 0,
  },
  common: {
    opacity: 1,
  },
};

export default function getAnimation(type: FloatingAnimations) {
  switch (type) {
    case "FadeInOut":
      return FadeInOut;
    case "SlideDownFromTop":
      return SlideDownFromTop;
    case "SlideInFromRight":
      return SlideInFromRight;
    default:
      return FadeInOut;
  }
}
