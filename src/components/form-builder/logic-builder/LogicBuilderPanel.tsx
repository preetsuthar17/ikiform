import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
} from "@/components/ui/modal";
import type { FormField } from "@/lib/database";
import {
  LogicActionCondition,
  LogicConditionGroup,
  LogicAction,
} from "./types";
import { ActionListEditor } from "./ActionListEditor";
import { ConditionGroupEditor } from "./ConditionGroupEditor";
import { Loader } from "@/components/ui/loader";
import { Copy, Check, Pencil, Trash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "next-themes";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { motion } from "motion/react";

// Singleton highlighter for Shiki
let highlighterInstance: any = null;
let highlighterPromise: Promise<any> | null = null;
const getHighlighter = async () => {
  if (highlighterInstance) return highlighterInstance;
  if (highlighterPromise) return highlighterPromise;
  highlighterPromise = import("shiki").then(async (shiki) => {
    const highlighter = await shiki.createHighlighter({
      langs: ["json"],
      themes: ["github-dark", "github-light"],
    });
    highlighterInstance = highlighter;
    highlighterPromise = null;
    return highlighter;
  });
  return highlighterPromise;
};

function summarizeConditionGroup(
  group: LogicConditionGroup,
  fields: FormField[],
): string {
  if (
    !group ||
    !Array.isArray(group.conditions) ||
    group.conditions.length === 0
  )
    return "(always)";
  return group.conditions
    .map((cond) => {
      if ("logic" in cond) return `(${summarizeConditionGroup(cond, fields)})`;
      const field =
        fields.find((f) => f.id === cond.field)?.label || cond.field;
      const op =
        cond.operator === "equals"
          ? "="
          : cond.operator === "not_equals"
            ? "≠"
            : cond.operator === "greater_than"
              ? ">"
              : cond.operator === "less_than"
                ? "<"
                : cond.operator === "contains"
                  ? "contains"
                  : cond.operator === "not_contains"
                    ? "not contains"
                    : cond.operator === "is_empty"
                      ? "is empty"
                      : cond.operator === "is_not_empty"
                        ? "is not empty"
                        : cond.operator === "includes"
                          ? "includes"
                          : cond.operator;
      return `${field} ${op}${cond.value !== undefined && cond.value !== "" ? ` ${cond.value}` : ""}`;
    })
    .join(group.logic === "AND" ? " AND " : " OR ");
}

function getFieldLogicMap(logic: LogicActionCondition[], fields: FormField[]) {
  // Map: fieldId -> array of { rule, actionType }
  const map: Record<
    string,
    { rule: LogicActionCondition; actionType: string }[]
  > = {};
  fields.forEach((f) => (map[f.id] = []));
  logic.forEach((rule) => {
    if (rule?.action?.target && map[rule.action.target]) {
      map[rule.action.target].push({ rule, actionType: rule.action.type });
    }
  });
  return map;
}

function LogicItemEditor({
  open,
  onClose,
  item,
  onSave,
  fields,
}: {
  open: boolean;
  onClose: () => void;
  item?: LogicActionCondition;
  onSave: (item: LogicActionCondition) => void;
  fields: FormField[];
}) {
  // Robust fallback for condition group
  const initialCondition: LogicConditionGroup =
    item?.condition && Array.isArray(item.condition.conditions)
      ? item.condition
      : {
          id: `group-${Date.now()}`,
          logic: "AND",
          conditions: [],
        };
  const [condition, setCondition] =
    React.useState<LogicConditionGroup>(initialCondition);
  const [action, setAction] = React.useState<LogicAction>(
    item?.action || {
      id: `action-${Date.now()}`,
      type: "show",
      target: fields[0]?.id || "",
    },
  );

  React.useEffect(() => {
    // Debug log for tracing condition state
    if (open) {
      // eslint-disable-next-line no-console
      console.log("[LogicItemEditor] Editing item:", item);
      // eslint-disable-next-line no-console
      console.log("[LogicItemEditor] Initial condition:", initialCondition);
    }
  }, [open, item, initialCondition]);

  return (
    <Modal open={open} onOpenChange={(v) => !v && onClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{item ? "Edit Logic" : "Add Logic"}</ModalTitle>
        </ModalHeader>
        <div className="mb-4">
          <div className="font-semibold mb-2">Condition</div>
          <ConditionGroupEditor
            group={condition}
            onChange={setCondition}
            fields={fields}
          />
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-2">Action</div>
          <ActionListEditor
            actions={[action]}
            onChange={([a]) => setAction(a)}
            fields={fields}
            singleAction
          />
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              onSave({
                id: item?.id || `logic-${Date.now()}`,
                condition,
                action,
              })
            }
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

const MIN_HEIGHT = 100;
const MAX_HEIGHT = 600;
const DEFAULT_HEIGHT = 360;

function CollapsibleBottomPanel({ children }: { children: React.ReactNode }) {
  const [height, setHeight] = React.useState(DEFAULT_HEIGHT);
  const [collapsed, setCollapsed] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const startY = React.useRef(0);
  const startHeight = React.useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (collapsed) return;
    startY.current = e.clientY;
    startHeight.current = height;
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };
  const handlePointerMove = (e: PointerEvent) => {
    const delta = startY.current - e.clientY;
    let newHeight = startHeight.current + delta;
    newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newHeight));
    setHeight(newHeight);
  };
  const handlePointerUp = () => {
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  };
  const handleToggle = () => setCollapsed((c) => !c);

  return (
    <div
      ref={panelRef}
      className={`w-full transition-all duration-200 bg-background border-t border-border shadow-lg flex flex-col ${collapsed ? "h-8" : ""}`}
      style={{ height: collapsed ? MIN_HEIGHT : height }}
    >
      <div
        className="w-full h-6 cursor-ns-resize flex items-center justify-center bg-muted/30 hover:bg-muted/50 transition border-b border-border group select-none"
        onPointerDown={handlePointerDown}
        onClick={handleToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ touchAction: "none" }}
        aria-label={collapsed ? "Expand logic panel" : "Collapse logic panel"}
        tabIndex={0}
        role="button"
      >
        <svg
          width="32"
          height="24"
          viewBox="0 0 32 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            initial={false}
            animate={{
              d: collapsed ? "M4 16L16 8L28 16" : "M4 8L16 16L28 8",
            }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 18,
              mass: 0.7,
            }}
            stroke="currentColor"
          />
        </svg>
      </div>
      <div className={`flex-1 min-h-0`}>{children}</div>
    </div>
  );
}

function LogicBuilderPanelContent({
  logic,
  onLogicChange,
  fields,
}: {
  logic: LogicActionCondition[];
  onLogicChange: (logic: LogicActionCondition[]) => void;
  fields: FormField[];
}) {
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<
    LogicActionCondition | undefined
  >(undefined);
  const [showJson, setShowJson] = React.useState(false);
  const [highlightedJson, setHighlightedJson] = React.useState<string>("");
  const [loadingHighlight, setLoadingHighlight] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("rules");
  const { theme } = useTheme();

  React.useEffect(() => {
    if (!showJson) return;
    let cancelled = false;
    async function highlightJson() {
      setLoadingHighlight(true);
      try {
        const highlighter = await getHighlighter();
        if (cancelled) return;
        const selectedTheme = theme === "dark" ? "github-dark" : "github-light";
        const code = JSON.stringify(logic, null, 2);
        const html = highlighter.codeToHtml(code, {
          lang: "json",
          theme: selectedTheme,
        });
        if (!cancelled) setHighlightedJson(html);
      } catch (e) {
        if (!cancelled)
          setHighlightedJson(
            `<pre><code>${JSON.stringify(logic, null, 2)}</code></pre>`,
          );
      } finally {
        if (!cancelled) setLoadingHighlight(false);
      }
    }
    highlightJson();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showJson, logic, theme]);

  const handleAddItem = () => {
    setEditingItem(undefined);
    setEditorOpen(true);
  };

  const handleEditItem = (id: string) => {
    const item = logic.find((r) => r.id === id);
    setEditingItem(item);
    setEditorOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    onLogicChange(logic.filter((r) => r.id !== id));
  };

  const handleSaveItem = (item: LogicActionCondition) => {
    const exists = logic.some((r) => r.id === item.id);
    if (exists) {
      onLogicChange(logic.map((r) => (r.id === item.id ? item : r)));
    } else {
      onLogicChange([
        ...logic,
        { ...item, id: item.id || `logic-${Date.now()}` },
      ]);
    }
    setEditorOpen(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(logic, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const fieldLogicMap = React.useMemo(
    () => getFieldLogicMap(logic, fields),
    [logic, fields],
  );

  return (
    <Card className="p-0 h-full flex flex-col">
      <CardContent className="flex-1 flex flex-col p-4">
        <Tabs
          items={[
            { id: "rules", label: "Logic Rules" },
            { id: "fields", label: "Field Logic" },
          ]}
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-4"
        />
        <TabsContent value="rules" activeValue={activeTab}>
          {/* Existing logic rules UI */}
          <div className="space-y-4 mb-4">
            <div className="flex items-center justify-between mb-2 gap-2">
              <h3 className="text-base font-semibold">Logic Items</h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowJson(true)}
                >
                  Show Logic JSON
                </Button>
                <Button size="sm" variant="outline" onClick={handleAddItem}>
                  Add Logic
                </Button>
              </div>
            </div>
            {logic.length === 0 ? (
              <div className="text-muted-foreground text-sm text-center py-8">
                No logic items yet.
              </div>
            ) : (
              <div className="space-y-2">
                {logic.map((item) => {
                  if (!item || !item.action || !item.action.type) {
                    return (
                      <Alert
                        key={item?.id || Math.random()}
                        variant="destructive"
                        className="text-xs"
                      >
                        Malformed logic item (missing action or type)
                      </Alert>
                    );
                  }
                  // Color for action type
                  const actionColor =
                    item.action.type === "show"
                      ? "secondary"
                      : item.action.type === "hide"
                        ? "destructive"
                        : item.action.type === "enable"
                          ? "secondary"
                          : item.action.type === "disable"
                            ? "outline"
                            : "default";
                  return (
                    <Card
                      key={item.id}
                      className="flex items-center justify-between p-3 border bg-muted/10"
                    >
                      <div className="flex-1 flex flex-wrap items-center gap-2 min-w-0">
                        <span className="font-medium">If </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {summarizeConditionGroup(item.condition, fields)}
                        </span>
                        <span className="font-medium ml-1">then</span>
                        <Badge size="sm" variant={actionColor} className="ml-2">
                          {item.action.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-1 truncate">
                          {fields.find((f) => f.id === item.action.target)
                            ?.label || item.action.target}
                        </span>
                      </div>
                      <div className="flex gap-2 ml-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditItem(item.id)}
                          aria-label="Edit logic"
                        >
                          <span className="sr-only">Edit</span>
                          <Pencil />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteItem(item.id)}
                          aria-label="Delete logic"
                        >
                          <span className="sr-only">Delete</span>
                          <Trash />
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="fields" activeValue={activeTab}>
          <div className="space-y-6">
            {fields.map((field) => {
              const rules = fieldLogicMap[field.id];
              return (
                <Card key={field.id} className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm">{field.label}</span>
                    <Badge size="sm" variant="outline">
                      {rules.length} rule{rules.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                  {rules.length === 0 ? (
                    <div className="text-xs text-muted-foreground">
                      No logic rules affect this field.
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {rules.map(({ rule, actionType }) => {
                        const actionColor =
                          actionType === "show"
                            ? "secondary"
                            : actionType === "hide"
                              ? "destructive"
                              : actionType === "enable"
                                ? "secondary"
                                : actionType === "disable"
                                  ? "outline"
                                  : "default";
                        return (
                          <div
                            key={rule.id}
                            className="flex items-center gap-2 text-xs"
                          >
                            <Badge size="sm" variant={actionColor}>
                              {actionType}
                            </Badge>
                            <span className="truncate">
                              If{" "}
                              {summarizeConditionGroup(rule.condition, fields)}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditItem(rule.id)}
                              className="ml-auto"
                            >
                              Edit
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>
        <LogicItemEditor
          open={editorOpen}
          onClose={() => setEditorOpen(false)}
          item={editingItem}
          onSave={handleSaveItem}
          fields={fields}
        />
        <Modal open={showJson} onOpenChange={(v) => !v && setShowJson(false)}>
          <ModalContent className="max-w-2xl">
            <ModalHeader>
              <ModalTitle>Logic JSON</ModalTitle>
            </ModalHeader>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="ml-auto absolute top-3 right-3 z-10"
                disabled={loadingHighlight}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <ScrollArea className="h-[60vh] rounded-ele border bg-muted/30 text-foreground mt-2 mb-2">
                {loadingHighlight ? (
                  <div className="p-4 flex items-center justify-center h-[60vh]">
                    <Loader />
                  </div>
                ) : (
                  <div
                    className="p-4 text-xs font-mono h-full [&_pre]:!bg-transparent [&_pre]:!p-0 shiki-html"
                    dangerouslySetInnerHTML={{ __html: highlightedJson }}
                  />
                )}
              </ScrollArea>
            </div>
            <ModalFooter>
              <Button variant="outline" onClick={() => setShowJson(false)}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </CardContent>
    </Card>
  );
}

function LogicBuilderPanel(props: {
  logic: LogicActionCondition[];
  onLogicChange: (logic: LogicActionCondition[]) => void;
  fields: FormField[];
}) {
  return (
    <CollapsibleBottomPanel>
      <ScrollArea className="flex-1 h-full min-h-0">
        <LogicBuilderPanelContent {...props} />
      </ScrollArea>
    </CollapsibleBottomPanel>
  );
}

export { LogicBuilderPanel };
