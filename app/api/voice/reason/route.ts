import { NextRequest } from "next/server";
import { appendToSheet } from "../../../../lib/sheets";

function twiml(xml: string) {
  return new Response(xml, { headers: { "Content-Type": "text/xml" } });
}

function nowIso() {
  return new Date().toISOString();
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const origin = url.origin;
  const intent = url.searchParams.get("intent") || "question";
  const name = url.searchParams.get("name") || "";
  const phone = url.searchParams.get("phone") || "";
  const formData = await req.formData();
  const reasonLong = String(formData.get("SpeechResult") || "").trim();
  const callSid = String(formData.get("CallSid") || "");
  const from = String(formData.get("From") || "");

  const reasonShort = reasonLong.length > 120 ? reasonLong.slice(0, 117) + "..." : reasonLong;

  // Persist to Google Sheets (best-effort)
  try {
    await appendToSheet({
      timestampIso: nowIso(),
      callSid,
      caller: from,
      name,
      phone,
      intent,
      reasonShort,
      reasonLong,
      durationSeconds: "", // to be filled by status callback when available
    });
  } catch (err) {
    console.error("Sheets append failed", err);
  }

  if (intent === "forward") {
    const forwardNumber = process.env.PRACTICE_FORWARD_NUMBER || "";
    if (!forwardNumber) {
      return twiml(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="de-DE" voice="Polly.Marlene-Neural">Entschuldigung, die Weiterleitung ist derzeit nicht verf?gbar.</Say>
  <Say language="de-DE" voice="Polly.Marlene-Neural">Vielen Dank f?r Ihren Anruf. Auf Wiederh?ren.</Say>
  <Hangup/>
</Response>`);
    }

    // Forward call to practice team
    return twiml(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="de-DE" voice="Polly.Marlene-Neural">Ich verbinde Sie nun mit dem Praxisteam.</Say>
  <Dial callerId="${from}" answerOnBridge="true">
    <Number statusCallbackEvent="answered completed" statusCallbackMethod="POST" statusCallback="${origin}/api/voice/complete?sid=${encodeURIComponent(
      callSid
    )}">${forwardNumber}</Number>
  </Dial>
</Response>`);
  }

  // For non-forward cases, confirm and end
  return twiml(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="de-DE" voice="Polly.Marlene-Neural">Danke. Wir haben Ihre Angaben gespeichert und melden uns zeitnah. Auf Wiederh?ren.</Say>
  <Hangup/>
</Response>`);
}
