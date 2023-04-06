/* eslint-disable @next/next/no-img-element */
import useEmblaCarousel from "embla-carousel-react";
import { type KeyboardEvent, useCallback, useEffect, useState } from "react";
import { type CarouselProps } from "~/utils/customTypes";
import { NextButton, PrevButton } from "./CarouselActionButtons";

export default function Carousel({
  slides,
  options,
  isNavigationVisible = false,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const [isCarouselBeingFocused, setIsCarouselBeingFocused] = useState(false);

  const [currentVisibleSlide, setCurrentVisibleSlide] = useState(0);

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const scrollPrev = useCallback(() => {
    setCurrentVisibleSlide((slide) => slide - 1);
    return emblaApi && emblaApi.scrollPrev();
  }, [emblaApi]);
  const scrollNext = useCallback(() => {
    setCurrentVisibleSlide((slide) => slide + 1);
    return emblaApi && emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  function keyChange(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowLeft") {
      return scrollPrev();
    }

    if (e.key === "ArrowRight") {
      return scrollNext();
    }
  }

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <>
      <div
        className="tab rounded-lg bg-web-white dark:bg-web-gray"
        onMouseOver={() => setIsCarouselBeingFocused(true)}
        onMouseLeave={() => setIsCarouselBeingFocused(false)}
        onFocus={() => setIsCarouselBeingFocused(true)}
        onBlur={() => setIsCarouselBeingFocused(false)}
        onKeyDown={keyChange}
        aria-label="carousel"
        tabIndex={0}
      >
        <div
          className="relative left-1/2 flex w-fit -translate-x-1/2 overflow-clip rounded-lg"
          ref={emblaRef}
        >
          <div className="flex">
            {slides.map((img, index) => (
              <div
                className="shrink-0 grow basis-full"
                key={index}
                data-testid={`slide ${index + 1}`}
                data-inviewport={currentVisibleSlide === index ? true : false}
              >
                {/* only use loading placeholder on first slide */}
                {index === 0 ? (
                  <>
                    <img
                      className="w-full rounded-lg"
                      src={img.url}
                      alt=""
                      onLoad={() => setIsImageLoaded(true)}
                      hidden={!isImageLoaded}
                    />
                    <img
                      hidden={isImageLoaded}
                      className="w-full"
                      src="/blur-placeholder.png"
                      alt="placeholder image"
                    />
                  </>
                ) : (
                  <img className="w-full" src={img.url} alt="" />
                )}
              </div>
            ))}
          </div>
        </div>
        {isNavigationVisible && (
          <div hidden={!isCarouselBeingFocused} data-testid="navContainer">
            <PrevButton onClick={scrollPrev} isActive={prevBtnEnabled} />
            <NextButton onClick={scrollNext} isActive={nextBtnEnabled} />
          </div>
        )}
      </div>
    </>
  );
}
