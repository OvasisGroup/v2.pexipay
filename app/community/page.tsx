import Link from 'next/link';

export default function DeveloperCommunityPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-4xl">
            <Link href="/" className="inline-flex items-center text-sm text-white/80 hover:text-white mb-6 transition">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Developer Community</h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Join thousands of developers building the future of card-to-crypto payments with Pexipay&apos;s powerful APIs and tools
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-16">
        {/* Stats Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center hover:shadow-md transition">
              <div className="text-4xl font-bold text-primary mb-2">10k+</div>
              <div className="text-sm font-medium text-gray-600">Active Developers</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center hover:shadow-md transition">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm font-medium text-gray-600">Integrated Apps</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center hover:shadow-md transition">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm font-medium text-gray-600">API Uptime</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center hover:shadow-md transition">
              <div className="text-4xl font-bold text-primary mb-2">50ms</div>
              <div className="text-sm font-medium text-gray-600">Avg Response</div>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Quick Start Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Quick Start</h2>
              </div>
              
              <ol className="space-y-6 mb-8">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <strong className="text-gray-900 block mb-1">Sign up for API access</strong>
                    <p className="text-sm text-gray-600">Create your developer account and get instant API keys</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <strong className="text-gray-900 block mb-1">Install our SDK</strong>
                    <p className="text-sm text-gray-600">Available for Node.js, Python, PHP, Ruby, and more</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <strong className="text-gray-900 block mb-1">Make your first API call</strong>
                    <p className="text-sm text-gray-600">Process your first card-to-crypto payment</p>
                  </div>
                </li>
              </ol>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Sample API Call</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-auto">
                  <code>curl https://api.pexipay.com/v1/payments</code>
                </pre>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  href="/dashboard/api-keys" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Get API Keys
                </Link>
                <Link 
                  href="/docs/api-documentation" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Docs
                </Link>
              </div>
            </div>
          </div>

          {/* Developer Resources Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Resources</h2>
              </div>
              
              <div className="space-y-4">
                <Link href="/docs/api-documentation" className="block p-3 rounded-lg hover:bg-gray-50 transition group">
                  <div className="font-medium text-gray-900 group-hover:text-primary mb-1">API Documentation</div>
                  <div className="text-sm text-gray-600">Complete reference with examples</div>
                </Link>
                <Link href="/docs/sdk" className="block p-3 rounded-lg hover:bg-gray-50 transition group">
                  <div className="font-medium text-gray-900 group-hover:text-primary mb-1">SDK Libraries</div>
                  <div className="text-sm text-gray-600">Official libraries for all languages</div>
                </Link>
                <Link href="/docs/code-examples" className="block p-3 rounded-lg hover:bg-gray-50 transition group">
                  <div className="font-medium text-gray-900 group-hover:text-primary mb-1">Code Examples</div>
                  <div className="text-sm text-gray-600">Ready-to-use code snippets</div>
                </Link>
                <Link href="/docs/webhooks" className="block p-3 rounded-lg hover:bg-gray-50 transition group">
                  <div className="font-medium text-gray-900 group-hover:text-primary mb-1">Webhooks Guide</div>
                  <div className="text-sm text-gray-600">Real-time payment notifications</div>
                </Link>
                <Link href="/docs/testing" className="block p-3 rounded-lg hover:bg-gray-50 transition group">
                  <div className="font-medium text-gray-900 group-hover:text-primary mb-1">Testing Guide</div>
                  <div className="text-sm text-gray-600">Sandbox and test scenarios</div>
                </Link>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Join Our Community</h3>
                <div className="space-y-3">
                  <a 
                    href="https://discord.gg/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition group"
                  >
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm group-hover:text-primary">Discord</div>
                      <div className="text-xs text-gray-600">Chat with developers</div>
                    </div>
                  </a>
                  <a 
                    href="https://github.com/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition group"
                  >
                    <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm group-hover:text-primary">GitHub</div>
                      <div className="text-xs text-gray-600">Open-source SDKs</div>
                    </div>
                  </a>
                  <Link 
                    href="/community/forum" 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition group"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm group-hover:text-primary">Forum</div>
                      <div className="text-xs text-gray-600">Ask questions</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Developers Choose Pexipay</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Build with confidence using our enterprise-grade payment infrastructure
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h4>
              <p className="text-gray-600">Sub-50ms API response times with 99.99% uptime SLA. Your customers will never wait.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Enterprise Security</h4>
              <p className="text-gray-600">PCI DSS Level 1 compliant, end-to-end encryption, and secure key management built-in.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Global Coverage</h4>
              <p className="text-gray-600">Process payments worldwide with support for 150+ countries and multiple currencies.</p>
            </div>
          </div>
        </section>

        {/* SDK Libraries Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Official SDK Libraries</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose your preferred language and start integrating in minutes with our production-ready SDKs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <a href="/docs/sdk/javascript/README.md" target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg hover:border-yellow-300 transition group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-yellow-600 transition">JavaScript/TypeScript</h3>
                  <p className="text-sm text-gray-500">@pexipay/sdk</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Perfect for Node.js, React, Next.js, and modern JavaScript applications. Full TypeScript support included.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>npm install @pexipay/sdk</span>
              </div>
            </a>

            <a href="/docs/sdk/python/README.md" target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg hover:border-blue-300 transition group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">Python</h3>
                  <p className="text-sm text-gray-500">pexipay</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Ideal for Django, Flask, FastAPI, and Python applications. Full type hints and async support.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>pip install pexipay</span>
              </div>
            </a>

            <a href="/docs/sdk/php/README.md" target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg hover:border-purple-300 transition group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.01 10.207h-.944l-.515 2.648h.838c.556 0 .97-.105 1.242-.314.272-.21.455-.559.55-1.049.092-.47.05-.802-.124-.995-.175-.193-.523-.29-1.047-.29zM12 5.688C5.373 5.688 0 8.514 0 12s5.373 6.313 12 6.313S24 15.486 24 12c0-3.486-5.373-6.312-12-6.312zm-3.26 7.451c-.261.25-.575.438-.917.551-.336.108-.765.164-1.285.164H5.357l-.327 1.681H3.652l1.23-6.326h2.65c.797 0 1.378.209 1.744.628.366.418.476 1.002.33 1.752a2.836 2.836 0 0 1-.305.847c-.143.255-.33.49-.561.703zm4.024.715l.543-2.799c.063-.318.039-.536-.068-.651-.107-.116-.336-.174-.687-.174h-.884l-.654 3.379H9.651l1.23-6.326h1.367l-.327 1.682h1.218c.767 0 1.295.134 1.586.401s.378.7.263 1.299l-.572 2.944h-1.379zm7.597-2.265a2.782 2.782 0 0 1-.305.847c-.143.255-.33.49-.561.703a2.44 2.44 0 0 1-.917.551c-.336.108-.765.164-1.286.164h-1.18l-.327 1.682h-1.378l1.23-6.326h2.649c.797 0 1.378.209 1.744.628.366.417.477 1.001.331 1.751zM17.766 10.207h-.943l-.516 2.648h.838c.557 0 .971-.105 1.242-.314.272-.21.455-.559.551-1.049.092-.47.049-.802-.124-.995s-.524-.29-1.048-.29z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition">PHP</h3>
                  <p className="text-sm text-gray-500">pexipay/sdk</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Perfect for WordPress, Laravel, Symfony, and PHP applications. PSR-4 autoloading included.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>composer require pexipay/sdk</span>
              </div>
            </a>
          </div>

          <div className="text-center">
            <a 
              href="/docs/sdk/index.md" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:opacity-90 transition shadow-md"
            >
              View Complete SDK Documentation
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-12 lg:p-16 text-center">
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Start Building?</h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join the Pexipay developer community today and start accepting card-to-crypto payments in your applications
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/signup" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
              >
                Get Started Free
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white/10 transition"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
