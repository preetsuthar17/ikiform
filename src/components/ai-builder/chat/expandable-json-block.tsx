import { useState, useEffect, useMemo, memo } from "react";
import { motion } from "motion/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createHighlighter } from "shiki";
import { useTheme } from "next-themes";

interface ExpandableJsonBlockProps {
  schema: any;
}

// Global highlighter instance to avoid recreating it
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
  const { theme } = useTheme();
  const targetHeight = expanded ? 300 : 100;

  // Memoize the JSON string to avoid recreating it on every render
  const jsonString = useMemo(() => JSON.stringify(schema, null, 2), [schema]);

  useEffect(() => {
    let isMounted = true;

    const highlightCode = async () => {
      try {
        const highlighter = await getHighlighter();
        if (!isMounted) return;

        const selectedTheme = theme === "dark" ? "github-dark" : "github-light";
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
          // Fallback to plain text
          setHighlightedCode(
            `<pre class="whitespace-pre-wrap break-words">${jsonString}</pre>`,
          );
        }
      }
    };

    // Debounce the highlighting to avoid excessive calls
    const timeoutId = setTimeout(highlightCode, 100);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [jsonString, theme]);

  return (
    <div className="my-2 p-3 rounded-card bg-muted/50 border border-border text-xs font-mono">
      <motion.div
        animate={{ height: targetHeight }}
        initial={{ height: 100 }}
        style={{ overflow: "hidden" }}
      >
        <ScrollArea className="w-full h-full">
          <div
            className="shiki-container text-xs [&_pre]:m-0 [&_pre]:p-0 [&_pre]:bg-transparent [&_pre]:whitespace-pre-wrap [&_pre]:break-words"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </ScrollArea>
      </motion.div>
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-1"
        >
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
          {expanded ? "Collapse" : "Expand"}
        </Button>
      </div>
    </div>
  );
});
