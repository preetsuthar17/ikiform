import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioItem } from "@/components/ui/radio";
import type { LocalSettings } from "../types";
import { Palette } from "lucide-react";

interface DesignSectionProps {
  localSettings: LocalSettings;
  updateSettings: (updates: Partial<LocalSettings>) => void;
}

export function DesignSection({
  localSettings,
  updateSettings,
}: DesignSectionProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Palette className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-medium">Form Design</h3>
      </div>
      <div className="flex flex-col gap-4 border-l-2 border-muted pl-6">
        <Label className="mb-2">Form Design Mode</Label>
        <RadioGroup
          value={localSettings.designMode || "default"}
          onValueChange={(value) =>
            updateSettings({ designMode: value as "default" | "minimal" })
          }
          orientation="horizontal"
        >
          <RadioItem value="default" label="Default" />
          <RadioItem value="minimal" label="Minimal" />
        </RadioGroup>
        <div className="flex gap-6 mt-6">
          <div className="flex flex-col items-center gap-2 flex-1">
            <span className="text-xs font-medium">Default</span>
            <Card className="rounded-ele flex flex-col gap-3 w-56 h-32 justify-center items-center bg-accent border border-primary/10">
              <span className="text-foreground font-semibold">Form Title</span>
              <span className="text-muted-foreground text-xs">
                Form description
              </span>
              <button className="bg-primary text-primary-foreground rounded px-3 py-1 text-xs mt-2">
                Submit
              </button>
            </Card>
          </div>
          <div className="flex flex-col items-center gap-2 flex-1">
            <span className="text-xs font-medium">Minimal</span>
            <Card className="rounded-ele flex flex-col gap-3 w-56 h-32 justify-center items-center bg-transparent border-none shadow-none">
              <span className="text-foreground font-semibold">Form Title</span>
              <span className="text-muted-foreground text-xs">
                Form description
              </span>
              <button className="bg-primary text-primary-foreground rounded px-3 py-1 text-xs mt-2">
                Submit
              </button>
            </Card>
          </div>
        </div>
      </div>
    </Card>
  );
}
