import type { ButtonProps } from "~/utils/customTypes";

export default function Button({
  variant = "default",
  icon,
  radius = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  switch (variant) {
    case "filled":
      return (
        <button
          className={`inline-flex h-fit w-fit items-center gap-1 whitespace-nowrap bg-logo-blue px-4 py-[0.45rem] text-base text-white transition-opacity focus-within:ring-2 focus-within:ring-web-gray hover:opacity-80 focus-within:dark:ring-white rounded-${radius} ${className}`}
          {...props}
        >
          {icon}
          {children}
        </button>
      );
    case "outline":
      return (
        <button
          className={`inline-flex h-fit w-fit items-center gap-1 whitespace-nowrap border-1 border-web-gray bg-transparent px-4 py-[0.45rem] text-base transition-opacity focus-within:ring-2 focus-within:ring-web-gray hover:opacity-80 dark:border-web-white dark:text-white focus-within:dark:ring-white rounded-${radius} ${className}`}
          {...props}
        >
          {icon}
          {children}
        </button>
      );
    default:
      return (
        <button
          className={`inline-flex h-fit w-fit items-center gap-1 whitespace-nowrap px-4 py-[0.45rem] text-base transition-opacity focus-within:ring-2 focus-within:ring-web-gray hover:opacity-80 focus-within:dark:ring-white rounded-${radius} ${className}`}
          {...props}
        >
          {icon}
          {children}
        </button>
      );
  }
}
