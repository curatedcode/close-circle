import {
  useFloating,
  offset as offsetFunc,
  arrow as arrowFunc,
  autoUpdate,
  FloatingArrow,
  useTransitionStyles,
  useHover,
  useInteractions,
  flip,
  shift,
  useFocus,
  useDismiss,
  useRole,
  useDelayGroupContext,
  useId,
  useDelayGroup,
} from "@floating-ui/react";
import { useRef, useState } from "react";
import type { TooltipProps } from "~/utils/customTypes";

/**
 * Need to put children styles in className to prevent styling issues
 */
export default function Tooltip({
  children,
  label,
  offset = 10,
  placement = "bottom",
  arrow = false,
  className,
  delay = 150,
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { delay: groupDelay } = useDelayGroupContext();
  const id = useId();

  const currentDelay = groupDelay === 0 ? delay : groupDelay;

  const arrowRef = useRef(null);

  const { x, y, strategy, refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offsetFunc(offset),
      arrowFunc({ element: arrowRef }),
      flip(),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
    placement: placement,
  });

  const hover = useHover(context, { delay: currentDelay });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  const { styles } = useTransitionStyles(context, {
    initial: {
      opacity: 0,
      transitionProperty: "opacity",
    },
  });

  useDelayGroup(context, { id });

  return (
    <div>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={className}
      >
        {children}
      </div>
      {isOpen && (
        <div
          ref={refs.setFloating}
          className="absolute w-max select-none rounded-md bg-web-gray-light py-2 px-3 text-sm text-white dark:bg-web-white dark:text-gray-900"
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            ...styles,
          }}
          {...getFloatingProps()}
        >
          {label}
          {arrow && (
            <FloatingArrow
              ref={arrowRef}
              context={context}
              tipRadius={2}
              height={arrow ? 4 : 0}
            />
          )}
        </div>
      )}
    </div>
  );
}
