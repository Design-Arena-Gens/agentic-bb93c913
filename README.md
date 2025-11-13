# Zahnarzt Voice Agent (Next.js + Twilio + Google Sheets)

Webbasierter Telefon‑Assistent für Zahnarztpraxen. Beantwortet Fragen, nimmt Anliegen entgegen, kann Termine verschieben/löschen (Absicht erfassen) oder den Anruf ans Team weiterleiten. Alle Informationen werden in Google Sheets protokolliert (Name, Telefonnummer, kurzer Grund, ausführliche Beschreibung, Anrufdauer wenn verfügbar).

## Funktionen
- Intent‑Erkennung per Sprache (Deutsch): „Termin verschieben“, „Termin löschen“, „Frage“, „Weiterleiten“
- Datenerfassung per Sprachdialog: Name, Telefonnummer (Ziffern), kurzer Grund
- Weiterleitung zum Praxisteam via TwiML `<Dial>`
- Google Sheets Logging (Service Account)

## Endpunkte
- `POST /api/voice` – Einstieg (Twilio Voice Webhook)
- `POST /api/voice/gather` – Intent‑Erkennung
- `POST /api/voice/name` – Name erfassen
- `POST /api/voice/phone` – Telefonnummer erfassen
- `POST /api/voice/reason` – Grund erfassen, Sheets‑Logging, ggf. Weiterleitung oder Auflegen
- `POST /api/voice/complete` – Status‑Callback (z. B. Dauer nach Weiterleitung)

## Konfiguration
Environment‑Variablen (Vercel → Project Settings → Environment Variables):

```
PRACTICE_FORWARD_NUMBER=+49301234567
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_ID=...
```

Google Sheet: Tab „Anrufe“ mit Spalten (A→I):
`timestampIso, callSid, caller, name, phone, intent, reasonShort, reasonLong, durationSeconds`

## Twilio Setup
1. Twilio Console → Phone Numbers → Ihre Nummer → Voice & Fax
2. A Call Comes In → Webhook (HTTP POST) → `https://<ihr-host>/api/voice`
3. Optional Status Callback → `https://<ihr-host>/api/voice/complete`

## Entwicklung
```
npm install
npm run dev
```

## Build
```
npm run build && npm start
```

## Deployment (Vercel)
```
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-bb93c913
```