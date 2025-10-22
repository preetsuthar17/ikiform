import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function ChatHeader() {
  return (
    <div className="bg-card/50 backdrop-blur">
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <Button
            aria-label="Back to form builder"
            asChild
            size="icon"
            variant="outline"
          >
            <Link href="/form-builder">
              <ArrowLeft aria-hidden className="size-4" />
            </Link>
          </Button>
          <h1 className="font-semibold text-lg">Kiko AI</h1>
        </div>
      </div>
      <Separator />
    </div>
  );
}
