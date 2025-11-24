import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from '@/components/ClientLayout';


export const metadata: Metadata = {
  title: "PexiPay - Payment Service Provider Platform",
  description: "Complete PSP solution with super-merchant management, KYC workflows, fraud detection, and seamless CircoFlows integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
