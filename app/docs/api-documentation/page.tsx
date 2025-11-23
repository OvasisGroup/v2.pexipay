import DashboardLayout from '@/components/DashboardLayout';
import fs from 'fs';
import path from 'path';
import MarkdownContent from './MarkdownContent';

export default async function APIDocumentationPage() {
  // Read the markdown file on the server
  const filePath = path.join(process.cwd(), 'API_DOCUMENTATION.md');
  const content = fs.readFileSync(filePath, 'utf-8');

  return (
    <DashboardLayout requiredRole="ANY">
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <MarkdownContent content={content} />
        </div>
      </div>
    </DashboardLayout>
  );
}
