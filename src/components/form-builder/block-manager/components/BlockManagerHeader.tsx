// Components
import { Button } from "@/components/ui/button";

// Icons
import { Plus } from "lucide-react";

// Types
import type { BlockManagerHeaderProps } from "../types";

export function BlockManagerHeader({
  blocksCount,
  onBlockAdd,
}: BlockManagerHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b bg-muted/30">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Form Structure</h3>
          <p className="text-sm text-muted-foreground">
            {blocksCount} {blocksCount === 1 ? "step" : "steps"}
          </p>
        </div>
        <Button
          size="sm"
          onClick={onBlockAdd}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Step
        </Button>
      </div>
    </div>
  );
}
