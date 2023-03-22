import { useRef } from "react";
import type { TextInputProps } from "~/utils/customTypes";

export default function TextInput({
  variant,
  icon,
  radius = "md",
  width = "full",
  className = "",
  ...props
}: TextInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFocus() {
    inputRef.current?.focus();
  }
  function handleBlur() {
    inputRef.current?.blur();
  }

  switch (variant) {
    case "filled":
      return (
        <div
          className={`inline-flex h-fit w-fit cursor-text bg-logo-blue px-4 py-[0.45rem] text-base text-black focus-within:ring-2 focus-within:ring-web-gray focus-within:dark:ring-white rounded-${radius} ${className}`}
          onClick={handleFocus}
          onBlur={handleBlur}
          data-testid="textInput"
        >
          {icon}
          <input
            type="text"
            className="bg-transparent pl-2 placeholder:text-black placeholder:text-opacity-60 focus:outline-none"
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{ width }}
            ref={inputRef}
            {...props}
          />
        </div>
      );
    case "outline":
      return (
        <div
          className={`inline-flex h-fit w-fit cursor-text bg-transparent px-4 py-[0.45rem] text-base ring-2 ring-inset ring-web-white focus-within:ring-2 focus-within:ring-web-gray dark:ring-web-gray focus-within:dark:ring-white rounded-${radius} ${className}`}
          onClick={handleFocus}
          onBlur={handleBlur}
          data-testid="textInput"
        >
          {icon}
          <input
            type="text"
            className="bg-transparent pl-2 focus:outline-none"
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{ width }}
            ref={inputRef}
            {...props}
          />
        </div>
      );
    default:
      return (
        <div
          className={`inline-flex h-fit w-fit cursor-text bg-web-white px-4 py-[0.45rem] text-base focus-within:ring-2 focus-within:ring-web-gray dark:bg-web-gray focus-within:dark:ring-white rounded-${radius} ${className}`}
          onClick={handleFocus}
          onBlur={handleBlur}
          data-testid="textInput"
        >
          {icon}
          <input
            type="text"
            className="bg-transparent pl-2 focus:outline-none"
            style={{ width }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            ref={inputRef}
            {...props}
          />
        </div>
      );
  }
}
