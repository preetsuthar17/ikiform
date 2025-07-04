"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Copy,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";
import type { FormSchema } from "@/lib/database.types";

interface AIImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (schema: FormSchema) => void;
}

export function AIImportModal({
  open,
  onOpenChange,
  onImport,
}: AIImportModalProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [parsedSchema, setParsedSchema] = useState<FormSchema | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateAndParseSchema = (input: string) => {
    try {
      const parsed = JSON.parse(input);

      // Basic validation
      if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
        throw new Error("Schema must contain 'blocks' array");
      }

      if (!parsed.settings || typeof parsed.settings !== "object") {
        throw new Error("Schema must contain 'settings' object");
      }

      // Ensure required settings fields
      const schema: FormSchema = {
        blocks: parsed.blocks,
        fields: parsed.fields || [],
        settings: {
          title: parsed.settings.title || "Untitled Form",
          description: parsed.settings.description || "",
          submitText: parsed.settings.submitText || "Submit",
          successMessage:
            parsed.settings.successMessage || "Thank you for your submission!",
          redirectUrl: parsed.settings.redirectUrl || "",
          multiStep: parsed.settings.multiStep || false,
          showProgress: parsed.settings.showProgress || true,
          ...parsed.settings,
        },
      };

      setParsedSchema(schema);
      setError(null);
      return schema;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Invalid JSON format";
      setError(errorMessage);
      setParsedSchema(null);
      return null;
    }
  };

  const handleInputChange = (value: string) => {
    setJsonInput(value);
    if (value.trim()) {
      validateAndParseSchema(value);
    } else {
      setParsedSchema(null);
      setError(null);
    }
  };

  const handleImport = () => {
    if (parsedSchema) {
      onImport(parsedSchema);
      onOpenChange(false);
      setJsonInput("");
      setParsedSchema(null);
      setError(null);
      toast.success("Form schema imported successfully!");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonInput);
      toast.success("JSON copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy JSON");
    }
  };

  const downloadSchema = () => {
    if (parsedSchema) {
      const blob = new Blob([JSON.stringify(parsedSchema, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "form-schema.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Schema downloaded successfully");
    }
  };

  const getFieldCount = (schema: FormSchema) => {
    return schema.blocks.reduce(
      (total, block) => total + block.fields.length,
      0
    );
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <ModalHeader>
          <ModalTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Import AI-Generated Form
          </ModalTitle>
        </ModalHeader>

        <div className="flex gap-4 h-[70vh]">
          {/* Left Panel - JSON Input */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Paste JSON Schema</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  disabled={!jsonInput.trim()}
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadSchema}
                  disabled={!parsedSchema}
                >
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <Textarea
              value={jsonInput}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Paste your AI-generated form schema JSON here..."
              className="flex-1 resize-none font-mono text-sm"
            />

            {error && (
              <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>

          {/* Right Panel - Preview */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-sm font-medium mb-3">Preview</h3>

            {parsedSchema ? (
              <ScrollArea className="flex-1">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {parsedSchema.settings.title}
                      </CardTitle>
                      <Badge variant="secondary">
                        {getFieldCount(parsedSchema)} fields
                      </Badge>
                    </div>
                    {parsedSchema.settings.description && (
                      <p className="text-sm text-muted-foreground">
                        {parsedSchema.settings.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {parsedSchema.blocks.map((block, blockIndex) => (
                      <div key={block.id} className="space-y-3">
                        {parsedSchema.settings.multiStep && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              Step {blockIndex + 1}
                            </Badge>
                            <h4 className="font-medium">{block.title}</h4>
                          </div>
                        )}

                        <div className="space-y-2">
                          {block.fields.map((field) => (
                            <div
                              key={field.id}
                              className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {field.label}
                                </span>
                                {field.required && (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    Required
                                  </Badge>
                                )}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {field.type}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </ScrollArea>
            ) : (
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <div className="text-center text-muted-foreground">
                  <Upload className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Paste JSON to see preview</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!parsedSchema}
            className="gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Import Form
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}
