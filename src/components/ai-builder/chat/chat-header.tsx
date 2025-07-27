import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function ChatHeader() {
  return (
    <div className="border-b bg-card/50 backdrop-blur">
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <Button asChild size="icon" variant="ghost">
            <Link href="/form-builder">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="font-semibold text-lg">Kiko AI</h1>
        </div>
      </div>
    </div>
  );
}
