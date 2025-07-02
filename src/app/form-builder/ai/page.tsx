"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MessageCircle,
  ChevronRight,
  Loader2,
  Sparkles,
  ArrowLeft,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { FormPreview } from "@/components/form-builder/form-preview";
import type { FormSchema } from "@/lib/database.types";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  schema?: FormSchema;
  timestamp: Date;
}

const examplePrompts = [
  "Create a job application form with personal info, experience, and skills sections",
  "Make a customer feedback survey about our product",
  "Design an event registration form with ticket selection",
  "Build a contact form with name, email, subject, and message",
];

export default function AIFormBuilderPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedSchema, setSelectedSchema] = useState<FormSchema | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: prompt.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-form-builder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userMessage.content,
          existingSchema: selectedSchema,
          mode: selectedSchema ? "modify" : "create",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate form");
      }

      if (data.success && data.schema) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: data.explanation || "Here's your generated form:",
          schema: data.schema,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setSelectedSchema(data.schema);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseForm = () => {
    if (!selectedSchema) return;

    // Store the schema in localStorage to be used by the form builder
    localStorage.setItem("ai_generated_form", JSON.stringify(selectedSchema));
    router.push("/form-builder");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left panel - Chat interface */}
      <div className="w-[400px] border-r border-border flex flex-col bg-muted/30">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/form-builder")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold">AI Form Builder</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setMessages([]);
              setSelectedSchema(null);
            }}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Describe the form you want to create, and I'll help you build
                  it. Try one of these examples:
                </p>
                <div className="grid gap-2">
                  {examplePrompts.map((example) => (
                    <Button
                      key={example}
                      variant="outline"
                      className="justify-start h-auto py-2 px-3 text-left"
                      onClick={() => setPrompt(example)}
                    >
                      <MessageCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">{example}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <Card
                  className={`p-3 max-w-[85%] ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                  {message.type === "assistant" && message.schema && (
                    <div className="mt-2 pt-2 border-t border-border/20 flex items-center gap-2">
                      <Button
                        variant={
                          message.schema === selectedSchema
                            ? "default"
                            : "secondary"
                        }
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() =>
                          message.schema && setSelectedSchema(message.schema)
                        }
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        {message.schema === selectedSchema
                          ? "Selected"
                          : "Preview Form"}
                      </Button>
                      <div className="flex-1" />
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <Card className="p-3 bg-muted">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Generating form...
                  </div>
                </Card>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              ref={inputRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the form you want to create..."
              disabled={loading}
              className="flex-1"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!prompt.trim() || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Right panel - Form preview */}
      <div className="flex-1 overflow-auto bg-background">
        {selectedSchema ? (
          <>
            <div className="sticky top-0 p-4 border-b border-border bg-card/50 backdrop-blur z-10 flex items-center justify-between">
              <h2 className="font-medium">Form Preview</h2>
              <Button onClick={handleUseForm}>Use This Form</Button>
            </div>
            <div className="p-4">
              <FormPreview
                schema={selectedSchema}
                selectedFieldId={null}
                onFieldSelect={() => {}}
                onFieldsReorder={() => {}}
                onFieldDelete={() => {}}
              />
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-center p-4">
            <div className="max-w-md">
              <div className="mb-4 p-3 bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-lg font-medium mb-2">No Form Selected</h2>
              <p className="text-sm text-muted-foreground">
                Chat with the AI to generate a form, then select it to preview
                here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
