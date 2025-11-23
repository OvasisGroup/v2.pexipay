'use client';

import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

interface Merchant {
  id: string;
  name: string;
  businessName: string;
  email: string;
}

interface Reviewer {
  id: string;
  name: string;
  email: string;
}

interface KYCDocument {
  id: string;
  superMerchantId: string | null;
  merchantId: string | null;
  documentType: string;
  status: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  reviewedById: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  autoCheckStatus: string | null;
  uploadedAt: string;
  expiresAt: string | null;
  Merchant: Merchant | null;
  SuperMerchant: Merchant | null;
  User: Reviewer | null;
}

export default function KYCContent() {
  const [documents, setDocuments] = useState<KYCDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDoc, setSelectedDoc] = useState<KYCDocument | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewStatus, setReviewStatus] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null);
  const documentsPerPage = 10;

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchDocuments = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/admin/kyc', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      } else {
        showToast('Failed to fetch KYC documents', 'error');
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      showToast('Failed to fetch KYC documents', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const openReviewModal = (doc: KYCDocument) => {
    setSelectedDoc(doc);
    setReviewStatus(doc.status);
    setReviewNotes(doc.reviewNotes || '');
    setShowModal(true);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/admin/kyc/${selectedDoc.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: reviewStatus,
          reviewNotes,
        }),
      });

      if (response.ok) {
        showToast('Document reviewed successfully', 'success');
        setShowModal(false);
        setSelectedDoc(null);
        setReviewStatus('');
        setReviewNotes('');
        fetchDocuments();
      } else {
        showToast('Failed to review document', 'error');
      }
    } catch (error) {
      console.error('Failed to review document:', error);
      showToast('Failed to review document', 'error');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PENDING_REVIEW':
      case 'UPLOADED':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentTypeName = (type: string) => {
    return type.replace(/_/g, ' ');
  };

  const filteredDocuments = documents.filter(d => 
    filter === 'ALL' ? true : d.status === filter
  );

  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * documentsPerPage,
    currentPage * documentsPerPage
  );

  const pendingCount = documents.filter(d => d.status === 'PENDING_REVIEW' || d.status === 'UPLOADED').length;
  const approvedCount = documents.filter(d => d.status === 'APPROVED').length;
  const rejectedCount = documents.filter(d => d.status === 'REJECTED').length;

  if (loading) {
    return (
      <DashboardLayout requiredRole="ADMIN">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading KYC documents...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="ADMIN">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">KYC Document Management</h1>
            <p className="text-gray-600 mt-1">Review and manage merchant KYC documents</p>
          </div>
          <button
            onClick={() => {
              const pendingDocs = documents.filter(d => d.status === 'UPLOADED' || d.status === 'PENDING_REVIEW');
              if (pendingDocs.length > 0) {
                openReviewModal(pendingDocs[0]);
              } else {
                showToast('No pending documents to review', 'error');
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Start Review
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Total Documents</div>
                <div className="text-3xl font-bold text-gray-900">{documents.length}</div>
              </div>
              <div className="shrink-0 w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Pending Review</div>
                <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
              </div>
              <div className="shrink-0 w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Approved</div>
                <div className="text-3xl font-bold text-green-600">{approvedCount}</div>
              </div>
              <div className="shrink-0 w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Rejected</div>
                <div className="text-3xl font-bold text-red-600">{rejectedCount}</div>
              </div>
              <div className="shrink-0 w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex gap-2">
            {['ALL', 'UPLOADED', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED'].map(status => (
              <button
                key={status}
                onClick={() => {
                  setFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Merchant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reviewed By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No documents found
                    </td>
                  </tr>
                ) : (
                  paginatedDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {getDocumentTypeName(doc.documentType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {doc.Merchant?.businessName || doc.SuperMerchant?.businessName || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {doc.Merchant?.email || doc.SuperMerchant?.email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doc.fileName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(doc.status)}`}>
                          {doc.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doc.User?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900 cursor-pointer"
                          >
                            View
                          </a>
                          {(doc.status === 'UPLOADED' || doc.status === 'PENDING_REVIEW') && (
                            <button
                              onClick={() => openReviewModal(doc)}
                              className="text-green-600 hover:text-green-900 cursor-pointer"
                            >
                              Review
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredDocuments.length > documentsPerPage && (
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * documentsPerPage) + 1} to{' '}
                {Math.min(currentPage * documentsPerPage, filteredDocuments.length)} of{' '}
                {filteredDocuments.length} documents
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredDocuments.length / documentsPerPage)))}
                  disabled={currentPage >= Math.ceil(filteredDocuments.length / documentsPerPage)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Review Modal */}
        {showModal && selectedDoc && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Review Document</h2>
              </div>
              <form onSubmit={submitReview} className="px-6 py-4 space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Merchant:</strong> {selectedDoc.Merchant?.businessName || selectedDoc.SuperMerchant?.businessName}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Document Type:</strong> {getDocumentTypeName(selectedDoc.documentType)}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>File:</strong> {selectedDoc.fileName}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <strong>Uploaded:</strong> {new Date(selectedDoc.uploadedAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    required
                    value={reviewStatus}
                    onChange={(e) => setReviewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PENDING_REVIEW">Pending Review</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Review Notes
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter review notes..."
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedDoc(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          } text-white`}>
            {toast.message}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
