/* eslint-disable @next/next/no-img-element */
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { useState } from "react";
import type { PostImage } from "~/utils/customTypes";
import "@splidejs/react-splide/css";

export default function Carousel({ images }: { images: PostImage[] }) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const slides = images.map((img, index) =>
    index === 0 ? (
      <SplideSlide key={index}>
        <img
          src={isImageLoaded ? img.url : "/blur-placeholder.png"}
          alt={`image ${index + 1}`}
          onLoad={() => setIsImageLoaded(true)}
        />
      </SplideSlide>
    ) : (
      <SplideSlide key={index}>
        <img src={img.url} alt={`image ${index + 1}`} key={index} />
      </SplideSlide>
    )
  );

  return (
    <Splide tag="section" aria-label="carousel">
      {slides}
    </Splide>
  );
}
