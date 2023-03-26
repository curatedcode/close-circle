import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Button from "~/components/Button";
import { HomeIcon } from "@heroicons/react/24/outline";
import SkipToContentButton from "~/components/Button/SkipToContentButton";

describe("buttons", () => {
  afterEach(() => cleanup());

  it("should render styled default button", () => {
    render(<Button>test button</Button>);

    const button = screen.getByRole("button", { name: /test button/i });
    expect(button).toBeVisible();

    // expect tailwind classes for styling
    expect(button).toHaveClass(
      "inline-flex h-fit w-fit items-center gap-1 whitespace-nowrap px-4 py-[0.45rem] text-base transition-opacity focus-within:ring-2 focus-within:ring-web-gray hover:opacity-80 focus-within:dark:ring-white rounded-md "
    );
  });

  it("should render styled outline button", () => {
    render(<Button variant="outline">test button</Button>);

    const button = screen.getByRole("button", { name: /test button/i });
    expect(button).toBeVisible();

    // expect tailwind classes for styling
    expect(button).toHaveClass(
      "inline-flex h-fit w-fit items-center gap-1 whitespace-nowrap border-1 border-web-gray bg-transparent px-4 py-[0.45rem] text-base transition-opacity focus-within:ring-2 focus-within:ring-web-gray hover:opacity-80 dark:border-web-white dark:text-white focus-within:dark:ring-white rounded-md "
    );
  });

  it("should render styled filled button", () => {
    render(<Button variant="filled">test button</Button>);

    const button = screen.getByRole("button", { name: /test button/i });
    expect(button).toBeVisible();

    // expect tailwind classes for styling
    expect(button).toHaveClass(
      "inline-flex h-fit w-fit items-center gap-1 whitespace-nowrap bg-logo-blue px-4 py-[0.45rem] text-base text-white transition-opacity focus-within:ring-2 focus-within:ring-web-gray hover:opacity-80 focus-within:dark:ring-white rounded-md "
    );
  });

  it("should render button with icon", () => {
    render(
      <Button icon={<HomeIcon className="w-4" aria-label="home" />}>
        test button
      </Button>
    );

    const button = screen.getByRole("button", { name: /test button/i });
    expect(button).toBeVisible();

    // check for icon
    const icon = screen.getByLabelText("home");
    expect(icon).toBeVisible();
    expect(button.childElementCount).toEqual(1);
    expect(button.children[0]).toBe(icon);
  });

  it("should render skip to content button", () => {
    render(<SkipToContentButton />);

    const button = screen.getByRole("link", { name: /skip to content/i });
    expect(button).toBeInTheDocument();
  });
});
