// External imports

import { Settings, Zap } from 'lucide-react';
import React from 'react';
import type { FormLogic } from '@/components/form-builder/logic-builder/types';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
// Component imports
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { BlockManager } from '../../block-manager';
import { FieldPalette } from '../../field-palette';
import { FieldSettingsPanel } from '../../field-settings-panel';
import { FormPreview } from '../../form-preview';
import { LogicBuilderPanel } from '../../logic-builder';
// Constant imports
import { PANEL_SIZES } from '../constants';
// Type imports
import type { FormBuilderPanelsProps } from '../types';
import { getAllFields } from '../utils';

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
  const [activeTab, setActiveTab] = React.useState('field-settings');
  const tabItems = [
    { id: 'field-settings', label: 'Field Settings', icon: <Settings /> },
    { id: 'logic-builder', label: 'Logic Builder', icon: <Zap /> },
  ];
  const handleLogicChange = (logic: FormLogic) => {
    if (onLogicChange) onLogicChange(logic);
  };
  const allFields = getAllFields(formSchema);
  return (
    <ResizablePanelGroup className="h-full" direction="horizontal">
      {/* Left Panel - Field Palette or Block Manager */}
      <ResizablePanel
        defaultSize={PANEL_SIZES.LEFT_PANEL.default}
        maxSize={PANEL_SIZES.LEFT_PANEL.max}
        minSize={PANEL_SIZES.LEFT_PANEL.min}
      >
        {formSchema.settings.multiStep ? (
          <BlockManager
            blocks={formSchema.blocks}
            onBlockAdd={onBlockAdd}
            onBlockDelete={onBlockDelete}
            onBlockSelect={onBlockSelect}
            onBlocksUpdate={onBlocksUpdate}
            onFieldDelete={onFieldDelete}
            onFieldSelect={onFieldSelect}
            selectedBlockId={selectedBlockId}
            selectedFieldId={selectedFieldId}
          />
        ) : (
          <FieldPalette onAddField={onFieldAdd} />
        )}
      </ResizablePanel>

      <ResizableHandle />

      {/* Center Panel - Form Preview */}
      <ResizablePanel
        defaultSize={PANEL_SIZES.PREVIEW_PANEL.default}
        maxSize={PANEL_SIZES.PREVIEW_PANEL.max}
        minSize={PANEL_SIZES.PREVIEW_PANEL.min}
      >
        <ScrollArea className="h-full">
          <FormPreview
            onAddField={onFieldAdd}
            onBlockUpdate={onBlockUpdate}
            onFieldDelete={onFieldDelete}
            onFieldSelect={onFieldSelect}
            onFieldsReorder={onFieldsReorder}
            onFormSettingsUpdate={onFormSettingsUpdate}
            onStepSelect={onStepSelect}
            schema={formSchema}
            selectedBlockId={selectedBlockId}
            selectedFieldId={selectedFieldId}
          />
        </ScrollArea>
      </ResizablePanel>

      <ResizableHandle />

      {/* Right Panel - Tabs for Field Settings and Logic Builder */}
      <ResizablePanel
        defaultSize={PANEL_SIZES.RIGHT_PANEL.default}
        maxSize={PANEL_SIZES.RIGHT_PANEL.max}
        minSize={PANEL_SIZES.RIGHT_PANEL.min}
      >
        <div className="flex h-full flex-col">
          {formSchema.settings.multiStep ? (
            <FieldSettingsPanel
              field={selectedField}
              onClose={() => onFieldSelect(null)}
              onFieldUpdate={onFieldUpdate}
            />
          ) : (
            <FieldSettingsPanel
              field={selectedField}
              onClose={() => onFieldSelect(null)}
              onFieldUpdate={onFieldUpdate}
            />
          )}
          <LogicBuilderPanel
            fields={allFields}
            logic={formSchema.logic || []}
            onLogicChange={handleLogicChange}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
