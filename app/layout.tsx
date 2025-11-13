export const metadata = {
  title: "Zahnarzt Voice Agent",
  description: "Automatischer Telefon-Assistent f?r Zahnarztpraxen"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, sans-serif', background: '#0b1220', color: '#e6e9ef' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
