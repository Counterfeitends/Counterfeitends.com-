"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function PhotoCarousel({ group, groupIndex, onSelect }) {
  const railRef = useRef(null);

  function scroll(direction) {
    const rail = railRef.current;
    if (!rail) return;

    const card = rail.querySelector(".product-story-card");
    const distance = card ? card.getBoundingClientRect().width + 12 : rail.clientWidth;
    rail.scrollBy({ left: direction * distance, behavior: "smooth" });
  }

  return (
    <section className="product-story-group" aria-label={group.label}>
      <h2 className="visually-hidden">{group.label}</h2>
      <div className="product-story-controls" role="group" aria-label={`${group.label} carousel controls`}>
        <button type="button" onClick={() => scroll(-1)} aria-label={`Previous: ${group.label}`}>
          ‹
        </button>
        <button type="button" onClick={() => scroll(1)} aria-label={`Next: ${group.label}`}>
          ›
        </button>
      </div>
      <div className="product-story-rail" ref={railRef}>
        {group.photos.map((photo, photoIndex) => (
          <button
            key={photo.src}
            type="button"
            className={`product-story-card${groupIndex === 0 && photoIndex === 0 ? " is-featured" : ""}`}
            style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
            onClick={() => onSelect(groupIndex, photoIndex)}
            aria-label={`Open photo ${photoIndex + 1} of ${group.photos.length}: ${photo.alt}`}
          >
            <Image
              src={photo.src}
              alt=""
              fill
              sizes="(max-width: 600px) 72vw, (max-width: 900px) 40vw, 28vw"
              loading={groupIndex === 0 && photoIndex === 0 ? "eager" : "lazy"}
              priority={groupIndex === 0 && photoIndex === 0}
            />
            {groupIndex === 0 && photoIndex === 0 && (
              <span className="product-story-image-count">01 / 16</span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

export default function ProductPhotoStories({ groups, name }) {
  const [activePhoto, setActivePhoto] = useState(null);
  const viewerRef = useRef(null);
  const photos = useMemo(
    () =>
      groups.flatMap((group, groupIndex) =>
        group.photos.map((photo, photoIndex) => ({ ...photo, groupIndex, photoIndex })),
      ),
    [groups],
  );
  const activeIndex = photos.findIndex(
    (photo) =>
      photo.groupIndex === activePhoto?.groupIndex &&
      photo.photoIndex === activePhoto?.photoIndex,
  );
  const active = activeIndex >= 0 ? photos[activeIndex] : null;

  const movePhoto = useCallback(
    (direction) => {
      if (activeIndex < 0) return;
      const next = photos[(activeIndex + direction + photos.length) % photos.length];
      setActivePhoto({ groupIndex: next.groupIndex, photoIndex: next.photoIndex });
    },
    [activeIndex, photos],
  );

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    if (activePhoto && !viewer.open) viewer.showModal();
    if (!activePhoto && viewer.open) viewer.close();
  }, [activePhoto]);

  useEffect(() => {
    if (!activePhoto) return;

    function handleKeyDown(event) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        movePhoto(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        movePhoto(-1);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activePhoto, movePhoto]);

  return (
    <div className="product-photo-stories" aria-label={`${name} photo collections`}>
      {groups.map((group, index) => (
        <PhotoCarousel
          key={group.label}
          group={group}
          groupIndex={index}
          onSelect={(groupIndex, photoIndex) => setActivePhoto({ groupIndex, photoIndex })}
        />
      ))}

      <dialog
        ref={viewerRef}
        className="product-gallery-viewer product-story-viewer"
        aria-label={`${name} photo viewer`}
        onClose={() => setActivePhoto(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setActivePhoto(null);
        }}
      >
        {active && (
          <>
            <div className="product-gallery-viewer-header">
              <span>{name}</span>
              <span aria-live="polite">
                {String(activeIndex + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
              </span>
              <button type="button" onClick={() => setActivePhoto(null)} aria-label="Close photo viewer">
                Close
              </button>
            </div>
            <div className="product-gallery-viewer-stage">
              <button
                type="button"
                className="product-gallery-viewer-nav is-previous"
                onClick={() => movePhoto(-1)}
                aria-label="Show previous photo"
              >
                ‹
              </button>
              <Image
                key={active.src}
                src={active.src}
                alt={active.alt}
                fill
                priority
                sizes="(max-width: 600px) 92vw, 90vw"
                className="product-gallery-viewer-photo"
              />
              <button
                type="button"
                className="product-gallery-viewer-nav is-next"
                onClick={() => movePhoto(1)}
                aria-label="Show next photo"
              >
                ›
              </button>
            </div>
            <div className="product-gallery-viewer-thumbnails" role="group" aria-label="Choose a product photo">
              {photos.map((photo, index) => (
                <button
                  key={photo.src}
                  type="button"
                  className={`product-gallery-thumbnail${index === activeIndex ? " is-active" : ""}`}
                  onClick={() => setActivePhoto({ groupIndex: photo.groupIndex, photoIndex: photo.photoIndex })}
                  aria-label={`Show photo ${index + 1} of ${photos.length}`}
                  aria-pressed={index === activeIndex}
                >
                  <Image src={photo.src} alt="" fill sizes="(max-width: 600px) 48px, 72px" />
                </button>
              ))}
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
