"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({ images, name }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="product-gallery" role="region" aria-label={`${name} product photos`}>
      <div
        className="product-gallery-main"
        style={{ aspectRatio: `${activeImage.width} / ${activeImage.height}` }}
      >
        <Image
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          priority
          loading="eager"
          sizes="(max-width: 900px) 100vw, 62vw"
          className="product-gallery-photo"
        />
        <span className="product-gallery-count" aria-live="polite">
          {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
      </div>

      <div className="product-gallery-thumbnails" role="group" aria-label="Choose a product photo">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            className={`product-gallery-thumbnail${index === activeIndex ? " is-active" : ""}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Show photo ${index + 1}: ${image.alt}`}
            aria-pressed={index === activeIndex}
          >
            <Image
              src={image.src}
              alt=""
              fill
              sizes="(max-width: 600px) 84px, (max-width: 900px) 20vw, 140px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
