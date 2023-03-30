import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { type CarouselButtonProps } from "~/utils/customTypes";

export function DotButton({ isActive, onClick }: CarouselButtonProps) {
  return (
    <div className={`${isActive ? "" : ""}`} onClick={onClick} aria-hidden />
  );
}

export function PrevButton({ isActive, onClick }: CarouselButtonProps) {
  return (
    <button
      type="button"
      className="absolute top-[44%] left-6 z-[1] flex w-fit translate-y-1/2 touch-manipulation appearance-none items-center justify-center rounded-full border-1 border-black bg-transparent bg-web-white p-1 dark:bg-web-gray-light"
      onClick={onClick}
      disabled={!isActive}
      hidden={!isActive}
      aria-label="Previous slide"
    >
      <ArrowLeftIcon className="w-5" />
    </button>
  );
}

export function NextButton({ isActive, onClick }: CarouselButtonProps) {
  return (
    <button
      type="button"
      className="absolute top-[44%] right-6 z-[1] flex w-fit translate-y-1/2 touch-manipulation appearance-none items-center justify-center rounded-full border-1 border-black bg-transparent bg-web-white p-1 transition-all dark:bg-web-gray-light"
      onClick={onClick}
      disabled={!isActive}
      hidden={!isActive}
      aria-label="Next slide"
    >
      <ArrowRightIcon className="w-5" />
    </button>
  );
}
