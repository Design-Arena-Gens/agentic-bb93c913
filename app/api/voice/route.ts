import { NextRequest } from "next/server";

function twiml(xml: string) {
  return new Response(xml, { headers: { "Content-Type": "text/xml" } });
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const base = `${url.origin}`;

  const greet = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" language="de-DE" hints="Termin verschieben, Termin l?schen, Frage, Weiterleiten" speechTimeout="auto" action="${base}/api/voice/gather" method="POST">
    <Say language="de-DE" voice="Polly.Marlene-Neural">Willkommen in der Zahnarztpraxis. Sagen Sie: Termin verschieben, Termin l?schen, Frage, oder Weiterleiten.</Say>
  </Gather>
  <Say language="de-DE" voice="Polly.Marlene-Neural">Entschuldigung, ich habe nichts verstanden.</Say>
  <Redirect method="POST">${base}/api/voice</Redirect>
</Response>`;

  return twiml(greet);
}

export async function GET() {
  return twiml(`<?xml version="1.0" encoding="UTF-8"?>\n<Response><Say language="de-DE">Dieser Endpunkt erwartet POST von Twilio.</Say></Response>`);
}
