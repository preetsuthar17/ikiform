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
import { FormPreview } from "../../form-preview";
import { LogicBuilderPanel } from "../../logic-builder";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Settings, Zap } from "lucide-react";

// Type imports
import type { FormBuilderPanelsProps } from "../types";
import type { FormLogic } from "@/components/form-builder/logic-builder/types";

// Constant imports
import { PANEL_SIZES } from "../constants";
import { getAllFields } from "../utils";

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
  onLogicChange,
}) => {
  const [activeTab, setActiveTab] = React.useState("field-settings");
  const tabItems = [
    { id: "field-settings", label: "Field Settings", icon: <Settings /> },
    { id: "logic-builder", label: "Logic Builder", icon: <Zap /> },
  ];
  const handleLogicChange = (logic: FormLogic) => {
    if (onLogicChange) onLogicChange(logic);
  };
  const allFields = getAllFields(formSchema);
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

      <ResizableHandle />

      {/* Center Panel - Form Preview */}
      <ResizablePanel
        defaultSize={PANEL_SIZES.PREVIEW_PANEL.default}
        minSize={PANEL_SIZES.PREVIEW_PANEL.min}
        maxSize={PANEL_SIZES.PREVIEW_PANEL.max}
      >
        <ScrollArea className="h-full">
          <FormPreview
            schema={formSchema}
            selectedFieldId={selectedFieldId}
            selectedBlockId={selectedBlockId}
            onFieldSelect={onFieldSelect}
            onFieldsReorder={onFieldsReorder}
            onFieldDelete={onFieldDelete}
            onFormSettingsUpdate={onFormSettingsUpdate}
            onBlockUpdate={onBlockUpdate}
            onStepSelect={onStepSelect}
            onAddField={onFieldAdd}
          />
        </ScrollArea>
      </ResizablePanel>

      <ResizableHandle />

      {/* Right Panel - Tabs for Field Settings and Logic Builder */}
      <ResizablePanel
        defaultSize={PANEL_SIZES.RIGHT_PANEL.default}
        minSize={PANEL_SIZES.RIGHT_PANEL.min}
        maxSize={PANEL_SIZES.RIGHT_PANEL.max}
      >
        <div className="h-full flex flex-col">
          {formSchema.settings.multiStep ? (
            <FieldSettingsPanel
              field={selectedField}
              onFieldUpdate={onFieldUpdate}
              onClose={() => onFieldSelect(null)}
            />
          ) : (
            <FieldSettingsPanel
              field={selectedField}
              onFieldUpdate={onFieldUpdate}
              onClose={() => onFieldSelect(null)}
            />
          )}
          <LogicBuilderPanel
            logic={formSchema.logic || []}
            onLogicChange={handleLogicChange}
            fields={allFields}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
