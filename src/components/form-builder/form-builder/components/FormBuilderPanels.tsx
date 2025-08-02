import { Settings, Zap } from 'lucide-react';
import React from 'react';
import type { FormLogic } from '@/components/form-builder/logic-builder/types';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import type { FormSchema } from '@/lib/database';
import { BlockManager } from '../../block-manager';
import { FieldPalette } from '../../field-palette';
import { FieldSettingsPanel } from '../../field-settings-panel';
import { FormPreview } from '../../form-preview';
import { LogicBuilderPanel } from '../../logic-builder';

import { PANEL_SIZES } from '../constants';

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

  const handleSchemaUpdate = (updatedSchema: FormSchema) => {
    if (updatedSchema.fields && updatedSchema.fields !== formSchema.fields) {
      onFieldsReorder(updatedSchema.fields);
    }

    if (updatedSchema.blocks && updatedSchema.blocks !== formSchema.blocks) {
      onBlocksUpdate(updatedSchema.blocks);
    }

    if (
      updatedSchema.settings &&
      updatedSchema.settings !== formSchema.settings
    ) {
      onFormSettingsUpdate(updatedSchema.settings);
    }
  };
  return (
    <ResizablePanelGroup className="h-full" direction="horizontal">
      {}
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
          <FieldPalette
            formSchema={formSchema}
            onAddField={onFieldAdd}
            onSchemaUpdate={handleSchemaUpdate}
          />
        )}
      </ResizablePanel>

      <ResizableHandle />

      {}
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

      {}
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
