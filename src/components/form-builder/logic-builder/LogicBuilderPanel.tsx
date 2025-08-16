import { Check, Copy, Pencil, Trash } from 'lucide-react';
import { motion } from 'motion/react';

import React from 'react';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import type { FormField } from '@/lib/database';
import { ActionListEditor } from './ActionListEditor';
import { ConditionGroupEditor } from './ConditionGroupEditor';
import type {
  LogicAction,
  LogicActionCondition,
  LogicConditionGroup,
} from './types';

let highlighterInstance: any = null;
let highlighterPromise: Promise<any> | null = null;
const getHighlighter = async () => {
  if (highlighterInstance) return highlighterInstance;
  if (highlighterPromise) return highlighterPromise;
  highlighterPromise = import('shiki').then(async (shiki) => {
    const highlighter = await shiki.createHighlighter({
      langs: ['json'],
      themes: ['github-dark', 'github-light'],
    });
    highlighterInstance = highlighter;
    highlighterPromise = null;
    return highlighter;
  });
  return highlighterPromise;
};

function summarizeConditionGroup(
  group: LogicConditionGroup,
  fields: FormField[]
): string {
  if (
    !(group && Array.isArray(group.conditions)) ||
    group.conditions.length === 0
  )
    return '(always)';
  return group.conditions
    .map((cond) => {
      if ('logic' in cond) return `(${summarizeConditionGroup(cond, fields)})`;
      const field =
        fields.find((f) => f.id === cond.field)?.label || cond.field;
      const op =
        cond.operator === 'equals'
          ? '='
          : cond.operator === 'not_equals'
            ? '≠'
            : cond.operator === 'greater_than'
              ? '>'
              : cond.operator === 'less_than'
                ? '<'
                : cond.operator === 'contains'
                  ? 'contains'
                  : cond.operator === 'not_contains'
                    ? 'not contains'
                    : cond.operator === 'is_empty'
                      ? 'is empty'
                      : cond.operator === 'is_not_empty'
                        ? 'is not empty'
                        : cond.operator === 'includes'
                          ? 'includes'
                          : cond.operator;
      return `${field} ${op}${cond.value !== undefined && cond.value !== '' ? ` ${cond.value}` : ''}`;
    })
    .join(group.logic === 'AND' ? ' AND ' : ' OR ');
}

function getFieldLogicMap(logic: LogicActionCondition[], fields: FormField[]) {
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
  const initialCondition: LogicConditionGroup =
    item?.condition && Array.isArray(item.condition.conditions)
      ? item.condition
      : {
          id: `group-${Date.now()}`,
          logic: 'AND',
          conditions: [],
        };
  const [condition, setCondition] =
    React.useState<LogicConditionGroup>(initialCondition);
  const [action, setAction] = React.useState<LogicAction>(
    item?.action || {
      id: `action-${Date.now()}`,
      type: 'show',
      target: fields[0]?.id || '',
    }
  );

  React.useEffect(() => {
    if (open) {
    }
  }, [open, item, initialCondition]);

  return (
    <Modal onOpenChange={(v) => !v && onClose()} open={open}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{item ? 'Edit Logic' : 'Add Logic'}</ModalTitle>
        </ModalHeader>
        <div className="mb-4">
          <div className="mb-2 font-semibold">Condition</div>
          <ConditionGroupEditor
            fields={fields}
            group={condition}
            onChange={setCondition}
          />
        </div>
        <div className="mb-4">
          <div className="mb-2 font-semibold">Action</div>
          <ActionListEditor
            actions={[action]}
            fields={fields}
            onChange={([a]) => setAction(a)}
            singleAction
          />
        </div>
        <ModalFooter>
          <Button onClick={onClose} variant="outline">
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
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };
  const handlePointerMove = (e: PointerEvent) => {
    const delta = startY.current - e.clientY;
    let newHeight = startHeight.current + delta;
    newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newHeight));
    setHeight(newHeight);
  };
  const handlePointerUp = () => {
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  };
  const handleToggle = () => setCollapsed((c) => !c);

  return (
    <div
      className={`flex w-full flex-col border-border border-t bg-background transition-all duration-200 ${collapsed ? 'h-8' : ''}`}
      ref={panelRef}
      style={{ height: collapsed ? MIN_HEIGHT : height }}
    >
      <div
        aria-label={collapsed ? 'Expand logic panel' : 'Collapse logic panel'}
        className="group flex h-6 w-full cursor-ns-resize select-none items-center justify-center border-border border-b bg-muted/30 transition hover:bg-muted/50"
        onClick={handleToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onPointerDown={handlePointerDown}
        role="button"
        style={{ touchAction: 'none' }}
        tabIndex={0}
      >
        <svg
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          viewBox="0 0 32 24"
          width="32"
        >
          <motion.path
            animate={{
              d: collapsed ? 'M4 16L16 8L28 16' : 'M4 8L16 16L28 8',
            }}
            initial={false}
            stroke="currentColor"
            transition={{
              type: 'spring',
              stiffness: 180,
              damping: 18,
              mass: 0.7,
            }}
          />
        </svg>
      </div>
      <div className={'min-h-0 flex-1'}>{children}</div>
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
  const [highlightedJson, setHighlightedJson] = React.useState<string>('');
  const [loadingHighlight, setLoadingHighlight] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('rules');

  React.useEffect(() => {
    if (!showJson) return;
    let cancelled = false;
    async function highlightJson() {
      setLoadingHighlight(true);
      try {
        const highlighter = await getHighlighter();
        if (cancelled) return;
        const selectedTheme = 'github-light';
        const code = JSON.stringify(logic, null, 2);
        const html = highlighter.codeToHtml(code, {
          lang: 'json',
          theme: selectedTheme,
        });
        if (!cancelled) setHighlightedJson(html);
      } catch (e) {
        if (!cancelled)
          setHighlightedJson(
            `<pre><code>${JSON.stringify(logic, null, 2)}</code></pre>`
          );
      } finally {
        if (!cancelled) setLoadingHighlight(false);
      }
    }
    highlightJson();
    return () => {
      cancelled = true;
    };
  }, [showJson, logic]);

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
      const { copyWithToast } = await import('@/lib/utils/clipboard');
      const success = await copyWithToast(
        JSON.stringify(logic, null, 2),
        'Logic rules copied to clipboard!',
        'Failed to copy logic rules'
      );

      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Failed to copy logic rules:', error);
    }
  };

  const fieldLogicMap = React.useMemo(
    () => getFieldLogicMap(logic, fields),
    [logic, fields]
  );

  return (
    <Card className="flex h-full flex-col p-0">
      <CardContent className="flex flex-1 flex-col p-4">
        <Tabs
          className="mb-4"
          items={[
            { id: 'rules', label: 'Logic Rules' },
            { id: 'fields', label: 'Field Logic' },
          ]}
          onValueChange={setActiveTab}
          value={activeTab}
        />
        <TabsContent activeValue={activeTab} value="rules">
          {}
          <div className="mb-4 flex flex-col gap-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="font-semibold text-base">Logic Items</h3>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowJson(true)}
                  size="sm"
                  variant="outline"
                >
                  Show Logic JSON
                </Button>
                <Button onClick={handleAddItem} size="sm" variant="outline">
                  Add Logic
                </Button>
              </div>
            </div>
            {logic.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-sm">
                No logic items yet.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {logic.map((item) => {
                  if (!(item && item.action && item.action.type)) {
                    return (
                      <Alert
                        className="text-xs"
                        key={item?.id || Math.random()}
                        variant="destructive"
                      >
                        Malformed logic item (missing action or type)
                      </Alert>
                    );
                  }

                  const actionColor =
                    item.action.type === 'show'
                      ? 'secondary'
                      : item.action.type === 'hide'
                        ? 'destructive'
                        : item.action.type === 'enable'
                          ? 'secondary'
                          : item.action.type === 'disable'
                            ? 'outline'
                            : 'default';
                  return (
                    <Card
                      className="flex items-center justify-between border bg-muted/10 p-3"
                      key={item.id}
                    >
                      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                        <span className="font-medium">If </span>
                        <span className="truncate text-muted-foreground text-xs">
                          {summarizeConditionGroup(item.condition, fields)}
                        </span>
                        <span className="ml-1 font-medium">then</span>
                        <Badge className="ml-2" size="sm" variant={actionColor}>
                          {item.action.type}
                        </Badge>
                        <span className="ml-1 truncate text-muted-foreground text-xs">
                          {fields.find((f) => f.id === item.action.target)
                            ?.label || item.action.target}
                        </span>
                      </div>
                      <div className="ml-2 flex gap-2">
                        <Button
                          aria-label="Edit logic"
                          onClick={() => handleEditItem(item.id)}
                          size="icon"
                          variant="ghost"
                        >
                          <span className="sr-only">Edit</span>
                          <Pencil />
                        </Button>
                        <Button
                          aria-label="Delete logic"
                          onClick={() => handleDeleteItem(item.id)}
                          size="icon"
                          variant="ghost"
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
        <TabsContent activeValue={activeTab} value="fields">
          <div className="flex flex-col gap-6">
            {fields.map((field) => {
              const rules = fieldLogicMap[field.id];
              return (
                <Card className="p-4" key={field.id}>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-semibold text-sm">{field.label}</span>
                    <Badge size="sm" variant="outline">
                      {rules.length} rule{rules.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  {rules.length === 0 ? (
                    <div className="text-muted-foreground text-xs">
                      No logic rules affect this field.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {rules.map(({ rule, actionType }) => {
                        const actionColor =
                          actionType === 'show'
                            ? 'secondary'
                            : actionType === 'hide'
                              ? 'destructive'
                              : actionType === 'enable'
                                ? 'secondary'
                                : actionType === 'disable'
                                  ? 'outline'
                                  : 'default';
                        return (
                          <div
                            className="flex items-center gap-2 text-xs"
                            key={rule.id}
                          >
                            <Badge size="sm" variant={actionColor}>
                              {actionType}
                            </Badge>
                            <span className="truncate">
                              If{' '}
                              {summarizeConditionGroup(rule.condition, fields)}
                            </span>
                            <Button
                              className="ml-auto"
                              onClick={() => handleEditItem(rule.id)}
                              size="sm"
                              variant="ghost"
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
          fields={fields}
          item={editingItem}
          onClose={() => setEditorOpen(false)}
          onSave={handleSaveItem}
          open={editorOpen}
        />
        <Modal onOpenChange={(v) => !v && setShowJson(false)} open={showJson}>
          <ModalContent className="max-w-2xl">
            <ModalHeader>
              <ModalTitle>Logic JSON</ModalTitle>
            </ModalHeader>
            <div className="relative">
              <Button
                className="absolute top-3 right-3 z-10 ml-auto"
                disabled={loadingHighlight}
                onClick={handleCopy}
                size="icon"
                variant="ghost"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <ScrollArea className="mt-2 mb-2 h-[60vh] rounded-ele border bg-muted/30 text-foreground">
                {loadingHighlight ? (
                  <div className="flex h-[60vh] items-center justify-center p-4">
                    <Loader />
                  </div>
                ) : (
                  <div
                    className="[&_pre]:!bg-transparent [&_pre]:!p-0 shiki-html h-full p-4 font-mono text-xs"
                    dangerouslySetInnerHTML={{ __html: highlightedJson }}
                  />
                )}
              </ScrollArea>
            </div>
            <ModalFooter>
              <Button onClick={() => setShowJson(false)} variant="outline">
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
      <ScrollArea className="h-full min-h-0 flex-1">
        <LogicBuilderPanelContent {...props} />
      </ScrollArea>
    </CollapsibleBottomPanel>
  );
}

export { LogicBuilderPanel };
