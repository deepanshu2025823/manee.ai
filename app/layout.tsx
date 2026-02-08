// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Manee.ai - Enterprise AI Workforce",
  description: "The All-In-One AI Workforce for Enterprise. Connect your CRM, HRMS, and ERP in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        <Script 
          src="http://localhost:3000/embed.js" 
          strategy="lazyOnload" 
        />
        
        <Script id="manee-ai-init" strategy="lazyOnload">
          {`
            if (window.self === window.top) {
              
              var checkManee = setInterval(function() {
                if (typeof window.ManeeAI !== 'undefined') {
                  ManeeAI.init({ 
                    apiKey: "manee-667cc928-c3a9-41fa-9842-cc439a794ae8" 
                  });
                  clearInterval(checkManee); 
                }
              }, 100);

            }
          `}
        </Script>
      </body>
    </html>
  );
}