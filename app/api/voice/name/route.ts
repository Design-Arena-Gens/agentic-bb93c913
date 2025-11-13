import { NextRequest } from "next/server";

function twiml(xml: string) {
  return new Response(xml, { headers: { "Content-Type": "text/xml" } });
}

export async function POST(req: NextRequest) {
  const origin = new URL(req.url).origin;
  const intent = new URL(req.url).searchParams.get("intent") || "question";
  const formData = await req.formData();
  const name = String(formData.get("SpeechResult") || "").trim();

  const askPhone = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<Response>
  <Gather input="speech" language="de-DE" speechTimeout="auto" action="${origin}/api/voice/phone?intent=${encodeURIComponent(intent)}&name=${encodeURIComponent(
    name
  )}" method="POST">
    <Say language="de-DE" voice="Polly.Marlene-Neural">Danke, ${name || ""}. Bitte sagen Sie Ihre Telefonnummer Ziffer f?r Ziffer.</Say>
  </Gather>
  <Redirect method="POST">${origin}/api/voice/phone?intent=${encodeURIComponent(intent)}&name=${encodeURIComponent(
    name
  )}</Redirect>
</Response>`;

  return twiml(askPhone);
}
