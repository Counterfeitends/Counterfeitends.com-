"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import SmsSignup from "./SmsSignup";

export default function SmsModal() {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        window.location.assign("/");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function closeFromBackdrop(event) {
    if (event.target === event.currentTarget) {
      window.location.assign("/");
    }
  }

  return (
    <div
      className="sms-modal-backdrop"
      role="presentation"
      onMouseDown={closeFromBackdrop}
    >
      <section
        className="sms-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sms-signup-title"
      >
        <Link
          ref={closeButtonRef}
          className="sms-modal-close"
          href="/"
          aria-label="Close SMS signup"
        >
          Close
        </Link>
        <SmsSignup />
      </section>
    </div>
  );
}