import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { BlockManagerHeaderProps } from "../types";

export function BlockManagerHeader({
  blocksCount,
  onBlockAdd,
}: BlockManagerHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Form Structure</h3>
          <p className="text-muted-foreground text-sm">
            {blocksCount} {blocksCount === 1 ? "step" : "steps"}
          </p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={onBlockAdd}
          size="sm"
        >
          <Plus className="size-4" />
          Add Step
        </Button>
      </div>
    </div>
  );
}
