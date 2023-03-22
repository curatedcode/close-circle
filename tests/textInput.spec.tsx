import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import TextInput from "~/components/Inputs/TextInput";

describe("buttons", () => {
  afterEach(() => cleanup());

  it("should render styled default input", () => {
    render(<TextInput />);

    const input = screen.getByTestId("textInput");
    expect(input).toBeVisible();

    // expect tailwind classes for styling
    expect(input).toHaveClass(
      "inline-flex h-fit w-fit cursor-text bg-web-white px-4 py-[0.45rem] text-base focus-within:ring-2 focus-within:ring-web-gray dark:bg-web-gray focus-within:dark:ring-white rounded-md "
    );
  });

  it("should render styled outline input", () => {
    render(<TextInput variant="outline" />);

    const input = screen.getByTestId("textInput");
    expect(input).toBeVisible();

    // expect tailwind classes for styling
    expect(input).toHaveClass(
      "inline-flex h-fit w-fit cursor-text bg-transparent px-4 py-[0.45rem] text-base ring-2 ring-inset ring-web-white focus-within:ring-2 focus-within:ring-web-gray dark:ring-web-gray focus-within:dark:ring-white rounded-md "
    );
  });

  it("should render styled filled input", () => {
    render(<TextInput variant="filled" />);

    const input = screen.getByTestId("textInput");
    expect(input).toBeVisible();

    // expect tailwind classes for styling
    expect(input).toHaveClass(
      "inline-flex h-fit w-fit cursor-text bg-logo-blue px-4 py-[0.45rem] text-base text-black focus-within:ring-2 focus-within:ring-web-gray focus-within:dark:ring-white rounded-md "
    );
  });

  it("should render input with icon", () => {
    render(
      <TextInput
        icon={<MagnifyingGlassIcon className="w-4" aria-label="search" />}
      />
    );

    const input = screen.getByTestId("textInput");
    expect(input).toBeVisible();

    // check for icon
    const icon = screen.getByLabelText("search");
    expect(icon).toBeVisible();
    expect(input.childElementCount).toEqual(2);
    expect(input.children[0]).toBe(icon);
  });
});
