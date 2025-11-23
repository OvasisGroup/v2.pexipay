'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { DocumentArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

type AccountType = 'merchant' | 'super-merchant';

interface UploadedDocument {
  file: File;
  documentType: string;
  preview?: string;
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [accountType, setAccountType] = useState<AccountType>('merchant');
  const [loading, setLoading] = useState(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [country, setCountry] = useState('');
  const [taxId, setTaxId] = useState('');
  
  // Document upload state
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'super-merchant') {
      setAccountType('super-merchant');
    }
  }, [searchParams]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, and PDF files are allowed');
      return;
    }

    // Create preview for images
    let preview: string | undefined;
    if (file.type.startsWith('image/')) {
      preview = URL.createObjectURL(file);
    }

    // Check if document type already exists
    const existingIndex = documents.findIndex(doc => doc.documentType === docType);
    if (existingIndex >= 0) {
      // Replace existing document
      const newDocs = [...documents];
      newDocs[existingIndex] = { file, documentType: docType, preview };
      setDocuments(newDocs);
    } else {
      // Add new document
      setDocuments([...documents, { file, documentType: docType, preview }]);
    }

    toast.success(`${file.name} selected`);
  };

  const removeDocument = (docType: string) => {
    setDocuments(documents.filter(doc => doc.documentType !== docType));
  };

  const uploadDocuments = async (entityId: string, entityType: 'merchant' | 'super-merchant') => {
    if (documents.length === 0) return;

    const uploadPromises = documents.map(async (doc) => {
      const formData = new FormData();
      formData.append('file', doc.file);
      formData.append('documentType', doc.documentType);
      
      if (entityType === 'merchant') {
        formData.append('merchantId', entityId);
      } else {
        formData.append('superMerchantId', entityId);
      }

      const response = await fetch('/api/kyc/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload document');
      }

      return response.json();
    });

    try {
      await Promise.all(uploadPromises);
      toast.success('All documents uploaded successfully');
    } catch (error) {
      console.error('Document upload error:', error);
      toast.error('Some documents failed to upload');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    // Validate documents
    if (documents.length < 3) {
      toast.error('Please upload at least 3 documents (Business License, Tax Certificate, and ID Proof are required)');
      return;
    }

    // Check required documents
    const requiredDocs = ['BUSINESS_LICENSE', 'TAX_CERTIFICATE', 'ID_PROOF'];
    const uploadedTypes = documents.map(d => d.documentType);
    const missingDocs = requiredDocs.filter(doc => !uploadedTypes.includes(doc));
    
    if (missingDocs.length > 0) {
      toast.error(`Missing required documents: ${missingDocs.join(', ')}`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          role: accountType === 'super-merchant' ? 'SUPER_MERCHANT' : 'MERCHANT',
          businessName,
          businessType,
          country,
          taxId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Upload documents
      const entityId = accountType === 'super-merchant' ? data.superMerchantId : data.merchantId;
      await uploadDocuments(entityId, accountType);

      // Store token and redirect
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast.success('Account created successfully! Welcome to PexiPay!');

      // Redirect to appropriate dashboard
      if (accountType === 'super-merchant') {
        router.push('/super-merchant/dashboard');
      } else {
        router.push('/merchant/dashboard');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Join PexiPay and start accepting payments</p>
        </div>

        {/* Account Type Selector */}
        <div className="mb-8 flex gap-4">
          <button
            type="button"
            onClick={() => setAccountType('merchant')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
              accountType === 'merchant'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Merchant Account
          </button>
          <button
            type="button"
            onClick={() => setAccountType('super-merchant')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
              accountType === 'super-merchant'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Super-Merchant Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <input
                  id="businessName"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Acme Corporation"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type
                  </label>
                  <select
                    id="businessType"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select type...</option>
                    <option value="LLC">LLC</option>
                    <option value="Corporation">Corporation</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                    <option value="Non-Profit">Non-Profit</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select country...</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="ES">Spain</option>
                    <option value="IT">Italy</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-2">
                  Tax ID / EIN
                </label>
                <input
                  id="taxId"
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="12-3456789"
                />
              </div>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">KYC Documents</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please upload the following documents to verify your business. Accepted formats: JPG, PNG, PDF (max 10MB each)
            </p>
            
            <div className="space-y-4">
              {/* Business License */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business License *
                </label>
                {documents.find(d => d.documentType === 'BUSINESS_LICENSE') ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <DocumentArrowUpIcon className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm text-green-900">
                        {documents.find(d => d.documentType === 'BUSINESS_LICENSE')?.file.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument('BUSINESS_LICENSE')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <div className="text-center">
                      <DocumentArrowUpIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-600">Click to upload business license</span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      onChange={(e) => handleFileSelect(e, 'BUSINESS_LICENSE')}
                    />
                  </label>
                )}
              </div>

              {/* Tax Certificate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Certificate *
                </label>
                {documents.find(d => d.documentType === 'TAX_CERTIFICATE') ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <DocumentArrowUpIcon className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm text-green-900">
                        {documents.find(d => d.documentType === 'TAX_CERTIFICATE')?.file.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument('TAX_CERTIFICATE')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <div className="text-center">
                      <DocumentArrowUpIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-600">Click to upload tax certificate</span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      onChange={(e) => handleFileSelect(e, 'TAX_CERTIFICATE')}
                    />
                  </label>
                )}
              </div>

              {/* ID Proof */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Proof (Passport/Driver&apos;s License) *
                </label>
                {documents.find(d => d.documentType === 'ID_PROOF') ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <DocumentArrowUpIcon className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm text-green-900">
                        {documents.find(d => d.documentType === 'ID_PROOF')?.file.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument('ID_PROOF')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <div className="text-center">
                      <DocumentArrowUpIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-600">Click to upload ID proof</span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      onChange={(e) => handleFileSelect(e, 'ID_PROOF')}
                    />
                  </label>
                )}
              </div>

              {/* Bank Statement (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Statement (Optional)
                </label>
                {documents.find(d => d.documentType === 'BANK_STATEMENT') ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <DocumentArrowUpIcon className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm text-green-900">
                        {documents.find(d => d.documentType === 'BANK_STATEMENT')?.file.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument('BANK_STATEMENT')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <div className="text-center">
                      <DocumentArrowUpIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-600">Click to upload bank statement</span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      onChange={(e) => handleFileSelect(e, 'BANK_STATEMENT')}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              required
              className="h-4 w-4 mt-1 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the{' '}
              <Link href="/terms" className="text-secondary hover:text-secondary/80">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition ${
              accountType === 'super-merchant'
                ? 'bg-secondary hover:bg-secondary/90 focus:ring-secondary'
                : 'bg-primary hover:bg-primary/90 focus:ring-primary'
            }`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-secondary hover:text-secondary/80 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
