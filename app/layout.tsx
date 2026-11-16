import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Madheshi App - News & Local Calculators',
  description: 'Madheshi App V1 - News from Madheshi.com, Simple & Compound Interest Calculator, Nepali Age Calculator (AD & BS), and Nepal Land Area Converter (Bigha & Ropani).',
  openGraph: {
    title: 'Madheshi App - News & Local Calculators',
    description: 'Madheshi App V1 - News from Madheshi.com, Simple & Compound Interest Calculator, Nepali Age Calculator (AD & BS), and Nepal Land Area Converter (Bigha & Ropani).',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Madheshi App - News & Local Calculators',
    description: 'Madheshi App V1 - News from Madheshi.com, Simple & Compound Interest Calculator, Nepali Age Calculator (AD & BS), and Nepal Land Area Converter (Bigha & Ropani).',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
