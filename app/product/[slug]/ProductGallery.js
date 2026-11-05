"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function ProductGallery({ images, name }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const viewerRef = useRef(null);
  const activeImage = images[activeIndex] ?? images[0];
  const photoNumber = `${String(activeIndex + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`;

  function showPhoto(index) {
    setActiveIndex((index + images.length) % images.length);
  }

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    if (viewerOpen && !viewer.open) viewer.showModal();
    if (!viewerOpen && viewer.open) viewer.close();
  }, [viewerOpen]);

  useEffect(() => {
    if (!viewerOpen) return;

    function handleKeyDown(event) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % images.length);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((index) => (index - 1 + images.length) % images.length);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [images.length, viewerOpen]);

  return (
    <div className="product-gallery" role="region" aria-label={`${name} product photos`}>
      <div
        className="product-gallery-main"
        style={{ aspectRatio: `${activeImage.width} / ${activeImage.height}` }}
      >
        <button
          type="button"
          className="product-gallery-open-viewer"
          onClick={() => setViewerOpen(true)}
          aria-label={`Enlarge photo ${activeIndex + 1}: ${activeImage.alt}`}
        >
          <Image
            src={activeImage.src}
            alt=""
            fill
            priority
            loading="eager"
            sizes="(max-width: 900px) 100vw, 62vw"
            className="product-gallery-photo"
          />
          <span className="product-gallery-count" aria-live="polite">{photoNumber}</span>
          <span className="product-gallery-expand-hint" aria-hidden="true">Expand photo</span>
        </button>
      </div>

      <div className="product-gallery-thumbnails" role="group" aria-label="Choose a product photo">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            className={`product-gallery-thumbnail${index === activeIndex ? " is-active" : ""}`}
            onClick={() => showPhoto(index)}
            aria-label={`Show photo ${index + 1}: ${image.alt}`}
            aria-pressed={index === activeIndex}
          >
            <Image
              src={image.src}
              alt=""
              fill
              sizes="(max-width: 600px) 60px, (max-width: 900px) 20vw, 140px"
            />
          </button>
        ))}
      </div>

      <dialog
        ref={viewerRef}
        className="product-gallery-viewer"
        aria-label={`${name} photo viewer`}
        onClose={() => setViewerOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setViewerOpen(false);
        }}
      >
        <div className="product-gallery-viewer-header">
          <span>{name}</span>
          <span aria-live="polite">{photoNumber}</span>
          <button type="button" onClick={() => setViewerOpen(false)} aria-label="Close photo viewer">
            Close
          </button>
        </div>

        <div className="product-gallery-viewer-stage">
          <button
            type="button"
            className="product-gallery-viewer-nav is-previous"
            onClick={() => showPhoto(activeIndex - 1)}
            aria-label="Show previous photo"
          >
            ‹
          </button>
          <Image
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            priority={viewerOpen}
            loading={viewerOpen ? "eager" : "lazy"}
            sizes="(max-width: 600px) 92vw, 90vw"
            className="product-gallery-viewer-photo"
          />
          <button
            type="button"
            className="product-gallery-viewer-nav is-next"
            onClick={() => showPhoto(activeIndex + 1)}
            aria-label="Show next photo"
          >
            ›
          </button>
        </div>

        <div className="product-gallery-viewer-thumbnails" role="group" aria-label="Choose a product photo">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              className={`product-gallery-thumbnail${index === activeIndex ? " is-active" : ""}`}
              onClick={() => showPhoto(index)}
              aria-label={`Show photo ${index + 1}: ${image.alt}`}
              aria-pressed={index === activeIndex}
            >
              <Image src={image.src} alt="" fill sizes="(max-width: 600px) 48px, 72px" />
            </button>
          ))}
        </div>
      </dialog>
    </div>
  );
}
