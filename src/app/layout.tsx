import localFont from "next/font/local";
import "./globals.css";
import '@radix-ui/themes/styles.css';
import { AuthKitProvider } from '@workos-inc/authkit-nextjs';
import Link from 'next/link';
import React from "react";
import { SignInButton } from '@/app/components/SignInButton';
import { ChatButton, ChatHistoryButton } from '@/app/components/ChatButtons'
import { Theme } from '@radix-ui/themes';
import { ShaderBackground } from '@/app/components/ShaderBackground';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Theme
          accentColor="purple"  // Changes the primary interactive color
          grayColor="slate"     // Changes the neutral color palette
          radius="medium"       // Changes border radius
        >
          <div className="wrapper">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-purple-950 border-b border-gray-100">
              <div className="2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center">
                    <Link href="/" className="text-2xl font-bold text-pink-700 mr-1">
                      Felt Sense
                    </Link>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart" style={{ width: '30px', height: '30px', color: 'red' }}>
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                  <div className="flex gap-x-4">
                    <div>
                      <ChatButton />
                    </div>
                    <div>
                      <ChatHistoryButton />
                    </div>
                    <div>
                      <SignInButton />
                    </div>
                  </div>
                </div>
              </div>
            </nav>
            <ShaderBackground />
            <main className="pt-16">
              <AuthKitProvider>{children}</AuthKitProvider>
            </main>
          </div>
        </Theme>
      </body>
    </html>
  );
}
