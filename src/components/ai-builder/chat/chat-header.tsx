import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ChatHeader() {
  return (
    <div className="border-b bg-card/50 backdrop-blur">
      <div className="flex items-center justify-between p-4 gap-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link href="/form-builder">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold">Kiko AI</h1>
        </div>
      </div>
    </div>
  );
}
