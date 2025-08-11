"use client";

import { EmbedConfig } from "./EmbedCustomizer";
import { Input } from "@/components/ui/input-base";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button-base";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

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
        <h3 className="text-sm font-medium">Dimensions</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <Label>Width</Label>
            <div className="flex gap-2">
              <Input
                value={config.width}
                onChange={(e) => updateConfig({ width: e.target.value })}
                placeholder="e.g., 100%, 800px"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateConfig({ width: "100%" })}
              >
                100%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateConfig({ width: "800px" })}
              >
                800px
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Height</Label>
            <div className="flex gap-2">
              <Input
                value={config.height}
                onChange={(e) => updateConfig({ height: e.target.value })}
                placeholder="e.g., 600px, 100vh"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateConfig({ height: "600px" })}
              >
                600px
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateConfig({ height: "800px" })}
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
        <h3 className="text-sm font-medium">Appearance</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <Label>Theme</Label>
            <Select
              value={config.theme}
              onValueChange={(value) =>
                updateConfig({ theme: value as "light" | "dark" | "auto" })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto (matches system)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) =>
                  updateConfig({ backgroundColor: e.target.value })
                }
                className="w-12 h-10 border border-border rounded-ele cursor-pointer"
              />
              <Input
                value={config.backgroundColor}
                onChange={(e) =>
                  updateConfig({ backgroundColor: e.target.value })
                }
                placeholder="#ffffff"
                className="flex-1"
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
        <h3 className="text-sm font-medium">Border & Styling</h3>

        <div className="flex items-center gap-2">
          <Switch
            checked={config.showBorder}
            onCheckedChange={(checked) => updateConfig({ showBorder: checked })}
          />
          <Label>Show border</Label>
        </div>

        {config.showBorder && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <Label>Border Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={config.borderColor}
                  onChange={(e) =>
                    updateConfig({ borderColor: e.target.value })
                  }
                  className="w-12 h-10 border border-border rounded-ele cursor-pointer"
                />
                <Input
                  value={config.borderColor}
                  onChange={(e) =>
                    updateConfig({ borderColor: e.target.value })
                  }
                  placeholder="#e5e7eb"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Border Width (px)</Label>
              <Input
                type="number"
                min="0"
                max="10"
                value={config.borderWidth.toString()}
                onChange={(e) =>
                  updateConfig({ borderWidth: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Border Radius (px)</Label>
              <Input
                type="number"
                min="0"
                max="50"
                value={config.borderRadius.toString()}
                onChange={(e) =>
                  updateConfig({ borderRadius: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label>Padding (px)</Label>
          <Input
            type="number"
            min="0"
            max="100"
            value={config.padding.toString()}
            onChange={(e) =>
              updateConfig({ padding: parseInt(e.target.value) || 0 })
            }
            className="w-full md:w-32"
          />
          <p className="text-xs text-muted-foreground">
            Space around the iframe
          </p>
        </div>
      </div>

      {/* Performance */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">Performance</h3>
        <div className="flex flex-col gap-2">
          <Label>Loading Mode</Label>
          <Select
            value={config.loadingMode}
            onValueChange={(value) =>
              updateConfig({ loadingMode: value as "eager" | "lazy" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select loading mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lazy">Lazy (recommended)</SelectItem>
              <SelectItem value="eager">Eager</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Lazy loading improves page performance by loading the iframe only
            when it comes into view
          </p>
        </div>
      </div>
    </div>
  );
}
