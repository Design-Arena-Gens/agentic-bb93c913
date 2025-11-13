import { NextRequest } from "next/server";

function twiml(xml: string) {
  return new Response(xml, { headers: { "Content-Type": "text/xml" } });
}

function normalize(text: string) {
  return text.toLowerCase().normalize("NFKD");
}

function detectIntent(speech: string) {
  const t = normalize(speech);
  if (/(weiterleiten|verbinden|mitarbeiter|team)/i.test(t)) return "forward";
  if (/(verschieben|verlegen|aendern|reschedule)/i.test(t)) return "reschedule";
  if (/(loeschen|stornieren|absagen|cancel)/i.test(t)) return "cancel";
  return "question";
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const speechResult = String(formData.get("SpeechResult") || "").trim();
  const callSid = String(formData.get("CallSid") || "");

  const origin = new URL(req.url).origin;
  const intent = speechResult ? detectIntent(speechResult) : "question";

  const askName = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" language="de-DE" speechTimeout="auto" action="${origin}/api/voice/name?intent=${intent}" method="POST">
    <Say language="de-DE" voice="Polly.Marlene-Neural">Alles klar. Bitte sagen Sie Ihren Vor- und Nachnamen.</Say>
  </Gather>
  <Redirect method="POST">${origin}/api/voice/name?intent=${intent}</Redirect>
</Response>`;

  // Record start time hint for potential duration calc (best-effort)
  // Not reliably persisted on serverless; final duration should come from Twilio StatusCallback when configured.

  return twiml(askName);
}
