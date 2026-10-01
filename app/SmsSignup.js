"use client";

import { useState } from "react";
import { SMS_CONSENT_TEXT } from "./lib/sms-consent";
import { supabase } from "./lib/supabase";

function normalizePhone(value) {
  return value.replace(/[\s().-]/g, "");
}

export default function SmsSignup() {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [consented, setConsented] = useState(false);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function requestCode() {
    setStatus("");
    setIsSubmitting(true);

    try {
      if (!supabase) {
        setStatus("Signup is temporarily unavailable. Please try again later.");
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: normalizePhone(phone),
        options: { shouldCreateUser: true },
      });

      if (error) {
        setStatus("Could not send a verification code. Check the number and try again.");
        return;
      }

      setStep("code");
      setStatus("A verification code has been sent.");
    } catch {
      setStatus("Could not send a verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStart(event) {
    event.preventDefault();
    await requestCode();
  }

  async function handleVerify(event) {
    event.preventDefault();
    setStatus("");
    setIsSubmitting(true);

    try {
      if (!supabase) {
        setStatus("Signup is temporarily unavailable. Please try again later.");
        return;
      }

      const normalizedPhone = normalizePhone(phone);
      const { data, error } = await supabase.auth.verifyOtp({
        phone: normalizedPhone,
        token: code,
        type: "sms",
      });

      if (error || !data.session?.access_token) {
        setStatus("That code is incorrect or expired. Check it and try again.");
        return;
      }

      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/sms-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session.access_token}`,
        },
        body: JSON.stringify({
          phone: normalizedPhone,
          consented,
          website: formData.get("website"),
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        setStatus(result.error || "Could not complete signup. Please try again.");
        return;
      }

      await supabase.auth.signOut();
      setStep("complete");
      setCode("");
      setStatus("Your number is verified. You're on the list.");
    } catch {
      setStatus("Could not complete signup. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function changeNumber() {
    setStep("phone");
    setCode("");
    setStatus("");
  }

  return (
    <section className="sms-signup" aria-labelledby="sms-signup-title">
      <div className="sms-signup-heading">
        <div className="section-title" id="sms-signup-title">
          SMS / 001
        </div>
        <p>Drop alerts, restocks, and event invites.</p>
      </div>

      {step === "complete" ? (
        <p className="sms-status" role="status" aria-live="polite">
          Your number is verified. You&apos;re on the list.
        </p>
      ) : (
        <form
          className="sms-signup-form"
          onSubmit={step === "phone" ? handleStart : handleVerify}
        >
          {step === "phone" ? (
            <>
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
                  {isSubmitting ? "Sending..." : "Send code"}
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
              <p className="sms-code-note">
                We&apos;ll text a one-time code to verify your number before adding it.
              </p>
            </>
          ) : (
            <>
              <label className="sms-phone-label" htmlFor="sms-code">
                Verification code sent to {phone}
              </label>
              <div className="sms-input-row">
                <input
                  id="sms-code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{4,10}"
                  maxLength={10}
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 10))}
                  required
                />
                <button type="submit" disabled={isSubmitting || !consented}>
                  {isSubmitting ? "Checking..." : "Verify & join"}
                </button>
              </div>
              <div className="sms-step-actions">
                <button
                  className="sms-secondary-button"
                  type="button"
                  disabled={isSubmitting}
                  onClick={requestCode}
                >
                  Send another code
                </button>
                <button
                  className="sms-secondary-button"
                  type="button"
                  disabled={isSubmitting}
                  onClick={changeNumber}
                >
                  Use a different number
                </button>
              </div>
            </>
          )}

          <label className="sms-honeypot" aria-hidden="true">
            Leave this field empty
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
          <p className="sms-status" role="status" aria-live="polite">
            {status}
          </p>
        </form>
      )}
    </section>
  );
}