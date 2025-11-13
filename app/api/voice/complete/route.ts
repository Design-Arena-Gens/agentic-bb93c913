import { NextRequest } from "next/server";
import { appendToSheet } from "../../../../lib/sheets";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const sid = url.searchParams.get("sid") || "";
  const formData = await req.formData();
  const callStatus = String(formData.get("CallStatus") || "");
  const callDuration = String(formData.get("CallDuration") || "");
  const to = String(formData.get("To") || "");
  const from = String(formData.get("From") || "");

  try {
    // Append a lightweight row noting duration for the sid
    await appendToSheet({
      timestampIso: new Date().toISOString(),
      callSid: sid || String(formData.get("CallSid") || ""),
      caller: from,
      name: "",
      phone: to,
      intent: "forward-complete",
      reasonShort: callStatus,
      reasonLong: `Forward completed with status ${callStatus}`,
      durationSeconds: callDuration,
    });
  } catch (e) {
    console.error("Failed to log status callback", e);
  }

  return new Response("OK", { status: 200 });
}
