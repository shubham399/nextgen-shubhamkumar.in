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

    const segmentId = process.env.RESEND_SEGMENT_ID;

    const { error: createErr } = await resend.contacts.create({
      email,
      ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
    });
    if (createErr) {
      console.error("[subscribe] create error:", createErr);
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
    }

    const from = process.env.RESEND_FROM;
    if (!from) {
      console.error("[subscribe] RESEND_FROM not configured");
    }

    const { error: sendErr } = await resend.emails.send({
      from: from || "Shubham Kumar <hello@shubhkumar.in>",
      to: email,
      subject: "Welcome to the list",
      html: getWelcomeHtml(),
    });
    if (sendErr) {
      console.error("[subscribe] welcome email error:", sendErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[subscribe] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function getWelcomeHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Welcome to the list</title>
</head>
<body style="margin:0;padding:0;background-color:#131313;font-family:Inter,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#131313;">
    <tr>
      <td align="center" style="padding:48px 20px;">

        <!-- Card -->
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#1c1b1b;border-radius:16px;overflow:hidden;">

          <!-- Top accent bar -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#7dcfff 0%,#7aa2f7 50%,#bb9af7 100%);"></td>
          </tr>

          <tr>
            <td style="padding:36px 36px 0;">

              <!-- Label -->
              <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#565f89;font-family:'Space Grotesk',sans-serif;">
                New Subscriber
              </p>

              <!-- Title -->
              <h1 style="margin:0 0 14px;font-size:22px;font-weight:700;line-height:1.3;letter-spacing:-0.03em;color:#e5e2e1;font-family:'Space Grotesk',Arial,sans-serif;">
                Welcome to the list
              </h1>

              <!-- Description -->
              <p style="margin:0 0 28px;font-size:14px;line-height:1.75;color:#bbc9cf;">
                Thanks for subscribing. You'll get updates on what I'm building, writing, and thinking about — shipped straight to your inbox.
              </p>

              <!-- Divider -->
              <div style="height:1px;background:linear-gradient(to right,transparent,rgba(165,231,255,0.15),transparent);margin:0 0 28px;"></div>

              <!-- CTA button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td style="border-radius:8px;background:linear-gradient(135deg,#7dcfff 0%,#7aa2f7 100%);">
                    <a href="https://shubhkumar.in" style="display:inline-block;padding:11px 26px;font-family:'Space Grotesk',Arial,sans-serif;font-size:14px;font-weight:600;color:#131313;text-decoration:none;border-radius:8px;letter-spacing:0.01em;">
                      Visit the site →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px 28px;">
              <div style="height:1px;background:rgba(86,95,137,0.2);margin:0 0 20px;"></div>
              <p style="margin:0;font-size:11px;color:#565f89;line-height:1.6;">
                Shubham · <a href="https://shubhkumar.in" style="color:#565f89;text-decoration:none;">shubhkumar.in</a>
                <br />
                You're receiving this because you subscribed to my newsletter.
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
