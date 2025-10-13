"use client";

import { Button } from "@/components/ui/button-base";
import { Input } from "@/components/ui/input-base";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { EmbedConfig } from "./EmbedCustomizer";

interface EmbedSettingsProps {
  config: EmbedConfig;
  updateConfig: (updates: Partial<EmbedConfig>) => void;
}

export default function EmbedSettings({
  config,
  updateConfig,
}: EmbedSettingsProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Dimensions */}
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">Dimensions</h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>Width</Label>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                onChange={(e) => updateConfig({ width: e.target.value })}
                placeholder="e.g., 100%, 800px"
                value={config.width}
              />
              <Button
                onClick={() => updateConfig({ width: "100%" })}
                size="sm"
                variant="outline"
              >
                100%
              </Button>
              <Button
                onClick={() => updateConfig({ width: "800px" })}
                size="sm"
                variant="outline"
              >
                800px
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Height</Label>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                onChange={(e) => updateConfig({ height: e.target.value })}
                placeholder="e.g., 600px, 100vh"
                value={config.height}
              />
              <Button
                onClick={() => updateConfig({ height: "600px" })}
                size="sm"
                variant="outline"
              >
                600px
              </Button>
              <Button
                onClick={() => updateConfig({ height: "800px" })}
                size="sm"
                variant="outline"
              >
                800px
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={config.responsive}
            onCheckedChange={(checked) => updateConfig({ responsive: checked })}
          />
          <Label>Make responsive (adjusts to container width)</Label>
        </div>
      </div>

      {/* Appearance */}
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">Appearance</h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <input
                className="h-10 w-12 cursor-pointer rounded-xl border border-border"
                onChange={(e) =>
                  updateConfig({ backgroundColor: e.target.value })
                }
                type="color"
                value={config.backgroundColor}
              />
              <Input
                className="flex-1"
                onChange={(e) =>
                  updateConfig({ backgroundColor: e.target.value })
                }
                placeholder="#ffffff"
                value={config.backgroundColor}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={config.allowTransparency}
            onCheckedChange={(checked) =>
              updateConfig({ allowTransparency: checked })
            }
          />
          <Label>
            Allow transparent background (overrides background color)
          </Label>
        </div>
      </div>

      {/* Border & Styling */}
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">Border & Styling</h3>

        <div className="flex items-center gap-2">
          <Switch
            checked={config.showBorder}
            onCheckedChange={(checked) => updateConfig({ showBorder: checked })}
          />
          <Label>Show border</Label>
        </div>

        {config.showBorder && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label>Border Color</Label>
              <div className="flex gap-2">
                <input
                  className="h-10 w-12 cursor-pointer rounded-xl border border-border"
                  onChange={(e) =>
                    updateConfig({ borderColor: e.target.value })
                  }
                  type="color"
                  value={config.borderColor}
                />
                <Input
                  className="flex-1"
                  onChange={(e) =>
                    updateConfig({ borderColor: e.target.value })
                  }
                  placeholder="#e5e7eb"
                  value={config.borderColor}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Border Width (px)</Label>
              <Input
                max="10"
                min="0"
                onChange={(e) =>
                  updateConfig({
                    borderWidth: Number.parseInt(e.target.value) || 0,
                  })
                }
                type="number"
                value={config.borderWidth.toString()}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Border Radius (px)</Label>
              <Input
                max="50"
                min="0"
                onChange={(e) =>
                  updateConfig({
                    borderRadius: Number.parseInt(e.target.value) || 0,
                  })
                }
                type="number"
                value={config.borderRadius.toString()}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label>Padding (px)</Label>
          <Input
            className="w-full md:w-32"
            max="100"
            min="0"
            onChange={(e) =>
              updateConfig({ padding: Number.parseInt(e.target.value) || 0 })
            }
            type="number"
            value={config.padding.toString()}
          />
          <p className="text-muted-foreground text-xs">
            Space around the iframe
          </p>
        </div>
      </div>

      {/* Performance */}
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">Performance</h3>
        <div className="flex flex-col gap-2">
          <Label>Loading Mode</Label>
          <Select
            onValueChange={(value) =>
              updateConfig({ loadingMode: value as "eager" | "lazy" })
            }
            value={config.loadingMode}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select loading mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lazy">Lazy (recommended)</SelectItem>
              <SelectItem value="eager">Eager</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-xs">
            Lazy loading improves page performance by loading the iframe only
            when it comes into view
          </p>
        </div>
      </div>
    </div>
  );
}
