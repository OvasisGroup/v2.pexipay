export default function HelpCenterPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Help Center</h1>
      <p className="text-gray-700 mb-6">Find guides, troubleshooting tips, and developer documentation to get the most out of Pexipay.</p>
      <ul className="list-disc pl-6 space-y-2 text-sm text-gray-600">
        <li><a href="/faq" className="text-primary hover:underline">Frequently Asked Questions</a></li>
        <li><a href="/docs/api-documentation" className="text-primary hover:underline">API Documentation</a></li>
        <li><a href="/support" className="text-primary hover:underline">Contact Support</a></li>
      </ul>
    </main>
  );
}
