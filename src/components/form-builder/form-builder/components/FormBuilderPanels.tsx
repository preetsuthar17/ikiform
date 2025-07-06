// External imports
import React from "react";

// Component imports
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { FieldPalette } from "../../field-palette";
import { FieldSettingsPanel } from "../../field-settings-panel";
import { BlockManager } from "../../block-manager";

// Type imports
import type { FormBuilderPanelsProps } from "../types";

// Constant imports
import { PANEL_SIZES } from "../constants";

export const FormBuilderPanels: React.FC<FormBuilderPanelsProps> = ({
  formSchema,
  selectedFieldId,
  selectedBlockId,
  selectedField,
  onFieldAdd,
  onFieldSelect,
  onFieldUpdate,
  onFieldDelete,
  onFieldsReorder,
  onBlockSelect,
  onBlocksUpdate,
  onBlockAdd,
  onBlockUpdate,
  onBlockDelete,
  onFormSettingsUpdate,
  onStepSelect,
}) => {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      {/* Left Panel - Field Palette or Block Manager */}
      <ResizablePanel
        defaultSize={PANEL_SIZES.LEFT_PANEL.default}
        minSize={PANEL_SIZES.LEFT_PANEL.min}
        maxSize={PANEL_SIZES.LEFT_PANEL.max}
      >
        {formSchema.settings.multiStep ? (
          <BlockManager
            blocks={formSchema.blocks}
            selectedBlockId={selectedBlockId}
            selectedFieldId={selectedFieldId}
            onBlockSelect={onBlockSelect}
            onFieldSelect={onFieldSelect}
            onBlocksUpdate={onBlocksUpdate}
            onBlockAdd={onBlockAdd}
            onBlockDelete={onBlockDelete}
            onFieldDelete={onFieldDelete}
          />
        ) : (
          <FieldPalette onAddField={onFieldAdd} />
        )}
      </ResizablePanel>



      {/* Right Panel - Field Settings or Field Palette for multi-step */}
      <ResizablePanel
        defaultSize={PANEL_SIZES.RIGHT_PANEL.default}
        minSize={PANEL_SIZES.RIGHT_PANEL.min}
        maxSize={PANEL_SIZES.RIGHT_PANEL.max}
      >
        {formSchema.settings.multiStep ? (
          <div className="h-full flex flex-col">
            <div className="flex-1 min-h-0">
              <FieldSettingsPanel
                field={selectedField}
                onFieldUpdate={onFieldUpdate}
                onClose={() => onFieldSelect(null)}
              />
            </div>
            <div className="border-t bg-muted/30 flex-shrink-0">
              <div className="p-2">
                <h4 className="text-sm font-medium mb-2">Add Fields</h4>
                <FieldPalette onAddField={onFieldAdd} compact />
              </div>
            </div>
          </div>
        ) : (
          <FieldSettingsPanel
            field={selectedField}
            onFieldUpdate={onFieldUpdate}
            onClose={() => onFieldSelect(null)}
          />
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
