import { createClient } from "@supabase/supabase-js";
import { SMS_CONSENT_TEXT, SMS_CONSENT_VERSION } from "../../lib/sms-consent";

const phonePattern = /^\+[1-9]\d{7,14}$/;

function normalizePhone(value) {
  return typeof value === "string" ? value.replace(/[\s().-]/g, "") : "";
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof body.website === "string" && body.website.trim()) {
    return Response.json({ error: "Unable to process signup." }, { status: 400 });
  }

  const phone = normalizePhone(body.phone);

  if (!phonePattern.test(phone)) {
    return Response.json(
      { error: "Enter a valid number with country code, such as +1 555 123 4567." },
      { status: 400 },
    );
  }

  if (body.consented !== true) {
    return Response.json(
      { error: "Please agree to the text-message consent before joining." },
      { status: 400 },
    );
  }

  const authorization = request.headers.get("authorization");
  const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!accessToken || !supabaseUrl || !anonKey || !serviceRoleKey) {
    return Response.json({ error: "Verify your phone number before joining." }, { status: 401 });
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: authError } = await authClient.auth.getUser(accessToken);
  const verifiedUser = userData?.user;

  if (
    authError ||
    !verifiedUser?.phone_confirmed_at ||
    normalizePhone(verifiedUser.phone) !== phone
  ) {
    return Response.json({ error: "Verify this phone number before joining." }, { status: 401 });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await adminClient.rpc("subscribe_sms_number", {
    input_phone_e164: phone,
    input_source: "website_sms_landing",
    input_consent_version: SMS_CONSENT_VERSION,
    input_consent_text: SMS_CONSENT_TEXT,
  });

  if (error) {
    console.error("SMS signup insert failed:", error.message);
    return Response.json(
      { error: "Signup is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  return Response.json({ ok: true });
}