import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'API_DOCUMENTATION.md');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Failed to read documentation:', error);
    return NextResponse.json(
      { error: 'Failed to load documentation' },
      { status: 500 }
    );
  }
}
