"use client";

import React, { useState } from "react";
import { Modal, ModalContent } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Wand2,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  Lightbulb,
  Settings,
  Code,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { generateFormWithAI, getExamplePrompts } from "@/lib/ai-form-builder";
import type { FormSchema } from "@/lib/database.types";

interface AIFormBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFormGenerated: (schema: FormSchema) => void;
  existingSchema?: FormSchema;
  mode?: "create" | "modify";
}

export function AIFormBuilderModal({
  isOpen,
  onClose,
  onFormGenerated,
  existingSchema,
  mode = "create",
}: AIFormBuilderModalProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSchema, setGeneratedSchema] = useState<FormSchema | null>(
    null
  );
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const examplePrompts = getExamplePrompts();
  const hasEnvApiKey = Boolean(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe what kind of form you want to create");
      return;
    }

    setIsGenerating(true);
    setError("");
    setGeneratedSchema(null);
    setExplanation("");

    try {
      const result = await generateFormWithAI({
        prompt: prompt.trim(),
        existingSchema,
        mode,
      });

      if (result.success && result.schema) {
        setGeneratedSchema(result.schema);
        setExplanation(result.explanation || "");
        setShowPreview(true);
        toast.success(
          `Form generated with ${result.schema.blocks.reduce(
            (acc, block) => acc + block.fields.length,
            0
          )} fields`
        );
      } else {
        setError(result.error || "Failed to generate form");
        toast.error(result.error || "Failed to generate form");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseForm = () => {
    if (generatedSchema) {
      onFormGenerated(generatedSchema);
      onClose();
      toast.success("Your AI-generated form has been applied to the builder");
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  const handleClose = () => {
    setPrompt("");
    setGeneratedSchema(null);
    setExplanation("");
    setError("");
    setShowPreview(false);
    onClose();
  };

  return (
    <Modal open={isOpen} onOpenChange={handleClose}>
      <ModalContent className="max-w-6xl max-h-[90vh]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">AI Form Builder</h2>
                <p className="text-sm text-muted-foreground">
                  {mode === "create"
                    ? "Generate a new form"
                    : "Modify existing form"}{" "}
                  using AI
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>

          <div className="flex-1 flex">
            {/* Input Section */}
            <div className="flex-1 p-6 border-r">
              <ScrollArea className="h-full">
                <div className="space-y-6">
                  {/* Configuration Info */}

                  {/* Prompt Input */}
                  <div className="space-y-3">
                    <Label htmlFor="prompt" className="text-base font-medium">
                      Describe your form
                    </Label>
                    <Textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={
                        mode === "create"
                          ? "Describe the form you want to create. For example: 'Create a job application form with personal details, work experience, and skills section...'"
                          : "Describe what changes you want to make to the existing form..."
                      }
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  {/* Example Prompts */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      <Label className="text-sm font-medium">
                        Example prompts
                      </Label>
                    </div>
                    <div className="grid gap-2">
                      {examplePrompts.slice(0, 6).map((example, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExampleClick(example)}
                          className="justify-start text-left h-auto py-2 px-3 text-sm text-muted-foreground hover:text-foreground"
                        >
                          {example}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        Generate Form
                      </>
                    )}
                  </Button>

                  {/* Error Display */}
                  {error && (
                    <Card className="p-4 border-red-200 bg-red-50/50">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-red-900">
                            Generation Error
                          </h4>
                          <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Preview Section */}
            <div className="flex-1 p-6">
              <ScrollArea className="h-full">
                {!generatedSchema ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="p-4 bg-muted/20 rounded-full mb-4">
                      <Eye className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Form Preview</h3>
                    <p className="text-muted-foreground">
                      Generate a form to see the preview here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Success Header */}
                    <Card className="p-4 border-green-200 bg-green-50/50">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-green-900">
                            Form Generated Successfully
                          </h4>
                          {explanation && (
                            <p className="text-sm text-green-700 mt-1">
                              {explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>

                    {/* Form Preview */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Preview</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {generatedSchema.blocks.reduce(
                              (acc, block) => acc + block.fields.length,
                              0
                            )}{" "}
                            fields
                          </Badge>
                          <Badge
                            variant={
                              generatedSchema.settings.multiStep
                                ? "default"
                                : "secondary"
                            }
                          >
                            {generatedSchema.settings.multiStep
                              ? "Multi-step"
                              : "Single page"}
                          </Badge>
                        </div>
                      </div>

                      {/* Form Title & Description */}
                      <Card className="p-4">
                        <h4 className="font-semibold text-lg">
                          {generatedSchema.settings.title}
                        </h4>
                        {generatedSchema.settings.description && (
                          <p className="text-muted-foreground mt-1">
                            {generatedSchema.settings.description}
                          </p>
                        )}
                      </Card>

                      {/* Blocks/Steps */}
                      {generatedSchema.blocks.map((block, blockIndex) => (
                        <Card key={block.id} className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            {generatedSchema.settings.multiStep && (
                              <Badge variant="outline" className="text-xs">
                                Step {blockIndex + 1}
                              </Badge>
                            )}
                            <h5 className="font-medium">{block.title}</h5>
                          </div>
                          {block.description && (
                            <p className="text-sm text-muted-foreground mb-3">
                              {block.description}
                            </p>
                          )}

                          <div className="space-y-3">
                            {block.fields.map((field) => (
                              <div
                                key={field.id}
                                className="flex items-center justify-between p-2 bg-muted/20 rounded"
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">
                                      {field.label}
                                    </span>
                                    {field.required && (
                                      <Badge
                                        variant="destructive"
                                        className="text-xs px-1 py-0"
                                      >
                                        Required
                                      </Badge>
                                    )}
                                  </div>
                                  {field.description && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {field.description}
                                    </p>
                                  )}
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {field.type}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </Card>
                      ))}

                      {/* JSON Preview */}
                      <Card className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Code className="w-4 h-4" />
                          <h5 className="font-medium">Generated Schema</h5>
                        </div>
                        <pre className="text-xs bg-muted/20 p-3 rounded overflow-auto max-h-40">
                          {JSON.stringify(generatedSchema, null, 2)}
                        </pre>
                      </Card>

                      {/* Use Form Button */}
                      <Button
                        onClick={handleUseForm}
                        className="w-full gap-2"
                        size="lg"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Use This Form
                      </Button>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
