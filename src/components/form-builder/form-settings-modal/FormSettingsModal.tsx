'use client';

import { Eye, Save, Settings } from 'lucide-react';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

import { Modal, ModalContent } from '@/components/ui/modal';
import { toast } from '@/hooks/use-toast';
import { formsDb } from '@/lib/database';
import {
  FormSettingsDesktopLayout,
  FormSettingsMobileLayout,
} from './components';
import { useFormSettings } from './hooks';
import type { FormSettingsModalProps, FormSettingsSection } from './types';

export function FormSettingsModal({
  isOpen,
  onClose,
  schema,
  onSchemaUpdate,
  userEmail,
  formId,
}: FormSettingsModalProps) {
  const {
    localSettings,
    updateSettings,
    updateRateLimit,
    updateDuplicatePrevention,
    updateProfanityFilter,
    updateResponseLimit,
    updatePasswordProtection,
    updateSocialMedia,
    updateNotifications,
    resetSettings,
  } = useFormSettings(schema, userEmail);

  const [activeSection, setActiveSection] =
    useState<FormSettingsSection>('basic');
  const [saving, setSaving] = useState(false);

  const sectionProps = {
    localSettings,
    updateSettings,
    updateRateLimit,
    updateDuplicatePrevention,
    updateProfanityFilter,
    updateResponseLimit,
    updatePasswordProtection,
    updateSocialMedia,
    updateNotifications,
  };

  const handleSave = async () => {
    if (!formId) {
      toast.error('Missing form ID. Cannot save settings.');
      return;
    }
    setSaving(true);
    try {
      const newSchema = {
        ...schema,
        settings: {
          ...schema.settings,
          ...localSettings,
          duplicatePrevention: localSettings.duplicatePrevention,
        },
      };
      await formsDb.updateForm(formId, { schema: newSchema as any });
      onSchemaUpdate({ settings: localSettings as any });
      toast.success('Settings saved!');
      onClose();
    } catch (e) {
      console.error('Save error:', e);
      toast.error('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    resetSettings();
    onClose();
  };

  return (
    <Modal onOpenChange={onClose} open={isOpen}>
      <ModalContent className="flex h-[90vh] max-w-6xl flex-col p-2 md:p-4">
        <div className="mt-0 flex shrink-0 flex-wrap items-center justify-between gap-6 p-2 md:mt-4 md:p-4">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-xl">Form Settings</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleCancel} variant="outline">
              Cancel
            </Button>
            <Button
              className="gap-2"
              disabled={saving}
              loading={saving}
              onClick={handleSave}
              variant={'default'}
            >
              {saving ? 'Saving' : 'Save Changes'}
            </Button>
          </div>
        </div>
        <div className="min-h-0 flex-1">
          <FormSettingsDesktopLayout
            activeSection={activeSection}
            onClose={onClose}
            onSectionChange={setActiveSection}
            sectionProps={sectionProps}
          />
          <FormSettingsMobileLayout
            activeSection={activeSection}
            onClose={onClose}
            onSectionChange={setActiveSection}
            sectionProps={sectionProps}
          />
        </div>
      </ModalContent>
    </Modal>
  );
}
