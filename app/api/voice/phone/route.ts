import { NextRequest } from "next/server";

function twiml(xml: string) {
  return new Response(xml, { headers: { "Content-Type": "text/xml" } });
}

function extractDigitsGerman(text: string) {
  const t = text.toLowerCase();
  const map: Record<string, string> = {
    "null": "0",
    "eins": "1",
    "ein": "1",
    "zwei": "2",
    "drei": "3",
    "vier": "4",
    "f?nf": "5",
    "funf": "5",
    "sechs": "6",
    "sieben": "7",
    "acht": "8",
    "neun": "9"
  };
  const tokens = t.replace(/[^\p{L}\p{N}]+/gu, " ").split(/\s+/);
  const digits: string[] = [];
  for (const tok of tokens) {
    if (/^\d+$/.test(tok)) {
      digits.push(tok);
    } else if (map[tok]) {
      digits.push(map[tok]);
    }
  }
  return digits.join("");
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const origin = url.origin;
  const intent = url.searchParams.get("intent") || "question";
  const name = url.searchParams.get("name") || "";
  const formData = await req.formData();
  const phoneSpeech = String(formData.get("SpeechResult") || "").trim();
  const phone = extractDigitsGerman(phoneSpeech);

  const askReason = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<Response>
  <Gather input="speech" language="de-DE" speechTimeout="auto" action="${origin}/api/voice/reason?intent=${encodeURIComponent(
    intent
  )}&name=${encodeURIComponent(name)}&phone=${encodeURIComponent(
    phone || phoneSpeech
  )}" method="POST">
    <Say language="de-DE" voice="Polly.Marlene-Neural">Danke. Bitte sagen Sie kurz den Grund Ihres Anrufs.</Say>
  </Gather>
  <Redirect method="POST">${origin}/api/voice/reason?intent=${encodeURIComponent(
    intent
  )}&name=${encodeURIComponent(name)}&phone=${encodeURIComponent(
    phone || phoneSpeech
  )}</Redirect>
</Response>`;

  return twiml(askReason);
}
