import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Carousel from "~/components/Carousel";
import { type PostImage } from "~/utils/customTypes";
import setup from "./userSetup";

const slides: PostImage[] = [
  { url: "https://placehold.co/400" },
  { url: "https://placehold.co/400" },
];

describe("carousel", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render Carousel", () => {
    render(
      <Carousel slides={slides} options={{}} isNavigationVisible={true} />
    );

    const carousel = screen.getByLabelText("carousel");
    expect(carousel).toBeVisible();

    // first image of carousel should be visible
    const firstSlide = screen.getByTestId("slide 1");
    expect(firstSlide).toBeVisible();
  });

  it("navigation should be hidden until carousel focus", async () => {
    const { user } = setup(
      <Carousel slides={slides} options={{}} isNavigationVisible={true} />
    );

    const navContainer = screen.getByTestId("navContainer");

    // navigation should be hidden without focus/hover
    expect(navContainer).not.toBeVisible();

    // focus into carousel
    await user.tab();

    // navigation should now be visible
    expect(navContainer).toBeVisible();
  });

  it("respective nav button should be disabled & hidden if no prev or next slide", async () => {
    const { user } = setup(
      <Carousel slides={slides} options={{}} isNavigationVisible={true} />
    );

    await user.tab();

    const nextSlideButton = screen.getByRole("button", { name: /next slide/i });
    expect(nextSlideButton).toBeVisible();

    await user.click(nextSlideButton);

    expect(nextSlideButton).not.toBeVisible();

    const prevSlideButton = screen.getByRole("button", {
      name: /previous slide/i,
    });
    expect(prevSlideButton).toBeVisible();
  });

  it("should be able to change slides with buttons", async () => {
    const { user } = setup(
      <Carousel slides={slides} options={{}} isNavigationVisible={true} />
    );

    await user.tab();

    const nextSlideButton = screen.getByRole("button", { name: /next slide/i });

    const slideOne = screen.getByTestId("slide 1");
    expect(slideOne).toBeInTheDocument();

    const slideTwo = screen.getByTestId("slide 2");
    expect(slideTwo).toBeInTheDocument();

    await user.click(nextSlideButton);

    // first slide should be out of view
    expect(slideOne).toHaveAttribute("data-inviewport", "false");

    // second slide should be in view
    expect(slideTwo).toHaveAttribute("data-inviewport", "true");

    const prevSlideButton = screen.getByRole("button", {
      name: /previous slide/i,
    });
    await user.click(prevSlideButton);

    // second slide should be out of view
    expect(slideTwo).toHaveAttribute("data-inviewport", "false");

    // first slide should be back in view
    expect(slideOne).toHaveAttribute("data-inviewport", "true");
  });

  it("should be able to change slide with arrow keys", async () => {
    const { user } = setup(
      <Carousel slides={slides} options={{}} isNavigationVisible={true} />
    );

    await user.tab();

    const slideOne = screen.getByTestId("slide 1");
    expect(slideOne).toHaveAttribute("data-inviewport", "true");

    await user.keyboard("{ArrowRight}");

    // slide 2 should be in viewport after right arrow keypress
    const slideTwo = screen.getByTestId("slide 2");
    expect(slideTwo).toHaveAttribute("data-inviewport", "true");

    await user.keyboard("{ArrowLeft}");

    // slide 1 should be in viewport after left arrow keypress
    expect(slideOne).toHaveAttribute("data-inviewport", "true");
  });
});
