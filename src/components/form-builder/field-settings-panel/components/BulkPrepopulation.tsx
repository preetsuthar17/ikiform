import {
  CheckCircle,
  Copy,
  Globe,
  Plus,
  Settings,
  Trash2,
  User,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import type { FormField, FormSchema } from '@/lib/database';

interface BulkPrepopulationProps {
  schema: FormSchema;
  onFieldUpdate: (fieldId: string, updates: Partial<FormField>) => void;
}

export function BulkPrepopulation({
  schema,
  onFieldUpdate,
}: BulkPrepopulationProps) {
  const [bulkSource, setBulkSource] = useState<'url' | 'api' | 'profile'>(
    'url'
  );

  const compatibleFields =
    schema.fields?.filter((field) =>
      ['text', 'email', 'textarea', 'select', 'checkbox', 'date'].includes(
        field.type
      )
    ) || [];

  const fieldsWithPrepopulation = compatibleFields.filter(
    (field) => field.prepopulation?.enabled
  );

  const bulkPrepopulationEnabled = fieldsWithPrepopulation.length > 0;

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'url':
        return <Globe className="h-4 w-4" />;
      case 'api':
        return <Zap className="h-4 w-4" />;
      case 'profile':
        return <User className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const getSourceDescription = (source: string) => {
    switch (source) {
      case 'url':
        return 'Pre-fill fields using URL parameters (e.g., ?name=John&email=john@example.com)';
      case 'api':
        return 'Fetch data from external API endpoints to populate fields automatically';
      case 'profile':
        return 'Use logged-in user profile data to pre-populate form fields';
      default:
        return '';
    }
  };

  const bulkEnablePrepopulation = () => {
    let enabled = 0;
    compatibleFields.forEach((field) => {
      if (!field.prepopulation?.enabled) {
        const urlParam = field.label
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^a-z0-9_]/g, '');

        let profileField:
          | 'email'
          | 'phone'
          | 'address'
          | 'name'
          | 'custom'
          | undefined;
        if (bulkSource === 'profile') {
          if (field.type === 'email') profileField = 'email';
          else if (field.label.toLowerCase().includes('phone'))
            profileField = 'phone';
          else if (field.label.toLowerCase().includes('address'))
            profileField = 'address';
          else if (field.label.toLowerCase().includes('name'))
            profileField = 'name';
          else profileField = 'custom';
        }

        onFieldUpdate(field.id, {
          prepopulation: {
            enabled: true,
            source: bulkSource,
            config: {
              urlParam: bulkSource === 'url' ? urlParam : undefined,
              apiEndpoint: bulkSource === 'api' ? '' : undefined,
              profileField,
            },
          },
        });
        enabled++;
      }
    });

    toast(
      `Enabled prepopulation for ${enabled} fields using ${bulkSource.toUpperCase()} source`
    );
  };

  const disableAllPrepopulation = () => {
    let disabled = 0;
    fieldsWithPrepopulation.forEach((field) => {
      onFieldUpdate(field.id, {
        prepopulation: {
          enabled: false,
          source: 'url',
          config: {},
        },
      });
      disabled++;
    });

    toast(`Disabled prepopulation for ${disabled} fields`);
  };

  const generatePreviewUrl = async () => {
    const currentPath = window.location.pathname;
    const formIdMatch = currentPath.match(/\/form-builder\/([^/]+)/);
    const formId = formIdMatch ? formIdMatch[1] : 'form-id';

    const baseUrl = `${window.location.origin}/form/${formId}`;
    const params = new URLSearchParams();

    fieldsWithPrepopulation.forEach((field) => {
      if (
        field.prepopulation?.source === 'url' &&
        field.prepopulation.config.urlParam
      ) {
        params.append(
          field.prepopulation.config.urlParam,
          `sample_${field.type}_value`
        );
      }
    });

    const previewUrl = `${baseUrl}?${params.toString()}`;

    const { copyWithToast } = await import('@/lib/utils/clipboard');
    await copyWithToast(
      previewUrl,
      'Preview URL with sample data has been copied to your clipboard',
      'Failed to copy preview URL'
    );
  };

  const toggleBulkPrepopulation = (enabled: boolean) => {
    if (enabled) {
      bulkEnablePrepopulation();
    } else {
      disableAllPrepopulation();
    }
  };

  return (
    <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
      <h3 className="font-medium text-card-foreground">Bulk Prepopulation</h3>

      <div className="flex flex-col gap-4">
        {/* Enable/Disable Switch */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Label className="text-card-foreground">
              Enable bulk prepopulation
            </Label>
            <p className="text-muted-foreground text-sm">
              Automatically configure prepopulation for all compatible fields
            </p>
          </div>
          <Switch
            checked={bulkPrepopulationEnabled}
            onCheckedChange={toggleBulkPrepopulation}
            size="sm"
          />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 p-3">
            <CheckCircle className="h-4 w-4 shrink-0 text-blue-600" />
            <div className="min-w-0">
              <div className="font-medium text-blue-900">
                {fieldsWithPrepopulation.length}
              </div>
              <div className="text-blue-700 text-xs">Enabled</div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3">
            <Zap className="h-4 w-4 shrink-0 text-green-600" />
            <div className="min-w-0">
              <div className="font-medium text-green-900">
                {compatibleFields.length}
              </div>
              <div className="text-green-700 text-xs">Compatible</div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-3">
            <Settings className="h-4 w-4 shrink-0 text-gray-600" />
            <div className="min-w-0">
              <div className="font-medium text-gray-900">
                {schema.fields?.length || 0}
              </div>
              <div className="text-gray-700 text-xs">Total</div>
            </div>
          </div>
        </div>

        {/* Data Source Selection */}
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground">Data Source</Label>
          <Select
            onValueChange={(value: any) => setBulkSource(value)}
            value={bulkSource}
          >
            <SelectTrigger className="border-border bg-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="url">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>URL Parameters</span>
                </div>
              </SelectItem>
              <SelectItem value="api">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>External API</span>
                </div>
              </SelectItem>
              <SelectItem value="profile">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>User Profile</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-xs">
            {getSourceDescription(bulkSource)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            className="flex items-center gap-2"
            disabled={compatibleFields.length === 0}
            onClick={bulkEnablePrepopulation}
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Enable for {compatibleFields.length} Fields
          </Button>

          {fieldsWithPrepopulation.length > 0 && (
            <>
              <Button
                className="flex items-center gap-2"
                onClick={generatePreviewUrl}
                size="sm"
                variant="outline"
              >
                <Copy className="h-4 w-4" />
                Copy Preview URL
              </Button>

              <Button
                className="flex items-center gap-2"
                onClick={disableAllPrepopulation}
                size="sm"
                variant="destructive"
              >
                <Trash2 className="h-4 w-4" />
                Disable All
              </Button>
            </>
          )}
        </div>

        {/* Enabled Fields List */}
        {fieldsWithPrepopulation.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label className="text-card-foreground">Enabled Fields</Label>
              <Badge className="text-xs" variant="secondary">
                {fieldsWithPrepopulation.length} of {compatibleFields.length}
              </Badge>
            </div>

            <div className="flex max-h-48 flex-col gap-2 overflow-y-auto">
              {fieldsWithPrepopulation.map((field) => (
                <div
                  className="flex items-center justify-between rounded-md border border-border bg-card p-3"
                  key={field.id}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="truncate font-medium text-sm">
                      {field.label}
                    </span>
                    <Badge
                      className="flex shrink-0 items-center gap-1 text-xs"
                      variant="outline"
                    >
                      {getSourceIcon(field.prepopulation!.source)}
                      {field.prepopulation!.source.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {field.prepopulation?.source === 'url' &&
                      field.prepopulation.config.urlParam && (
                        <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                          ?{field.prepopulation.config.urlParam}=...
                        </code>
                      )}
                    <Badge className="text-xs" variant="secondary">
                      {field.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help Text */}
        {compatibleFields.length === 0 && (
          <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3">
            <p className="text-sm text-yellow-800">
              No compatible fields found. Add text, email, textarea, select,
              checkbox, or date fields to enable prepopulation.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
