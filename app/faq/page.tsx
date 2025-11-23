"use client";

import Link from 'next/link';
import Accordion from '@/components/Accordion';

export default function FAQPage() {
  const faqs: { q: string; a: string }[] = [
    {
      q: 'What is a high risk merchant account?',
      a: 'A high risk merchant account is a payment processing account for businesses that operate in industries with elevated fraud, chargeback, or regulatory risk. These merchants typically face higher underwriting scrutiny and may have different fees, reserve requirements, or contract terms.'
    },
    {
      q: 'How to open a high risk merchant account?',
      a: 'To open a high risk merchant account, prepare detailed information about your business model, processing history, projected volumes, and customer protections. Submit KYC/AML documentation, and work with a provider (like PexiPay) that specializes in high risk underwriting to evaluate and onboard your business.'
    },
    {
      q: 'What is high risk credit card processing?',
      a: 'High risk credit card processing refers to payment acceptance for industries with higher rates of chargebacks, fraud, or regulatory oversight. Processors apply stricter controls, monitoring, and sometimes higher fees to mitigate risk.'
    },
    {
      q: 'What is the difference between a payment gateway vs a payment processor vs a merchant account?',
      a: 'A payment gateway securely captures and transmits transaction data from your site to the payment network. A payment processor routes transactions between the gateway and card networks/issuers. A merchant account is the bank account (or settlement mechanism) that receives funds from processed transactions. PexiPay can provide or integrate with these components as a full-stack PSP.'
    },
    {
      q: 'What Payment Processing Methods Does Pexipay Support?',
      a: 'PexiPay supports card payments (including 3DS), tokenization, hosted payment pages, and integrations with major payment networks. Contact sales for custom integrations or alternative payment methods.'
    },
    {
      q: 'How does Pexipay keep transactions secure?',
      a: 'We use industry best practices: TLS for all network traffic, strong encryption for sensitive data, PCI-compliant tokenization, role-based access control, and fraud detection systems including velocity checks and pattern scoring.'
    },
    {
      q: 'What makes Pexipay one of the best high risk payment processors?',
      a: 'PexiPay combines specialized high risk underwriting, flexible API integrations, robust fraud controls, and a merchant-first onboarding process that minimizes downtime and helps maximize approval rates.'
    },
    {
      q: 'Does Pexipay have a rolling reserve requirement?',
      a: 'Reserve requirements depend on underwriting results. Some high risk merchants may have rolling reserves or holdbacks based on risk profile. Terms are determined during onboarding and outlined in your merchant agreement.'
    },
    {
      q: 'Does Pexipay have merchant account termination fees?',
      a: 'Termination fees vary by contract. We aim for transparent terms and will disclose any applicable termination or early-exit fees during the onboarding and agreement process.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
            <p className="text-gray-600 mt-2">Answers to common questions about PexiPay and high risk payment processing.</p>
          </div>
          <div>
            <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Accordion items={faqs.map((f, i) => ({ id: i, q: f.q, a: f.a }))} singleOpen className="col-span-2 md:col-span-2" />
        </div>
      </div>
    </div>
  );
}
