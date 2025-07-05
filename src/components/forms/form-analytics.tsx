"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/ui/table";
import {
  Download,
  Eye,
  BarChart3,
  Calendar,
  Users,
  FileText,
  TrendingUp,
  Globe,
  Clock,
  RefreshCw,
  Table,
  LayoutGrid,
  Search,
  X,
  MessageCircle,
  Send,
  Bot,
  User,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MapPin,
  Activity,
  Target,
  Zap,
  PieChart,
  AlertCircle,
  CheckCircle,
  Square,
} from "lucide-react";
import { formsDb } from "@/lib/database";
import { toast } from "@/hooks/use-toast";
import { Loader } from "@/components/ui/loader";
import type { Form, FormSubmission } from "@/lib/database";
import { Separator } from "../ui/separator";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  ModalClose,
} from "@/components/ui/modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerCloseButton,
} from "@/components/ui/drawer";
import { Kbd } from "@/components/ui/kbd";
import Link from "next/link";
import { useTheme } from "next-themes";
import Image from "next/image";

// Simple session ID generator for client-side use
const generateSessionId = () => {
  return (
    "session-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9)
  );
};

interface FormAnalyticsProps {
  form: Form;
}

interface ChatInterfaceProps {
  chatMessages: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  }>;
  chatStreaming: boolean;
  streamedContent: string;
  chatLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  chatSuggestions: string[];
  setChatInput: (value: string) => void;
  handleChatSend: (e: React.FormEvent) => void;
  chatInputRef: React.RefObject<HTMLTextAreaElement | null>;
  chatInput: string;
  abortController: AbortController | null;
  handleStopGeneration: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chatMessages,
  chatStreaming,
  streamedContent,
  chatLoading,
  messagesEndRef,
  chatSuggestions,
  setChatInput,
  handleChatSend,
  chatInputRef,
  chatInput,
  abortController,
  handleStopGeneration,
}) => (
  <div className="flex flex-col h-full ">
    {/* Chat Messages */}
    <ScrollArea className="flex-1 px-4 py-4">
      <div className="space-y-4">
        {/* Welcome Message */}
        {chatMessages.length === 0 && (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-3">
              <Image
                src="/logo.svg"
                alt="Ikiform"
                width={100}
                height={100}
                className="pointer-events-none invert  rounded-ele"
              />
            </div>
            <h3 className="text-base font-semibold mb-2">Ask Kiko</h3>
            <p className="text-muted-foreground text-sm mb-4 max-w-xs mx-auto">
              Talk with your forms and get quick insights and analysis
            </p>
          </div>
        )}

        {/* Chat Messages */}
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-2 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-ele text-sm ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
            </div>
          </div>
        ))}

        {/* Streaming Response */}
        {chatStreaming && (
          <div className="flex gap-2 justify-start">
            <div className="max-w-[85%] p-3 rounded-lg bg-muted text-sm">
              <div className="flex items-center gap-2">
                {streamedContent.length === 0 && <Loader />}
              </div>
              <p className="whitespace-pre-wrap leading-relaxed">
                {streamedContent}
              </p>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {chatLoading && !chatStreaming && (
          <div className="flex gap-2 justify-start">
            <div className="p-3 rounded-lg bg-muted">
              <div className="flex items-center gap-2">
                <Bot className="w-3 h-3" />
                <Loader />
                <span className="text-xs text-muted-foreground">
                  {chatMessages.length > 0
                    ? "Analyzing conversation context..."
                    : "Processing your query..."}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>

    {/* Chat Suggestions */}
    {chatMessages.length === 0 && (
      <div className="px-4 py-3 border-t border-border">
        <div className="text-xs text-muted-foreground mb-2">Try asking:</div>
        <div className="flex flex-wrap gap-1">
          {chatSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setChatInput(suggestion)}
              className="px-2 py-1 text-xs bg-muted hover:bg-accent transition-colors rounded-md grow"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    )}

    {/* Follow-up Suggestions for ongoing conversations */}
    {chatMessages.length > 0 && chatMessages.length < 6 && (
      <div className="px-4 py-2 border-t border-border">
        <div className="text-xs text-muted-foreground mb-2">Follow up:</div>
        <div className="flex flex-wrap gap-1">
          {chatSuggestions.slice(0, 3).map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setChatInput(suggestion)}
              className="px-2 py-1 text-xs bg-muted hover:bg-accent transition-colors rounded-md"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    )}

    {/* Chat Input */}
    <div className="border-t border-border p-3">
      <form onSubmit={handleChatSend} className="flex gap-2">
        <Textarea
          ref={chatInputRef}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask about your data..."
          className="flex-1 min-h-[36px] max-h-[72px] resize-none text-sm"
          disabled={chatLoading}
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleChatSend(e);
            }
          }}
        />
        <Button
          type="submit"
          disabled={chatLoading || !chatInput.trim()}
          loading={chatLoading}
          size="icon"
          className="self-end shrink-0"
        >
          {chatLoading ? <></> : <Send className="w-3 h-3" />}
        </Button>
        {chatStreaming && abortController && (
          <Button
            type="button"
            onClick={handleStopGeneration}
            variant="destructive"
            size="icon"
            className="self-end shrink-0"
          >
            <Square className="w-3 h-3" />
          </Button>
        )}
      </form>
      <div className="text-xs text-muted-foreground mt-2">
        <Kbd size="sm">Enter</Kbd> to send
      </div>
    </div>
  </div>
);

export function FormAnalytics({ form }: FormAnalyticsProps) {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeView, setActiveView] = useState<"cards" | "table">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState<{
    timeRange: "all" | "today" | "week" | "month";
    completionRate: "all" | "complete" | "partial" | "empty";
  }>({
    timeRange: "all",
    completionRate: "all",
  });
  const [selectedSubmission, setSelectedSubmission] =
    useState<FormSubmission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // AI Chat States
  const [chatOpen, setChatOpen] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<
    Array<{
      role: "user" | "assistant";
      content: string;
      timestamp: Date;
    }>
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatStreaming, setChatStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    loadSubmissions();

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, [form.id]);

  const loadSubmissions = async () => {
    try {
      const formSubmissions = await formsDb.getFormSubmissions(form.id);
      setSubmissions(formSubmissions);
    } catch (error) {
      console.error("Error loading submissions:", error);
      toast.error("Failed to load form submissions");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadSubmissions();
    setRefreshing(false);
    toast.success("Data refreshed!");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFieldLabel = (fieldId: string) => {
    // Check in direct fields array first
    let field = form.schema.fields?.find((f) => f.id === fieldId);

    // If not found, check in blocks
    if (!field && form.schema.blocks) {
      for (const block of form.schema.blocks) {
        field = block.fields?.find((f) => f.id === fieldId);
        if (field) break;
      }
    }

    return field?.label || fieldId;
  };

  const exportToJSON = () => {
    const exportData = {
      form: {
        id: form.id,
        title: form.title,
        description: form.description,
        schema: form.schema,
        created_at: form.created_at,
        updated_at: form.updated_at,
      },
      submissions: submissions.map((submission) => ({
        id: submission.id,
        data: submission.submission_data,
        submitted_at: submission.submitted_at,
        ip_address: submission.ip_address,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.title
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}_data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Data exported successfully!");
  };

  const exportToCSV = () => {
    if (submissions.length === 0) {
      toast.error("No data to export");
      return;
    }

    // Get all unique field keys from submissions
    const allFields = new Set<string>();
    submissions.forEach((submission) => {
      Object.keys(submission.submission_data).forEach((key) =>
        allFields.add(key)
      );
    });

    // Create header row
    const headers = [
      "Submission ID",
      "Submitted At",
      "IP Address",
      ...Array.from(allFields),
    ];

    // Create data rows
    const rows = submissions.map((submission) => {
      const row = [
        submission.id,
        new Date(submission.submitted_at).toISOString(),
        submission.ip_address || "",
      ];

      // Add field values in order
      Array.from(allFields).forEach((field) => {
        const value = submission.submission_data[field];
        if (Array.isArray(value)) {
          row.push(value.join(", "));
        } else if (typeof value === "object" && value !== null) {
          row.push(JSON.stringify(value));
        } else {
          row.push(value || "");
        }
      });

      return row;
    });

    // Convert to CSV
    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.title
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}_data.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Data exported to CSV successfully!");
  };

  // AI Chat Functions
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, streamedContent]);

  // Focus chat input when modal opens
  useEffect(() => {
    if (chatOpen && chatInputRef.current) {
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 100);
    }
  }, [chatOpen]);

  const handleChatSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    // Generate session ID if this is the first message
    let sessionId = chatSessionId;
    if (!sessionId) {
      sessionId = generateSessionId();
      setChatSessionId(sessionId);
    }

    const userMessage = {
      role: "user" as const,
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setChatLoading(true);
    setChatStreaming(true);
    setStreamedContent("");

    // Create abort controller for this request
    const controller = new AbortController();
    setAbortController(controller);

    try {
      // Prepare analytics context
      const analyticsContext = {
        form: {
          id: form.id,
          title: form.title,
          description: form.description,
          is_published: form.is_published,
          created_at: form.created_at,
          updated_at: form.updated_at,
          schema: form.schema,
        },
        submissions: submissions,
        analytics: {
          totalSubmissions,
          completionRate,
          recentSubmissions: recentSubmissions.length,
          mostActiveDay: mostActiveDay?.[0] || null,
          lastSubmission: lastSubmission?.submitted_at || null,
          avgSubmissionsPerDay,
          bounceRate,
          peakHour: peakHour ? `${peakHour[0]}:00` : null,
          uniqueResponses: Object.values(fieldAnalytics).reduce(
            (total, field) => total + field.uniqueValues,
            0
          ),
          fieldAnalytics,
          topFields,
          worstFields,
          submissionTrends,
          conversionFunnel,
        },
      };

      const response = await fetch("/api/analytics-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: chatMessages.concat(userMessage),
          formId: form.id,
          context: analyticsContext,
          sessionId: sessionId,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Get session ID from response headers if not already set
      const responseSessionId = response.headers.get("X-Session-ID");
      if (responseSessionId && !chatSessionId) {
        setChatSessionId(responseSessionId);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response stream");
      }

      let fullResponse = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        fullResponse += chunk;
        setStreamedContent(fullResponse);
      }

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: fullResponse,
          timestamp: new Date(),
        },
      ]);

      setStreamedContent("");
      setChatStreaming(false);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        // Handle abortion gracefully
        const partialResponse = streamedContent;
        if (partialResponse.trim()) {
          setChatMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: partialResponse + "\n\n[Response stopped by user]",
              timestamp: new Date(),
            },
          ]);
        }
        setStreamedContent("");
      } else {
        console.error("Chat error:", error);
        toast.error("Failed to send message. Please try again.");
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
            timestamp: new Date(),
          },
        ]);
      }
    } finally {
      setChatLoading(false);
      setChatStreaming(false);
      setAbortController(null);
    }
  };

  const handleStopGeneration = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  // Calculate analytics
  const totalSubmissions = submissions.length;
  const lastSubmission = submissions.length > 0 ? submissions[0] : null;

  // Calculate total fields from both fields array and blocks
  const fieldsFromDirectArray = form.schema.fields?.length || 0;
  const fieldsFromBlocks =
    form.schema.blocks?.reduce((total, block) => {
      return total + (block.fields?.length || 0);
    }, 0) || 0;
  const totalFields = Math.max(fieldsFromDirectArray, fieldsFromBlocks);

  // Calculate submissions over time (last 30 days)
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  const recentSubmissions = submissions.filter(
    (sub) => new Date(sub.submitted_at) >= last30Days
  );

  // Configure table columns
  const tableColumns: DataTableColumn<FormSubmission>[] = [
    {
      key: "submitted_at",
      header: "Date",
      render: (value) => formatDate(value.toString()),
    },
    {
      key: "submission_data",
      header: "Form Data",
      render: (value, row) => (
        <div className="flex items-center gap-4">
          <Badge variant="outline">{Object.keys(value).length} fields</Badge>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSubmission(row);
              setIsModalOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
            View Details
          </Button>
        </div>
      ),
    },
  ];

  // Calculate completion rate and field stats
  const fieldStats = submissions.reduce(
    (acc, sub) => {
      const filledFields = Object.values(sub.submission_data).filter(
        (val) => val !== "" && val !== null && val !== undefined
      ).length;
      acc.totalFilledFields += filledFields;
      acc.fieldCompletionRates[filledFields] =
        (acc.fieldCompletionRates[filledFields] || 0) + 1;
      return acc;
    },
    {
      totalFilledFields: 0,
      fieldCompletionRates: {} as Record<number, number>,
    }
  );

  const completionRate =
    submissions.length > 0 && totalFields > 0
      ? Math.round(
          (fieldStats.totalFilledFields / (submissions.length * totalFields)) *
            100
        )
      : 0;

  // Calculate submission trends
  const submissionsByDay = submissions.reduce((acc, sub) => {
    const date = new Date(sub.submitted_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get most active day
  const mostActiveDay = Object.entries(submissionsByDay).sort(
    ([, a], [, b]) => b - a
  )[0];

  // Calculate additional analytics
  const avgSubmissionsPerDay =
    submissions.length > 0
      ? Math.round(
          (submissions.length /
            Math.max(1, Object.keys(submissionsByDay).length)) *
            10
        ) / 10
      : 0;

  // Calculate field-specific analytics
  const fieldAnalytics = React.useMemo(() => {
    const analytics: Record<
      string,
      {
        label: string;
        totalResponses: number;
        completionRate: number;
        uniqueValues: number;
        mostCommonValue: string | null;
        averageLength?: number;
      }
    > = {};

    // Get all possible fields
    const allPossibleFields: any[] = [];
    if (form.schema.fields) {
      allPossibleFields.push(...form.schema.fields);
    }
    if (form.schema.blocks) {
      form.schema.blocks.forEach((block) => {
        if (block.fields) {
          allPossibleFields.push(...block.fields);
        }
      });
    }

    allPossibleFields.forEach((field) => {
      const responses = submissions
        .map((sub) => sub.submission_data[field.id])
        .filter((val) => val !== "" && val !== null && val !== undefined);

      const valueFrequency: Record<string, number> = {};
      let totalLength = 0;

      responses.forEach((response) => {
        const stringValue = Array.isArray(response)
          ? response.join(", ")
          : String(response);

        valueFrequency[stringValue] = (valueFrequency[stringValue] || 0) + 1;
        totalLength += stringValue.length;
      });

      const mostCommon = Object.entries(valueFrequency).sort(
        ([, a], [, b]) => b - a
      )[0];

      analytics[field.id] = {
        label: field.label,
        totalResponses: responses.length,
        completionRate:
          submissions.length > 0
            ? Math.round((responses.length / submissions.length) * 100)
            : 0,
        uniqueValues: Object.keys(valueFrequency).length,
        mostCommonValue: mostCommon ? mostCommon[0] : null,
        averageLength:
          responses.length > 0 ? Math.round(totalLength / responses.length) : 0,
      };
    });

    return analytics;
  }, [submissions, form.schema]);

  // Calculate submission trends (last 7 days)
  const submissionTrends = React.useMemo(() => {
    const trends: Record<string, number> = {};
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toLocaleDateString();
      trends[dateKey] = 0;
    }

    submissions.forEach((sub) => {
      const subDate = new Date(sub.submitted_at);
      if (subDate >= last7Days) {
        const dateKey = subDate.toLocaleDateString();
        if (trends[dateKey] !== undefined) {
          trends[dateKey]++;
        }
      }
    });

    return trends;
  }, [submissions]);

  // Calculate peak hours
  const hourlySubmissions = React.useMemo(() => {
    const hours: Record<number, number> = {};

    for (let i = 0; i < 24; i++) {
      hours[i] = 0;
    }

    submissions.forEach((sub) => {
      const hour = new Date(sub.submitted_at).getHours();
      hours[hour]++;
    });

    return hours;
  }, [submissions]);

  const peakHour = Object.entries(hourlySubmissions).sort(
    ([, a], [, b]) => b - a
  )[0];

  // Calculate bounce rate (submissions with only 1 field filled)
  const bounceRate = React.useMemo(() => {
    if (submissions.length === 0) return 0;

    const bouncedSubmissions = submissions.filter((sub) => {
      const filledFields = Object.values(sub.submission_data).filter(
        (val) => val !== "" && val !== null && val !== undefined
      ).length;
      return filledFields <= 1;
    });

    return Math.round((bouncedSubmissions.length / submissions.length) * 100);
  }, [submissions]);

  // Calculate conversion funnel for multi-step forms
  const conversionFunnel = React.useMemo(() => {
    if (!form.schema.settings?.multiStep || !form.schema.blocks) return null;

    const funnel = form.schema.blocks.map((block) => {
      const blockFieldIds = block.fields?.map((f) => f.id) || [];
      const completedCount = submissions.filter((sub) => {
        return blockFieldIds.some((fieldId) => {
          const value = sub.submission_data[fieldId];
          return value !== "" && value !== null && value !== undefined;
        });
      }).length;

      return {
        stepName: block.title,
        completedCount,
        conversionRate:
          submissions.length > 0
            ? Math.round((completedCount / submissions.length) * 100)
            : 0,
      };
    });

    return funnel;
  }, [submissions, form.schema]);

  // Get top field completion rates
  const topFields = Object.entries(fieldAnalytics)
    .sort(([, a], [, b]) => b.completionRate - a.completionRate)
    .slice(0, 5);

  // Get worst performing fields
  const worstFields = Object.entries(fieldAnalytics)
    .sort(([, a], [, b]) => a.completionRate - b.completionRate)
    .slice(0, 3);

  // Dynamic chat suggestions based on conversation and data
  const generateChatSuggestions = () => {
    const hasSubmissions = submissions.length > 0;
    const hasRecentSubmissions = recentSubmissions.length > 0;
    const hasMultipleFields = totalFields > 1;
    const isMultiStep = form.schema.settings?.multiStep;
    const conversationLength = chatMessages.length;

    // Base suggestions for new conversations
    const baseSuggestions = [
      "What are these submissions about?",
      "Show me the most common responses",
      "How many submissions did I get today?",
      "Which fields do users skip most?",
      "What's my form's completion rate?",
    ];

    // Context-aware suggestions based on data
    const contextSuggestions = [];

    if (hasSubmissions) {
      if (hasRecentSubmissions) {
        contextSuggestions.push("How is my form performing this week?");
        contextSuggestions.push("What's the trend in submissions?");
      }

      if (hasMultipleFields) {
        contextSuggestions.push("Which field has the best completion rate?");
        contextSuggestions.push(
          "What insights do you have about field performance?"
        );
      }

      if (isMultiStep) {
        contextSuggestions.push("Show me the conversion funnel");
        contextSuggestions.push("Where do users drop off most?");
      }

      if (totalSubmissions > 50) {
        contextSuggestions.push("What patterns do you see in the data?");
        contextSuggestions.push("Give me optimization recommendations");
      }
    }

    // Follow-up suggestions for ongoing conversations
    const followUpSuggestions = [
      "What about that field?",
      "Tell me more about those numbers",
      "How can I improve that?",
      "What else should I know?",
      "Can you expand on that insight?",
      "What's the next step?",
      "Show me more details",
      "Compare that to last month",
      "What's causing that trend?",
      "Give me actionable recommendations",
    ];

    // Choose suggestions based on conversation state
    if (conversationLength === 0) {
      // New conversation - show context-aware or base suggestions
      const suggestions =
        contextSuggestions.length > 0 ? contextSuggestions : baseSuggestions;
      return suggestions.slice(0, 5);
    } else if (conversationLength < 4) {
      // Early conversation - mix of context and follow-up
      return [
        ...contextSuggestions.slice(0, 3),
        ...followUpSuggestions.slice(0, 2),
      ];
    } else {
      // Ongoing conversation - focus on follow-up questions
      return followUpSuggestions.slice(0, 5);
    }
  };

  const chatSuggestions = generateChatSuggestions();

  const getSubmissionCompletionRate = (submission: FormSubmission) => {
    if (totalFields === 0) return 0;

    const filledFields = Object.values(submission.submission_data).filter(
      (val) => val !== "" && val !== null && val !== undefined
    ).length;
    return (filledFields / totalFields) * 100;
  };

  const filterSubmissions = (submissions: FormSubmission[]) => {
    return submissions.filter((submission) => {
      // Search term filter
      if (searchTerm) {
        const searchString = JSON.stringify(submission).toLowerCase();
        if (!searchString.includes(searchTerm.toLowerCase())) {
          return false;
        }
      }

      // Time range filter
      const submissionDate = new Date(submission.submitted_at);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (filterState.timeRange !== "all") {
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);

        switch (filterState.timeRange) {
          case "today":
            if (submissionDate < today) return false;
            break;
          case "week":
            startDate.setDate(startDate.getDate() - 7);
            if (submissionDate < startDate) return false;
            break;
          case "month":
            startDate.setMonth(startDate.getMonth() - 1);
            if (submissionDate < startDate) return false;
            break;
        }
      }

      // Completion rate filter
      if (filterState.completionRate !== "all") {
        const completionRate = getSubmissionCompletionRate(submission);
        switch (filterState.completionRate) {
          case "complete":
            if (completionRate < 100) return false;
            break;
          case "partial":
            if (completionRate < 1 || completionRate === 100) return false;
            break;
          case "empty":
            if (completionRate > 0) return false;
            break;
        }
      }

      return true;
    });
  };

  const filteredSubmissions = filterSubmissions(submissions);

  const getActiveFilters = () => {
    const filters: string[] = [];

    if (searchTerm) {
      filters.push(`Search: "${searchTerm}"`);
    }

    if (filterState.timeRange !== "all") {
      const ranges = {
        today: "Today",
        week: "Last 7 Days",
        month: "Last 30 Days",
      };
      filters.push(`Time: ${ranges[filterState.timeRange]}`);
    }

    if (filterState.completionRate !== "all") {
      const rates = {
        complete: "Complete",
        partial: "Partial",
        empty: "Empty",
      };
      filters.push(`Completion: ${rates[filterState.completionRate]}`);
    }

    return filters;
  };

  const activeFilters = getActiveFilters();

  const SubmissionDetailsModal = () => {
    if (!selectedSubmission) return null;

    return (
      <Modal open={isModalOpen} onOpenChange={(open) => setIsModalOpen(open)}>
        <ModalContent className="max-w-3xl">
          <ModalHeader>
            <ModalTitle>Submission Details</ModalTitle>
            <ModalClose onClick={() => setIsModalOpen(false)} />
          </ModalHeader>
          <ScrollArea className="max-h-[70vh] px-6">
            <div className="space-y-4 pb-6">
              <div className="flex items-center justify-between">
                <Badge variant="outline">
                  {formatDate(selectedSubmission.submitted_at)}
                </Badge>
              </div>
              <Separator />
              {Object.entries(selectedSubmission.submission_data).map(
                ([key, value]) => (
                  <div key={key} className="space-y-1">
                    <h3 className="text-sm font-medium">
                      {getFieldLabel(key)}
                    </h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {typeof value === "object"
                        ? JSON.stringify(value, null, 2)
                        : String(value)}
                    </p>
                    <Separator />
                  </div>
                )
              )}
            </div>
          </ScrollArea>
        </ModalContent>
      </Modal>
    );
  };

  // Place this component before the return statement
  const renderSubmissionDetailsModal = () => {
    return <SubmissionDetailsModal />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="mx-auto p-6">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="p-4 bg-accent/10 rounded-card mx-auto w-fit">
                <Loader />
              </div>
              <div className="space-y-1">
                <p className="text-foreground font-medium">
                  Loading analytics...
                </p>
                <p className="text-sm text-muted-foreground">
                  Fetching your form data and submissions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background max-w-[95%] mx-auto w-full px-6">
      <div className="mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-4 w">
            <Button asChild variant={"secondary"} className="font-medium w-fit">
              <Link href="/dashboard" className="flex items-center z-1">
                Go to Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">
                {form.title}
              </h1>
              <Badge
                variant={form.is_published ? "default" : "secondary"}
                className="gap-1.5"
              >
                {form.is_published ? (
                  <>
                    <Globe className="w-3 h-3" />
                    Published
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3" />
                    Draft
                  </>
                )}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Form Analytics & Submission Data
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={refreshing}
                className="gap-2 hover:bg-accent transition-colors"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                disabled={submissions.length === 0}
                className="gap-2 hover:bg-accent transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToJSON}
                className="gap-2 hover:bg-accent transition-colors"
              >
                <Download className="w-4 h-4" />
                Export JSON
              </Button>
              <Button
                variant="default"
                size={"sm"}
                onClick={() => setChatOpen(true)}
                className="gap-2 font-medium"
              >
                <Sparkles className="w-4 h-4" />
                Kiko AI
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-card">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Submissions
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {totalSubmissions.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-card">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Form Fields
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {totalFields}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-card">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Completion Rate
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {completionRate}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 rounded-card">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Last 30 Days
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {recentSubmissions.length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Enhanced Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-card">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Avg. Daily Submissions
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {avgSubmissionsPerDay}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 rounded-card">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Bounce Rate
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {bounceRate}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-card">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Peak Hour
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {peakHour ? `${peakHour[0]}:00` : "N/A"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-card">
                <PieChart className="w-6 h-6 text-purple-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Unique Responses
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {Object.values(fieldAnalytics).reduce(
                    (total, field) => total + field.uniqueValues,
                    0
                  )}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-card">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Last Submission
              </h3>
            </div>
            {lastSubmission ? (
              <div className="space-y-2">
                <p className="text-foreground font-medium">
                  {formatDate(lastSubmission.submitted_at)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {lastSubmission.ip_address &&
                    `From ${lastSubmission.ip_address}`}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">No submissions yet</p>
            )}
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent rounded-card">
                <BarChart3 className="w-5 h-5 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Form Status
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Published</span>
                <Badge variant={form.is_published ? "default" : "secondary"}>
                  {form.is_published ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm text-foreground">
                  {formatDate(form.created_at)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Updated</span>
                <span className="text-sm text-foreground">
                  {formatDate(form.updated_at)}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-secondary rounded-card">
                <TrendingUp className="w-5 h-5 text-secondary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Quick Stats
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Avg. Fields Completed
                </span>
                <span className="text-sm font-medium text-foreground">
                  {completionRate}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Most Active Day
                </span>
                {mostActiveDay ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {mostActiveDay[0]}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {mostActiveDay[1]} submissions
                    </Badge>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">N/A</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Form Type</span>
                <Badge variant="outline">
                  {form.schema.settings?.multiStep
                    ? "Multi-Step"
                    : "Single Page"}
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Submissions List */}
        <Card className="bg-card border-border">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-card">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Form Submissions
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    View and analyze form responses
                  </p>
                </div>
              </div>
              {submissions.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center p-1 bg-accent/10 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 gap-2 data-[state=on]:bg-background"
                      data-state={activeView === "cards" ? "on" : "off"}
                      onClick={() => setActiveView("cards")}
                    >
                      <LayoutGrid className="w-4 h-4" />
                      Cards
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 gap-2 data-[state=on]:bg-background"
                      data-state={activeView === "table" ? "on" : "off"}
                      onClick={() => setActiveView("table")}
                    >
                      <Table className="w-4 h-4" />
                      Table
                    </Button>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {submissions.length} total
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            {submissions.length === 0 ? (
              <div className="text-center py-16">
                <div className="gradient-bg w-24 h-24 rounded-card mx-auto mb-6 flex items-center justify-center">
                  <Eye className="w-10 h-10 text-accent-foreground" />
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  No submissions yet
                </h4>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Once people start filling out your form, their responses will
                  appear here with detailed analytics and insights.
                </p>
                {!form.is_published && (
                  <div className="space-y-3">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Globe className="w-4 h-4" />
                      Publish Form
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Publish your form to start collecting responses
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.length > 0 && (
                  <>
                    {activeView === "cards" ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="Search submissions..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              leftIcon={<Search />}
                            />
                          </div>
                          <Select
                            value={filterState.timeRange}
                            onValueChange={(
                              value: typeof filterState.timeRange
                            ) =>
                              setFilterState((prev) => ({
                                ...prev,
                                timeRange: value,
                              }))
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select time range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Time</SelectItem>
                              <SelectItem value="today">Today</SelectItem>
                              <SelectItem value="week">Last 7 Days</SelectItem>
                              <SelectItem value="month">
                                Last 30 Days
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={filterState.completionRate}
                            onValueChange={(
                              value: typeof filterState.completionRate
                            ) =>
                              setFilterState((prev) => ({
                                ...prev,
                                completionRate: value,
                              }))
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select completion" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                All Submissions
                              </SelectItem>
                              <SelectItem value="complete">Complete</SelectItem>
                              <SelectItem value="partial">Partial</SelectItem>
                              <SelectItem value="empty">Empty</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {filteredSubmissions.slice(0, 10).map((submission) => (
                          <div key={submission.id}>
                            <Card
                              key={submission.id}
                              className="p-4  duration-200 "
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                                  <span className="text-sm font-medium text-foreground">
                                    Submission {submission.id.slice(-8)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(submission.submitted_at)}
                                  </span>
                                  {submission.ip_address && (
                                    <span>IP: {submission.ip_address}</span>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(submission.submission_data).map(
                                  ([fieldId, value]) => (
                                    <div
                                      key={fieldId}
                                      className="flex flex-col gap-2"
                                    >
                                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {getFieldLabel(fieldId)}
                                      </label>
                                      <div className="p-2 bg-input border border-border rounded-ele">
                                        <p className="text-sm text-foreground line-clamp-2">
                                          {Array.isArray(value)
                                            ? value.join(", ")
                                            : typeof value === "object" &&
                                              value !== null
                                            ? JSON.stringify(value)
                                            : String(value) || "—"}
                                        </p>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </Card>
                            <Separator className="mt-4" />
                          </div>
                        ))}

                        {submissions.length > 10 && (
                          <div className="text-center pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground mb-3">
                              Showing 10 of {submissions.length} submissions
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View All Submissions
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="-mx-6">
                        <DataTable
                          data={filteredSubmissions}
                          columns={tableColumns}
                          searchable
                          searchPlaceholder="Search submissions..."
                          itemsPerPage={10}
                          showPagination
                          hoverable
                          bordered
                          variant="bordered"
                          size="default"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Submission Details Modal */}
      {selectedSubmission && (
        <Modal open={isModalOpen} onOpenChange={(open) => setIsModalOpen(open)}>
          <ModalContent className="max-w-3xl">
            <ModalHeader className="border-b border-border px-6 py-4">
              <ModalTitle>Submission Details</ModalTitle>
              <ModalClose onClick={() => setIsModalOpen(false)} />
            </ModalHeader>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline">
                  {formatDate(selectedSubmission.submitted_at)}
                </Badge>
              </div>
              <ScrollArea className="h-[60vh]">
                <div className="space-y-4 pr-4">
                  {Object.entries(selectedSubmission.submission_data).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="space-y-2 pb-4 border-b border-border last:border-0"
                      >
                        <h3 className="text-sm font-medium">
                          {getFieldLabel(key)}
                        </h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {typeof value === "object"
                            ? JSON.stringify(value, null, 2)
                            : String(value)}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </ScrollArea>
            </div>
          </ModalContent>
        </Modal>
      )}

      {/* Floating Chat Button */}
      <Button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-ele transition-all duration-200 z-50 border border-border bg-transparent hover:bg-transparent shadow-xl"
        size="icon"
      >
        {mounted && theme === "light" ? (
          <Image
            src="/logo.svg"
            alt="Ikiform"
            width={100}
            height={100}
            className="pointer-events-none invert  rounded-ele"
          />
        ) : (
          <Image
            src="/logo.svg"
            alt="Ikiform"
            width={100}
            height={100}
            className="pointer-events-none  rounded-ele"
          />
        )}
      </Button>

      {/* Desktop: Chat Modal */}
      {!isMobile && (
        <Modal open={chatOpen} onOpenChange={setChatOpen}>
          <ModalContent className="max-w-3xl h-[800px] flex flex-col">
            <ModalHeader className="px-4 py-3 flex items-center justify-between">
              <div
                className="sr-only flex items-center gap-2"
                aria-hidden="true"
              >
                <Bot className="w-4 h-4 text-primary" />
                <span className="font-medium">Kiko</span>
              </div>
              <div className="flex items-center gap-2">
                <ModalClose onClick={() => setChatOpen(false)} />
              </div>
            </ModalHeader>

            <div className="flex-1 min-h-0">
              <ChatInterface
                chatMessages={chatMessages}
                chatStreaming={chatStreaming}
                streamedContent={streamedContent}
                chatLoading={chatLoading}
                messagesEndRef={messagesEndRef}
                chatSuggestions={chatSuggestions}
                setChatInput={setChatInput}
                handleChatSend={handleChatSend}
                chatInputRef={chatInputRef}
                chatInput={chatInput}
                abortController={abortController}
                handleStopGeneration={handleStopGeneration}
              />
            </div>
          </ModalContent>
        </Modal>
      )}

      {/* Mobile: Chat Drawer */}
      {isMobile && (
        <Drawer open={chatOpen} onOpenChange={setChatOpen}>
          <DrawerContent className="h-[85vh]">
            <DrawerHeader className="border-b border-border flex items-center justify-between">
              <div className="sr-only flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" />
                <DrawerTitle>Kiko</DrawerTitle>
              </div>
              <div className="flex items-center gap-2">
                <DrawerCloseButton />
              </div>
              <DrawerDescription className="sr-only">
                Chat with AI about your form analytics
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex-1 min-h-0">
              <ChatInterface
                chatMessages={chatMessages}
                chatStreaming={chatStreaming}
                streamedContent={streamedContent}
                chatLoading={chatLoading}
                messagesEndRef={messagesEndRef}
                chatSuggestions={chatSuggestions}
                setChatInput={setChatInput}
                handleChatSend={handleChatSend}
                chatInputRef={chatInputRef}
                chatInput={chatInput}
                abortController={abortController}
                handleStopGeneration={handleStopGeneration}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
