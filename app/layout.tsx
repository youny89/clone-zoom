import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import "@stream-io/video-react-sdk/dist/css/styles.css"
import "react-datepicker/dist/react-datepicker.css"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZoomClone",
  description: "Video calling app",
  icons: {
    icon:"/icons/logo.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-dark-2`}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
