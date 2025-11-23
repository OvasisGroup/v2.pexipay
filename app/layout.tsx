import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Footer from '@/components/Footer';


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
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        {children}
        <Footer />
      </body>
    </html>
  );
}
