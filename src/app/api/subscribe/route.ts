import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_KEY;
  if (!key) throw new Error("RESEND_KEY not configured");
  return new Resend(key);
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const resend = getResend();

    const { data: existing, error: getErr } = await resend.contacts.get({ email });
    if (getErr && getErr?.statusCode !== 404) {
      console.error("[subscribe] check error:", getErr);
      return NextResponse.json(
        { error: "Failed to verify subscription status" },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { error: "Email already subscribed" },
        { status: 409 }
      );
    }

    const { error: createErr } = await resend.contacts.create({ email });
    if (createErr) {
      console.error("[subscribe] create error:", createErr);
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
    }

    const from = process.env.RESEND_FROM;
    if (!from) {
      console.error("[subscribe] RESEND_FROM not configured");
    }

    const segmentId = process.env.RESEND_SEGMENT_ID;

    const [{ error: sendErr }, { error: segmentErr }] = await Promise.all([
      resend.emails.send({
        from: from || "Shubham Kumar <hello@shubhkumar.in>",
        to: email,
        subject: "Welcome to the list",
        html: getWelcomeHtml(),
      }),
      segmentId
        ? resend.contacts.segments.add({ email, segmentId })
        : Promise.resolve({ error: null, data: null }),
    ]);

    if (sendErr) {
      console.error("[subscribe] welcome email error:", sendErr);
    }
    if (segmentErr) {
      console.error("[subscribe] segment add error:", segmentErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[subscribe] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function getWelcomeHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#131313;font-family:Inter,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">
          <tr>
            <td style="background:#1c1b1b;border-radius:16px;padding:40px;text-align:center;">
              <h1 style="font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:700;letter-spacing:-0.04em;color:#e5e2e1;margin:0 0 12px;">
                Welcome to the list
              </h1>
              <p style="font-size:14px;line-height:1.7;color:#bbc9cf;margin:0 0 24px;">
                Thanks for subscribing. You'll now get updates on what I'm building, writing, and thinking about.
              </p>
              <div style="height:1px;background:linear-gradient(to right,transparent,rgba(165,231,255,0.2),transparent);margin:0 0 24px;"></div>
              <p style="font-size:12px;color:#565f89;margin:0;">
                shubhkumar.in
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
