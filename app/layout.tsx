import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Caveat, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import './ios.css';
import './dark.css';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
});

const sans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

const mono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

// Handwritten accent for Buddy's speech bubbles on the intro
const hand = Caveat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-hand',
});

export const metadata: Metadata = {
  title: 'BaonBuddy',
  description: 'The allowance tracker built for students.',
};

// viewport-fit=cover lets iOS (and Android's SystemBars) report the notch and
// home-indicator insets, which globals.css applies as safe-area padding.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FFFFFF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=(JSON.parse(localStorage.getItem('estudyante-balanse.v1')||'{}').settings||{}).theme||'system';if(t==='system')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
      </head>
      <body className={`${display.variable} ${sans.variable} ${mono.variable} ${hand.variable} font-sans antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
