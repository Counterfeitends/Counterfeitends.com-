"use client";

import { useState } from "react";
import { SMS_CONSENT_TEXT } from "./lib/sms-consent";

const phonePattern = /^\+[1-9]\d{7,14}$/;

function normalizePhone(value) {
  return value.replace(/[\s().-]/g, "");
}

export default function SmsSignup() {
  const [phone, setPhone] = useState("");
  const [consented, setConsented] = useState(false);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("");

    const normalizedPhone = normalizePhone(phone);
    if (!phonePattern.test(normalizedPhone)) {
      setStatus("Enter a complete number with country code, such as +1 555 123 4567.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/sms-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalizedPhone,
          consented,
          website: formData.get("website"),
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        setStatus(result.error || "Signup failed. Please try again.");
        return;
      }

      setPhone("");
      setConsented(false);
      setStatus("You're on the list.");
    } catch {
      setStatus("Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="sms-signup" aria-labelledby="sms-signup-title">
      <div className="sms-signup-heading">
        <div className="section-title" id="sms-signup-title">
          SMS / 001
        </div>
        <p>Drop alerts, restocks, and event invites.</p>
      </div>

      <form className="sms-signup-form" onSubmit={handleSubmit}>
        <label className="sms-phone-label" htmlFor="sms-phone">
          Mobile number, including country code
        </label>
        <div className="sms-input-row">
          <input
            id="sms-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+1 555 123 4567"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />
          <button type="submit" disabled={isSubmitting || !consented}>
            {isSubmitting ? "Saving..." : "Join list"}
          </button>
        </div>

        <label className="sms-consent">
          <input
            type="checkbox"
            checked={consented}
            onChange={(event) => setConsented(event.target.checked)}
            required
          />
          <span>{SMS_CONSENT_TEXT}</span>
        </label>

        <label className="sms-honeypot" aria-hidden="true">
          Leave this field empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <p className="sms-status" role="status" aria-live="polite">
          {status}
        </p>
      </form>
    </section>
  );
}