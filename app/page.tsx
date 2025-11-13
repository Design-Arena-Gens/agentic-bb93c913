export default function Page() {
  return (
    <main>
      <h1 style={{ fontSize: 40, marginBottom: 8 }}>Zahnarzt Voice Agent</h1>
      <p style={{ opacity: 0.8, marginBottom: 24 }}>
        Beantwortet Fragen, verschiebt oder l?scht Termine und leitet auf Wunsch
        an das Praxisteam weiter. Alle Anrufdetails werden in Google Sheets gespeichert.
      </p>

      <section style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <div style={{ background: '#121a2b', padding: 16, borderRadius: 12 }}>
          <h2>Webhook Endpunkte</h2>
          <ul style={{ lineHeight: 1.8 }}>
            <li><code>/api/voice</code>: Eingang f?r Anrufe (Twilio Voice Webhook)</li>
            <li><code>/api/voice/gather</code>: Intent-Erkennung (Sprache)</li>
            <li><code>/api/voice/name</code>, <code>/api/voice/phone</code>, <code>/api/voice/reason</code></li>
            <li><code>/api/voice/complete</code>: Status-Callback (Anrufdauer)</li>
          </ul>
        </div>

        <div style={{ background: '#121a2b', padding: 16, borderRadius: 12 }}>
          <h2>Konfiguration</h2>
          <ul style={{ lineHeight: 1.8 }}>
            <li><code>PRACTICE_FORWARD_NUMBER</code>: Weiterleitungsziel</li>
            <li><code>GOOGLE_SERVICE_ACCOUNT_EMAIL</code>, <code>GOOGLE_PRIVATE_KEY</code></li>
            <li><code>GOOGLE_SHEETS_ID</code></li>
          </ul>
        </div>

        <div style={{ background: '#121a2b', padding: 16, borderRadius: 12 }}>
          <h2>Twilio Setup</h2>
          <ol style={{ lineHeight: 1.8 }}>
            <li>Telefonnummer ? Voice & Fax ? A Call Comes In ? Webhook auf <code>/api/voice</code></li>
            <li>Status Callback (optional) ? <code>/api/voice/complete</code></li>
          </ol>
        </div>
      </section>
    </main>
  );
}
