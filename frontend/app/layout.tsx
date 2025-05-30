import './globals.css';

export const metadata = {
  title: 'Healthcare Query System',
  description: 'A system for querying healthcare data',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 