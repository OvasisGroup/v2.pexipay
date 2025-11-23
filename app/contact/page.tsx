"use client";

import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setError(null);

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, company, message }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Submission failed');
      setStatus('success');
      setName(''); setEmail(''); setPhone(''); setCompany(''); setMessage('');
    } catch (err: any) {
      setStatus('error');
      setError(err?.message || 'Unknown error');
    }
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <img src="/images/pexipay.png" alt="Pexipay" className="w-40 h-auto mb-6 object-contain" />
            <h1 className="text-2xl font-bold mb-4">Contact Us</h1>

            <p className="text-gray-700 mb-4">We tap into modern payment methods that help your business grow. We help you accept global debit and credit card payments for all card brands and local payment methods.</p>

            <p className="text-gray-700 font-medium mb-1">info@pexipay.com</p>
            <p className="text-sm text-gray-600 mb-6">For any questions</p>
          </div>

        <div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Work With Us</h2>
            <p className="text-sm text-gray-600 mb-6">Fill out the form below to get in touch with us.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                aria-label="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border p-2"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <input
                aria-label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                required
                className="mt-1 block w-full rounded-md border p-2"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <input
                aria-label="Phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="mt-1 block w-full rounded-md border p-2"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <input
                aria-label="Company"
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="mt-1 block w-full rounded-md border p-2"
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <textarea
                aria-label="Message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border p-2 h-32"
                placeholder="Enter your message"
              />
            </div>

            <div>
              <button type="submit" disabled={status==='loading'} className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md">
                {status === 'loading' ? 'Sending...' : 'Contact Us'}
              </button>
            </div>

            {status === 'success' && <p className="text-sm text-green-600">Thanks — we received your message and will be in touch shortly.</p>}
            {status === 'error' && <p className="text-sm text-red-600">{error}</p>}
          </form>
        </div>
      </div>
    </main>
  );
}

