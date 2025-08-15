import { Copy, ExternalLink, Globe, History, User, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import type { FormField } from '@/lib/database';

interface PrepopulationSettingsProps {
  field: FormField;
  onFieldUpdate: (field: FormField) => void;
}

export function PrepopulationSettings({
  field,
  onFieldUpdate,
}: PrepopulationSettingsProps) {
  const [previewUrl, setPreviewUrl] = useState('');

  const prepopulation = field.prepopulation || {
    enabled: false,
    source: 'url' as const,
    config: {},
  };

  const updatePrepopulation = (updates: Partial<typeof prepopulation>) => {
    onFieldUpdate({
      ...field,
      prepopulation: { ...prepopulation, ...updates },
    });
  };

  const updateConfig = (
    configUpdates: Partial<typeof prepopulation.config>
  ) => {
    updatePrepopulation({
      config: { ...prepopulation.config, ...configUpdates },
    });
  };

  const generatePreviewUrl = async () => {
    if (!prepopulation.config.urlParam) {
      toast.error('Please enter a URL parameter name first');
      return;
    }

    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin + '/form/123'
        : 'https://yoursite.com/form/123';

    const exampleValue = `Sample ${field.label}`;
    const params = new URLSearchParams();
    params.set(prepopulation.config.urlParam, exampleValue);
    const url = `${baseUrl}?${params.toString()}`;

    setPreviewUrl(url);

    const { copyWithToast } = await import('@/lib/utils/clipboard');
    await copyWithToast(
      url,
      'Preview URL copied to clipboard!',
      'Failed to copy preview URL'
    );
  };

  const testApiEndpoint = async () => {
    if (!prepopulation.config.apiEndpoint) {
      toast.error('Please enter an API endpoint first');
      return;
    }

    try {
      const response = await fetch(prepopulation.config.apiEndpoint, {
        method: prepopulation.config.apiMethod || 'GET',
        headers:
          typeof prepopulation.config.apiHeaders === 'string'
            ? JSON.parse(prepopulation.config.apiHeaders)
            : prepopulation.config.apiHeaders,
      });

      if (response.ok) {
        toast.success('API endpoint is reachable!');
      } else {
        toast.error(
          `API test failed: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      toast.error(
        `API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  return (
    <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
      <h3 className="font-medium text-card-foreground">Pre-population</h3>

      <div className="flex flex-col gap-4">
        {/* Enable/Disable Switch */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Label className="text-card-foreground">
              Enable Pre-population
            </Label>
            <p className="text-muted-foreground text-xs">
              Automatically fill this field with existing data
            </p>
          </div>
          <Switch
            checked={prepopulation.enabled}
            onCheckedChange={(enabled) => updatePrepopulation({ enabled })}
            size="sm"
          />
        </div>

        {prepopulation.enabled && (
          <>
            {/* Data Source Selection */}
            <div className="flex flex-col gap-2">
              <Label className="text-card-foreground">Data Source</Label>
              <Select
                onValueChange={(source) =>
                  updatePrepopulation({ source: source as any })
                }
                value={prepopulation.source}
              >
                <SelectTrigger className="border-border bg-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="url">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      URL Parameters
                    </div>
                  </SelectItem>
                  <SelectItem value="api">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      External API
                    </div>
                  </SelectItem>
                  <SelectItem value="profile">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      User Profile
                    </div>
                  </SelectItem>
                  <SelectItem value="previous">
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Previous Submission
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* URL Parameters Configuration */}
            {prepopulation.source === 'url' && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <Label className="text-card-foreground">
                    URL Parameter Name
                  </Label>
                  <Input
                    className="border-border bg-input"
                    onChange={(e) => updateConfig({ urlParam: e.target.value })}
                    placeholder="e.g., name, email, phone"
                    value={prepopulation.config.urlParam || ''}
                  />
                  <p className="text-muted-foreground text-xs">
                    The parameter name to extract from the URL query string
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-card-foreground">Fallback Value</Label>
                  <Input
                    className="border-border bg-input"
                    onChange={(e) =>
                      updateConfig({ fallbackValue: e.target.value })
                    }
                    placeholder="Default value if parameter is missing"
                    value={prepopulation.config.fallbackValue || ''}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <Label className="text-card-foreground">
                      Overwrite Existing
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Replace user input with pre-populated value
                    </p>
                  </div>
                  <Switch
                    checked={prepopulation.config.overwriteExisting}
                    onCheckedChange={(overwriteExisting) =>
                      updateConfig({ overwriteExisting })
                    }
                    size="sm"
                  />
                </div>

                {prepopulation.config.urlParam && (
                  <div className="flex gap-2">
                    <Button
                      className="flex items-center gap-2"
                      onClick={generatePreviewUrl}
                      size="sm"
                      variant="outline"
                    >
                      <Copy className="h-4 w-4" />
                      Generate Preview URL
                    </Button>
                  </div>
                )}

                {previewUrl && (
                  <div className="flex flex-col gap-2 rounded border border-blue-200 bg-blue-50 p-3 text-blue-900 text-sm">
                    <strong>Preview URL:</strong>
                    <code className="break-all text-xs">{previewUrl}</code>
                    <p className="text-xs">
                      This URL will pre-populate the field with "Sample{' '}
                      {field.label}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* API Configuration */}
            {prepopulation.source === 'api' && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <Label className="text-card-foreground">API Endpoint</Label>
                  <Input
                    className="border-border bg-input"
                    onChange={(e) =>
                      updateConfig({ apiEndpoint: e.target.value })
                    }
                    placeholder="https://api.example.com/user-data"
                    type="url"
                    value={prepopulation.config.apiEndpoint || ''}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-card-foreground">HTTP Method</Label>
                  <Select
                    onValueChange={(method) =>
                      updateConfig({ apiMethod: method as 'GET' | 'POST' })
                    }
                    value={prepopulation.config.apiMethod || 'GET'}
                  >
                    <SelectTrigger className="border-border bg-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-card-foreground">
                    Request Headers (JSON)
                  </Label>
                  <Textarea
                    className="border-border bg-input"
                    onChange={(e) =>
                      updateConfig({ apiHeaders: e.target.value as any })
                    }
                    placeholder={
                      '{\n  "Authorization": "Bearer token",\n  "Content-Type": "application/json"\n}'
                    }
                    rows={3}
                    value={
                      typeof prepopulation.config.apiHeaders === 'string'
                        ? prepopulation.config.apiHeaders
                        : JSON.stringify(
                            prepopulation.config.apiHeaders || {},
                            null,
                            2
                          )
                    }
                  />
                </div>

                {prepopulation.config.apiEndpoint && (
                  <Button
                    className="flex items-center gap-2"
                    onClick={testApiEndpoint}
                    size="sm"
                    variant="outline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Test API Endpoint
                  </Button>
                )}
              </div>
            )}

            {/* Coming Soon Messages */}
            {prepopulation.source === 'profile' && (
              <div className="rounded border border-orange-200 bg-orange-50 p-3 text-orange-900 text-sm">
                <strong>Coming Soon:</strong> User profile pre-population will
                be available in a future update.
              </div>
            )}

            {prepopulation.source === 'previous' && (
              <div className="rounded border border-orange-200 bg-orange-50 p-3 text-orange-900 text-sm">
                <strong>Coming Soon:</strong> Previous submission pre-population
                will be available in a future update.
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
