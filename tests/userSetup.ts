import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { JSXElementConstructor, ReactElement } from "react";

export default function setup(
  jsx: ReactElement<any, string | JSXElementConstructor<any>>
) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}
