'use client';

import { Card } from '@/components/ui/card';
import { FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  url?: string;
}

interface DocumentListProps {
  documents: Document[];
}

export function DocumentList({ documents }: DocumentListProps) {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Comprobantes Emitidos</h2>
      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate text-sm">{doc.name}</p>
                <p className="text-xs text-muted-foreground">{doc.date}</p>
              </div>
            </div>
            <div className="flex gap-1 ml-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
