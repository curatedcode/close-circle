import { describe, expect, it } from "vitest";
import getAnimation from "~/components/Animations";
import {
  FadeInOut,
  SlideDownFromTop,
  SlideInFromRight,
} from "~/components/Animations";

describe("animation function", () => {
  it("should return FadeInOut", () => {
    const animation = getAnimation("FadeInOut");
    expect(animation).toBe(FadeInOut);
  });
  it("should return SlideInFromRight", () => {
    const animation = getAnimation("SlideInFromRight");
    expect(animation).toBe(SlideInFromRight);
  });
  it("should return SlideDownFromTop", () => {
    const animation = getAnimation("SlideDownFromTop");
    expect(animation).toBe(SlideDownFromTop);
  });
});
