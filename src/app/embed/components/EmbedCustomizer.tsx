'use client';

import { Code2, Eye, Monitor, Settings, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button-base';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Form } from '@/lib/database/database';
import EmbedCodeModal from './EmbedCodeModal';
import EmbedPreview from './EmbedPreview';
import EmbedSettings from './EmbedSettings';

export interface EmbedConfig {
  width: string;
  height: string;
  borderRadius: number;
  padding: number;
  backgroundColor: string;
  theme: 'light' | 'dark' | 'auto';
  showBorder: boolean;
  borderColor: string;
  borderWidth: number;
  responsive: boolean;
  loadingMode: 'eager' | 'lazy';
  allowTransparency: boolean;
}

interface EmbedCustomizerProps {
  form: Form;
  formId: string;
}

const defaultConfig: EmbedConfig = {
  width: '100%',
  height: '600px',
  borderRadius: 8,
  padding: 0,
  backgroundColor: '#ffffff',
  theme: 'light',
  showBorder: true,
  borderColor: '#e5e7eb',
  borderWidth: 1,
  responsive: true,
  loadingMode: 'lazy',
  allowTransparency: false,
};

export default function EmbedCustomizer({
  form,
  formId,
}: EmbedCustomizerProps) {
  const [config, setConfig] = useState<EmbedConfig>(defaultConfig);
  const [activeView, setActiveView] = useState<'desktop' | 'mobile'>('desktop');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  const updateConfig = (updates: Partial<EmbedConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const embedUrl = `${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.ikiform.com'}/forms/${formId}?theme=${config.theme}`;

  return (
    <div className="flex flex-col gap-6">
      {/* Simple Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-2xl">
            {form.schema?.settings?.title || form.title || 'Untitled Form'}
          </h1>
          <p className="text-muted-foreground">
            Customize and generate embed code for your form
          </p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => setIsCodeModalOpen(true)}
        >
          <Code2 className="h-4 w-4" />
          Show Code
        </Button>
      </div>

      {/* Simple Split Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <EmbedSettings config={config} updateConfig={updateConfig} />
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="flex flex-col gap-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Preview</CardTitle>
              <div className="flex gap-1">
                <Button
                  onClick={() => setActiveView('desktop')}
                  size="sm"
                  variant={activeView === 'desktop' ? 'default' : 'ghost'}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setActiveView('mobile')}
                  size="sm"
                  variant={activeView === 'mobile' ? 'default' : 'ghost'}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <EmbedPreview
              config={config}
              embedUrl={embedUrl}
              formTitle={form.schema?.settings?.title || form.title || 'Form'}
              viewMode={activeView}
            />
          </CardContent>
        </Card>
      </div>

      {/* Code Modal */}
      <EmbedCodeModal
        config={config}
        embedUrl={embedUrl}
        formId={formId}
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}
