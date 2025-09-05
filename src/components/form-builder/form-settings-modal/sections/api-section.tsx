"use client";

import {
  Code,
  Copy,
  Download,
  Eye,
  EyeOff,
  Key,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { FaQuestion } from "react-icons/fa6";
import { getAllFields } from "@/components/form-builder/form-builder/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import {
  generateFormApiKey,
  revokeFormApiKey,
  toggleFormApiEnabled,
} from "@/lib/forms/api-keys";
import type { ApiSectionProps } from "../types";

export function ApiSection({
  localSettings,
  updateApi,
  formId,
  schema,
}: ApiSectionProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [showCodeGenerator, setShowCodeGenerator] = useState(false);

  const apiSettings = localSettings.api || {};

  const hasApiKey = !!apiSettings.apiKey;

  const handleToggleApi = async (enabled: boolean) => {
    if (!formId) return;

    try {
      await toggleFormApiEnabled(formId, enabled);
      updateApi({ enabled });
      toast.success(enabled ? "API support enabled" : "API support disabled");
    } catch (error) {
      toast.error("Failed to update API settings");
    }
  };

  const handleGenerateApiKey = async () => {
    if (!formId) return;

    setIsGenerating(true);
    try {
      const result = await generateFormApiKey(formId);
      if (result.success && result.apiKey) {
        updateApi({ apiKey: result.apiKey, enabled: true });
        toast.success("API key generated successfully");
      } else {
        toast.error(result.error || "Failed to generate API key");
      }
    } catch (error) {
      toast.error("Failed to generate API key");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevokeApiKey = async () => {
    if (!formId) return;

    setIsRevoking(true);
    try {
      const result = await revokeFormApiKey(formId);
      if (result.success) {
        updateApi({ apiKey: undefined, enabled: false });
        toast.success("API key revoked successfully");
      } else {
        toast.error(result.error || "Failed to revoke API key");
      }
    } catch (error) {
      toast.error("Failed to revoke API key");
    } finally {
      setIsRevoking(false);
    }
  };

  const handleCopyApiKey = () => {
    if (apiSettings.apiKey) {
      navigator.clipboard.writeText(apiSettings.apiKey);
      toast.success("API key copied to clipboard");
    }
  };

  const handleCopyEndpoint = () => {
    if (formId) {
      const endpoint = `${window.location.origin}/api/forms/${formId}/api-submit`;
      navigator.clipboard.writeText(endpoint);
      toast.success("API endpoint copied to clipboard");
    }
  };

  const generateCodeExamples = () => {
    if (!(formId && apiSettings.apiKey)) return {};

    const endpoint = `${window.location.origin}/api/forms/${formId}/api-submit`;
    const apiKey = apiSettings.apiKey;

    // Get actual form fields from the form schema
    const formFields = schema ? getAllFields(schema) : [];
    const sampleData: Record<string, any> = {};

    // Generate sample data based on actual form fields
    formFields.forEach((field: any) => {
      switch (field.type) {
        case "text":
        case "email":
          sampleData[field.id] =
            field.type === "email" ? "john@example.com" : "John Doe";
          break;
        case "textarea":
          sampleData[field.id] = "This is a sample message";
          break;
        case "number":
          sampleData[field.id] = 42;
          break;
        case "select":
        case "radio":
          sampleData[field.id] = field.options?.[0]?.value || "option1";
          break;
        case "checkbox":
          sampleData[field.id] = field.options?.[0]?.value || "option1";
          break;
        case "date":
          sampleData[field.id] = "2024-01-15";
          break;
        case "time":
          sampleData[field.id] = "14:30";
          break;
        case "rating":
          sampleData[field.id] = 5;
          break;
        case "slider":
          sampleData[field.id] = 50;
          break;
        default:
          sampleData[field.id] = "Sample value";
      }
    });

    const dataString = JSON.stringify(sampleData, null, 2);
    const dataStringSingleLine = JSON.stringify(sampleData);

    return {
      curl: `curl -X POST "${endpoint}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{
    "data": ${dataStringSingleLine}
  }'`,

      javascript: `const response = await fetch('${endpoint}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${apiKey}'
  },
  body: JSON.stringify({
    data: ${dataString}
  })
});

const result = await response.json();
console.log(result);`,

      python: `import requests

url = '${endpoint}'
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${apiKey}'
}
data = {
    'data': ${dataString}
}

response = requests.post(url, json=data, headers=headers)
result = response.json()
print(result)`,

      php: `<?php
$url = '${endpoint}';
$headers = [
    'Content-Type: 'application/json',
    'Authorization': 'Bearer ${apiKey}'
];
$data = [
    'data' => ${dataString.replace(/"/g, '"')}
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
print_r($result);
?>`,
    };
  };

  const handleDownloadCode = (language: string, code: string) => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `form-api-${language}.${language === "javascript" ? "js" : language === "curl" ? "sh" : language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`${language} code example downloaded`);
  };

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <Key className="h-5 w-5 text-primary" />
        <h3 className="font-medium text-lg">API Support</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className="cursor-help" size="sm" variant="secondary">
                Beta <FaQuestion size={10} />
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                This feature is still under testing. You may encounter some
                bugs.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={apiSettings.enabled}
            disabled={isGenerating || isRevoking}
            id="api-enabled"
            onCheckedChange={handleToggleApi}
            size="sm"
          />
          <Label className="font-medium text-sm" htmlFor="api-enabled">
            Enable API support
          </Label>
        </div>

        {apiSettings.enabled && (
          <div className="flex flex-col gap-4 border-muted border-l-2 pl-6">
            {hasApiKey ? (
              <>
                <div className="flex flex-col gap-2">
                  <Label className="font-medium text-sm" htmlFor="api-key">
                    API Key
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      className="font-mono text-sm"
                      id="api-key"
                      readOnly
                      type={showApiKey ? "text" : "password"}
                      value={apiSettings.apiKey || ""}
                    />
                    <Button
                      onClick={() => setShowApiKey(!showApiKey)}
                      size="icon"
                      variant="outline"
                    >
                      {showApiKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      onClick={handleCopyApiKey}
                      size="icon"
                      variant="outline"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="font-medium text-sm" htmlFor="api-endpoint">
                    API Endpoint
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      className="font-mono text-sm"
                      id="api-endpoint"
                      readOnly
                      value={formId ? `/api/forms/${formId}/api-submit` : ""}
                    />
                    <Button
                      onClick={handleCopyEndpoint}
                      size="icon"
                      variant="outline"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    disabled={isRevoking}
                    onClick={handleRevokeApiKey}
                    size="sm"
                    variant="outline"
                  >
                    {isRevoking ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Key className="mr-2 h-4 w-4" />
                    )}
                    {isRevoking ? "Revoking..." : "Revoke Key"}
                  </Button>
                  <Button
                    disabled={isGenerating}
                    onClick={handleGenerateApiKey}
                    size="sm"
                    variant="outline"
                  >
                    {isGenerating ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    {isGenerating ? "Generating..." : "Regenerate Key"}
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setShowCodeGenerator(!showCodeGenerator)}
                    size="sm"
                    variant="outline"
                  >
                    <Code className="mr-2 h-4 w-4" />
                    {showCodeGenerator ? "Hide" : "Show"} Code Examples
                  </Button>
                </div>

                {showCodeGenerator && (
                  <div className="flex flex-col gap-4">
                    {Object.entries(generateCodeExamples()).map(
                      ([language, code]) => (
                        <div className="flex flex-col gap-2" key={language}>
                          <div className="flex items-center justify-between">
                            <Label className="font-medium text-sm capitalize">
                              {language === "javascript"
                                ? "JavaScript/Node.js"
                                : language}
                            </Label>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => {
                                  navigator.clipboard.writeText(code);
                                  toast.success(
                                    `${language} code copied to clipboard`
                                  );
                                }}
                                size="sm"
                                variant="outline"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() =>
                                  handleDownloadCode(language, code)
                                }
                                size="sm"
                                variant="outline"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="rounded-lg border bg-muted">
                            <ScrollArea className="h-48">
                              <div className="p-4">
                                <pre className="text-sm">
                                  <code className="whitespace-pre-wrap break-words">
                                    {code}
                                  </code>
                                </pre>
                              </div>
                            </ScrollArea>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="py-4 text-center">
                <p className="mb-4 text-muted-foreground text-sm">
                  Generate an API key to enable external form submissions
                </p>
                <Button disabled={isGenerating} onClick={handleGenerateApiKey}>
                  {isGenerating ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Key className="mr-2 h-4 w-4" />
                  )}
                  {isGenerating ? "Generating..." : "Generate API Key"}
                </Button>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Rate Limiting</Badge>
                <span className="text-muted-foreground text-sm">
                  All form rate limiting settings apply to API submissions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Profanity Filter</Badge>
                <span className="text-muted-foreground text-sm">
                  Content filtering is applied to API submissions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Duplicate Prevention</Badge>
                <span className="text-muted-foreground text-sm">
                  Duplicate submission detection works with API
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Response Limits</Badge>
                <span className="text-muted-foreground text-sm">
                  Form response limits apply to API submissions
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
