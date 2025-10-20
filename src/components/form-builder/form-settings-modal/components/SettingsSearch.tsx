"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { FormSettingsSection } from "../types";
import {
  SETTINGS_SEARCH_INDEX,
  type SettingsSearchItem,
} from "./settings-search-index";

export function SettingsSearch({
  activeSection,
  onSectionChange,
}: {
  activeSection: FormSettingsSection;
  onSectionChange: (section: FormSettingsSection) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as SettingsSearchItem[];
    return SETTINGS_SEARCH_INDEX.filter((item) => {
      const hay = [item.label, ...(item.keywords || [])]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    }).slice(0, 20);
  }, [query]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleNavigate = (item: SettingsSearchItem) => {
    onSectionChange(item.section as FormSettingsSection);
    requestAnimationFrame(() => {
      const el = document.getElementById(item.anchorId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    setOpen(false);
    setQuery("");
    setActiveIndex(null);
  };

  // The parent div MUST be relative for absolute dropdown
  return (
    <div
      className="relative flex flex-col gap-2"
      style={{
        overscrollBehavior: "contain",
      }}
    >
      <div className="relative">
        <Input
          aria-controls={open ? "settings-search-results" : undefined}
          aria-expanded={open}
          aria-label="Search settings"
          className="pl-9 text-base md:text-sm"
          name="settings-search"
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            setOpen(val.trim().length > 0);
            setActiveIndex(null);
          }}
          onFocus={() => setOpen(query.trim().length > 0)}
          onKeyDown={(e) => {
            if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
              setOpen(results.length > 0);
              return;
            }
            if (e.key === "Escape") {
              setOpen(false);
              setActiveIndex(null);
              return;
            }
            if (e.key === "Enter") {
              if (results.length === 1) {
                e.preventDefault();
                handleNavigate(results[0]);
                return;
              }
              if (activeIndex != null && results[activeIndex]) {
                e.preventDefault();
                handleNavigate(results[activeIndex]);
                return;
              }
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              if (!results.length) return;
              setOpen(true);
              setActiveIndex((idx) => {
                if (idx == null) return 0;
                return Math.min(idx + 1, results.length - 1);
              });
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              if (!results.length) return;
              setOpen(true);
              setActiveIndex((idx) => {
                if (idx == null) return results.length - 1;
                return Math.max(idx - 1, 0);
              });
            }
          }}
          placeholder="Search settings…"
          ref={inputRef}
          type="search"
          value={query}
        />
        <Search
          aria-hidden="true"
          className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2.5 size-4 text-muted-foreground"
        />
      </div>
      {/* Make the dropdown absolutely positioned over the search bar for no layout shift */}
      {open && results.length > 0 && (
        <div
          aria-label="Search results"
          className="absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-md border bg-background shadow-xs"
          id="settings-search-results"
          role="listbox"
          style={{
            overscrollBehavior: "contain",
          }}
        >
          <ScrollArea
            className="max-h-64"
            style={{
              overscrollBehavior: "contain",
            }}
          >
            <ul className="flex flex-col gap-1 p-1">
              {results.map((r, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <li key={`${r.section}-${r.anchorId}-${idx}`}>
                    <button
                      aria-selected={isActive}
                      className={`flex w-full items-center justify-between rounded-sm px-2 py-2 text-left text-sm ${isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
                      onClick={() => handleNavigate(r)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleNavigate(r);
                        }
                      }}
                      onMouseEnter={() => setActiveIndex(idx)}
                      role="option"
                    >
                      <span className="truncate">
                        <span className="text-muted-foreground">
                          {sectionLabel(r.section)} /{" "}
                        </span>
                        {r.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        </div>
      )}
      {open && results.length === 0 && (
        <div
          aria-live="polite"
          className="absolute top-full left-0 z-50 mt-2 w-full rounded-md border bg-background p-2 text-center text-muted-foreground text-sm"
          role="status"
          style={{
            overscrollBehavior: "contain",
          }}
        >
          No matches
        </div>
      )}
    </div>
  );
}

function sectionLabel(section: string) {
  switch (section) {
    case "basic":
      return "Basic";
    case "limits":
      return "Limits";
    case "security":
      return "Security";
    case "branding":
      return "Branding";
    case "notifications":
      return "Notifications";
    case "quiz":
      return "Quiz";
    case "api":
      return "API";
    case "webhooks":
      return "Webhooks";
    case "design":
      return "Design";
    case "metadata":
      return "Metadata";
    default:
      return section;
  }
}
