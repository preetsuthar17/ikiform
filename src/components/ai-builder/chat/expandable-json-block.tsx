import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "motion/react";

import { memo, useEffect, useMemo, useState } from "react";
import { createHighlighter } from "shiki";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExpandableJsonBlockProps {
  schema: any;
}

let highlighterInstance: any = null;
let highlighterPromise: Promise<any> | null = null;

const getHighlighter = async () => {
  if (highlighterInstance) return highlighterInstance;
  if (highlighterPromise) return highlighterPromise;

  highlighterPromise = createHighlighter({
    themes: ["github-dark", "github-light"],
    langs: ["json"],
  });

  highlighterInstance = await highlighterPromise;
  return highlighterInstance;
};

export const ExpandableJsonBlock = memo(function ExpandableJsonBlock({
  schema,
}: ExpandableJsonBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>("");

  const targetHeight = expanded ? 300 : 100;

  const jsonString = useMemo(() => JSON.stringify(schema, null, 2), [schema]);

  useEffect(() => {
    let isMounted = true;

    const highlightCode = async () => {
      try {
        const highlighter = await getHighlighter();
        if (!isMounted) return;

        const selectedTheme = "github-light";
        const html = highlighter.codeToHtml(jsonString, {
          lang: "json",
          theme: selectedTheme,
        });

        if (isMounted) {
          setHighlightedCode(html);
        }
      } catch (error) {
        console.error("Error highlighting code:", error);
        if (isMounted) {
          setHighlightedCode(
            `<pre class="whitespace-pre-wrap break-words">${jsonString}</pre>`
          );
        }
      }
    };

    const timeoutId = setTimeout(highlightCode, 100);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [jsonString]);

  return (
    <div className="my-2 rounded-2xl border border-border bg-muted/50 p-3 font-mono text-xs">
      <motion.div
        animate={{ height: targetHeight }}
        initial={{ height: 100 }}
        style={{ overflow: "hidden" }}
      >
        <ScrollArea className="h-full w-full">
          <div
            className="shiki-container text-xs [&_pre]:m-0 [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:bg-transparent [&_pre]:p-0"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </ScrollArea>
      </motion.div>
      <div className="flex justify-end gap-2">
        <Button
          className="flex items-center gap-1"
          onClick={() => setExpanded((e) => !e)}
          size="sm"
          variant="outline"
        >
          {expanded ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
          {expanded ? "Collapse" : "Expand"}
        </Button>
      </div>
    </div>
  );
});
