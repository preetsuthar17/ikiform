import { Layers, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { BlockManagerHeaderProps } from "../types";

export function BlockManagerHeader({
  blocksCount,
  onBlockAdd,
}: BlockManagerHeaderProps) {
  const handleAddBlock = () => {
    onBlockAdd();
  };

  const handleAddBlockKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleAddBlock();
    }
  };

  return (
    <Card className="p-0 shadow-none">
      <CardContent className="p-4">
        <div className="flex flex-col flex-wrap gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-1 flex-row items-center gap-3 sm:flex-row">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Layers className="size-5 text-primary" />
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <h3 className="truncate font-semibold text-base text-foreground sm:text-lg">
                Form Structure
              </h3>
              <div className="flex xs:flex-row flex-col xs:items-center gap-0.5 xs:gap-2">
                <Badge
                  className="mb-0.5 xs:mb-0 w-fit text-xs"
                  variant="secondary"
                >
                  {blocksCount} {blocksCount === 1 ? "step" : "steps"}
                </Badge>
                <p className="max-w-xs truncate text-muted-foreground text-sm sm:max-w-full">
                  Organize your form into logical sections
                </p>
              </div>
            </div>
          </div>

          <Button
            aria-label="Add new step to form"
            className="w-full gap-2 sm:w-auto"
            onClick={handleAddBlock}
            onKeyDown={handleAddBlockKeyDown}
            size="sm"
            variant="default"
          >
            <Plus className="size-4" />
            Add Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
