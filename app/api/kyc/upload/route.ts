import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/prisma';
import { DocumentType } from '@prisma/client';
import { randomBytes } from 'crypto';

const VALID_DOCUMENT_TYPES: DocumentType[] = [
  'BUSINESS_LICENSE',
  'TAX_CERTIFICATE',
  'BANK_STATEMENT',
  'ID_PROOF',
  'ADDRESS_PROOF',
  'OTHER'
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const documentType = formData.get('documentType') as string;
    const merchantId = formData.get('merchantId') as string;
    const superMerchantId = formData.get('superMerchantId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!documentType) {
      return NextResponse.json(
        { error: 'Document type is required' },
        { status: 400 }
      );
    }

    // Validate document type
    if (!VALID_DOCUMENT_TYPES.includes(documentType as DocumentType)) {
      return NextResponse.json(
        { error: 'Invalid document type' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPG, PNG, and PDF files are allowed' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'kyc');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const filename = `${timestamp}_${randomString}.${fileExtension}`;
    const filepath = join(uploadsDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Save document record to database
    const fileUrl = `/uploads/kyc/${filename}`;
    
    const document = await prisma.kYCDocument.create({
      data: {
        id: randomBytes(16).toString('hex'),
        merchantId: merchantId || null,
        superMerchantId: superMerchantId || null,
        documentType: documentType as DocumentType,
        fileUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        status: 'PENDING_REVIEW',
      },
    });

    return NextResponse.json({
      message: 'Document uploaded successfully',
      document: {
        id: document.id,
        fileUrl: document.fileUrl,
        fileName: document.fileName,
        documentType: document.documentType,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}
