import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  offset as offsetFunc,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  useTransitionStyles,
} from "@floating-ui/react";
import { useState } from "react";
import type { PopoverProps } from "~/utils/customTypes";
import getAnimation from "../Animations";

export default function Popover({
  trigger,
  children,
  offset = 10,
  placement = "bottom",
  className,
  animation = "FadeInOut",
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { x, y, strategy, refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offsetFunc(offset), flip(), shift()],
    whileElementsMounted: autoUpdate,
    placement: placement,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const { isMounted, styles } = useTransitionStyles(
    context,
    getAnimation(animation)
  );

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={className?.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Show popover"
      >
        {trigger}
      </div>
      {isMounted && (
        <FloatingFocusManager context={context}>
          <div
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              ...styles,
            }}
            onClick={() => setIsOpen((prev) => !prev)}
            {...getFloatingProps()}
            className={`absolute w-max select-none rounded-md py-2 px-3 text-lg text-black dark:text-white ${
              className?.children || ""
            }`}
          >
            {children}
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
}
