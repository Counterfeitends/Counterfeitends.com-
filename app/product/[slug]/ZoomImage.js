"use client";
import { useState, useRef } from "react";

export default function ZoomImage({ src, alt }) {
  const [zoomed, setZoomed] = useState(false);
  const imgRef = useRef(null);

  function handleMouseMove(e) {
    if (!zoomed || !imgRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    imgRef.current.style.transformOrigin = `${x}% ${y}%`;
  }

  return (
    <div
      className={`zoom-container${zoomed ? " zoomed" : ""}`}
      onClick={() => setZoomed(!zoomed)}
      onMouseMove={handleMouseMove}
    >
      <img ref={imgRef} src={src} alt={alt} className="zoom-img" />
      <span className="zoom-hint">{zoomed ? "click to zoom out" : "click to zoom in"}</span>
    </div>
  );
}
