'use client';

import { Download, Gift, Loader2, Upload } from 'lucide-react';
import { useState } from 'react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface RedemptionCodeManagerProps {
  isAdmin?: boolean;
}

export function RedemptionCodeManager({
  isAdmin = false,
}: RedemptionCodeManagerProps) {
  const [generateCount, setGenerateCount] = useState('1000');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            Admin access required to manage redemption codes.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const generateCodes = () => {
    const count = Number.parseInt(generateCount);
    if (count <= 0 || count > 10_000) {
      setMessage({ type: 'error', text: 'Count must be between 1 and 10,000' });
      return;
    }

    setIsGenerating(true);
    setMessage(null);

    // Generate codes on client side
    const codes = [];
    const usedCodes = new Set();

    while (codes.length < count) {
      const code = generateRedemptionCode();
      if (!usedCodes.has(code)) {
        codes.push(code);
        usedCodes.add(code);
      }
    }

    setGeneratedCodes(codes);
    setIsGenerating(false);
    setMessage({
      type: 'success',
      text: `Generated ${codes.length} unique codes`,
    });
  };

  const generateRedemptionCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = ['XXXX', 'XXXX', 'XXXX'];

    return segments
      .map((segment) =>
        segment
          .split('')
          .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
          .join('')
      )
      .join('-');
  };

  const downloadCSV = () => {
    if (generatedCodes.length === 0) {
      setMessage({ type: 'error', text: 'No codes to download' });
      return;
    }

    const csvContent = [
      'code,is_active,max_uses,current_uses,expires_at,metadata',
      ...generatedCodes.map((code) => `${code},true,1,0,,"{}"`),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `redemption-codes-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const uploadToDatabase = async () => {
    if (generatedCodes.length === 0) {
      setMessage({ type: 'error', text: 'No codes to upload' });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/redemption-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codes: generatedCodes }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `Successfully uploaded ${result.insertedCount} codes to database`,
        });
        setGeneratedCodes([]); // Clear generated codes after successful upload
      } else {
        setMessage({
          type: 'error',
          text: result.message || 'Failed to upload codes',
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error uploading codes to database' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-primary/10 p-2">
              <Gift className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Redemption Code Manager</CardTitle>
              <CardDescription>
                Generate and manage redemption codes for premium access
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Generate Codes Section */}
          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-lg">Generate Codes</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label
                  className="mb-2 block font-medium text-sm"
                  htmlFor="count"
                >
                  Number of codes to generate
                </label>
                <Input
                  id="count"
                  max="10000"
                  min="1"
                  onChange={(e) => setGenerateCount(e.target.value)}
                  placeholder="1000"
                  type="number"
                  value={generateCount}
                />
              </div>
              <div className="flex items-end">
                <Button
                  className="min-w-[120px]"
                  disabled={isGenerating}
                  onClick={generateCodes}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Codes'
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          {generatedCodes.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="font-medium text-lg">Actions</h3>
              <div className="flex gap-4">
                <Button
                  className="flex items-center gap-2"
                  onClick={downloadCSV}
                  variant="outline"
                >
                  <Download className="h-4 w-4" />
                  Download CSV
                </Button>
                <Button
                  className="flex items-center gap-2"
                  disabled={isUploading}
                  onClick={uploadToDatabase}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload to Database
                    </>
                  )}
                </Button>
              </div>
              <p className="text-muted-foreground text-sm">
                Generated {generatedCodes.length} codes. You can download them
                as CSV or upload directly to the database.
              </p>
            </div>
          )}

          {/* Message */}
          {message && (
            <Alert
              dismissible
              onDismiss={() => setMessage(null)}
              variant={message.type === 'error' ? 'destructive' : 'success'}
            >
              {message.text}
            </Alert>
          )}

          {/* Preview Section */}
          {generatedCodes.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="font-medium text-lg">Preview (First 10 codes)</h3>
              <div className="max-h-40 overflow-y-auto rounded-md bg-muted p-4">
                <div className="grid grid-cols-1 gap-1 font-mono text-sm">
                  {generatedCodes.slice(0, 10).map((code, index) => (
                    <div className="text-muted-foreground" key={index}>
                      {code}
                    </div>
                  ))}
                  {generatedCodes.length > 10 && (
                    <div className="text-muted-foreground italic">
                      ... and {generatedCodes.length - 10} more codes
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
