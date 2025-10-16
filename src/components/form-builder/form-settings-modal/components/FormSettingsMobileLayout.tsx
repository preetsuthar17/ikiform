import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FORM_SETTINGS_SECTIONS } from "../index";
import type { FormSettingsSection } from "../types";
import { FormSettingsContent } from "./FormSettingsContent";
import { SettingsSearch } from "./SettingsSearch";

interface FormSettingsMobileLayoutProps {
  activeSection: FormSettingsSection;
  onSectionChange: (section: FormSettingsSection) => void;
  onClose: () => void;
  sectionProps: any;
}

export function FormSettingsMobileLayout({
  activeSection,
  onSectionChange,
  onClose,
  sectionProps,
}: FormSettingsMobileLayoutProps) {
  const [showSectionList, setShowSectionList] = useState(true);
  const sectionListRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);

  const handleSectionClick = (sectionId: FormSettingsSection) => {
    if (sectionId === "design" && sectionProps?.formId) {
      const url = `/form-builder/${sectionProps.formId}/customize`;
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    onSectionChange(sectionId);
    setShowSectionList(false);
  };

  const handleBackClick = () => {
    setShowSectionList(true);
  };

  // Focus management for accessibility
  useEffect(() => {
    if (showSectionList && sectionListRef.current) {
      // Focus first section button when showing list
      const firstButton = sectionListRef.current.querySelector("button");
      firstButton?.focus();
    } else if (!showSectionList && backButtonRef.current) {
      // Focus back button when showing section content
      backButtonRef.current.focus();
    }
  }, [showSectionList]);

  useEffect(() => {
    if (!showSectionList) {
      const sectionName = FORM_SETTINGS_SECTIONS.find(
        (s) => s.id === activeSection
      )?.label;
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", "polite");
      announcement.setAttribute("aria-atomic", "true");
      announcement.className = "sr-only";
      announcement.textContent = `Now viewing ${sectionName} settings`;
      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }, [activeSection, showSectionList]);

  if (showSectionList) {
    return (
      <div
        className="flex h-full flex-col gap-4 md:hidden"
        style={{
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
          overscrollBehavior: "contain",
        }}
      >
        <div className="p-2">
          <SettingsSearch
            activeSection={activeSection}
            onSectionChange={onSectionChange}
          />
        </div>
        <ScrollArea
          className="flex-1"
          style={{
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
            overscrollBehavior: "contain",
          }}
        >
          <nav
            aria-label="Settings sections"
            className="flex flex-col gap-1 overflow-auto p-2"
            ref={sectionListRef}
            role="navigation"
          >
            {FORM_SETTINGS_SECTIONS.map((section, index) => (
              <button
                aria-label={`Go to ${section.label} settings`}
                className="flex w-full items-center justify-between rounded-md px-4 py-4 text-left font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSectionClick(section.id);
                  }
                  if (
                    e.key === "ArrowDown" &&
                    index < FORM_SETTINGS_SECTIONS.length - 1
                  ) {
                    e.preventDefault();
                    const nextButton = e.currentTarget.parentElement?.children[
                      index + 1
                    ] as HTMLElement;
                    nextButton?.focus();
                  }
                  if (e.key === "ArrowUp" && index > 0) {
                    e.preventDefault();
                    const prevButton = e.currentTarget.parentElement?.children[
                      index - 1
                    ] as HTMLElement;
                    prevButton?.focus();
                  }
                }}
                role="menuitem"
                style={{ minHeight: "44px" }}
                tabIndex={0}
              >
                <span>{section.label}</span>
                <ArrowLeft aria-hidden="true" className="h-4 w-4 rotate-180" />
              </button>
            ))}
          </nav>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div
      className="flex h-full flex-col md:hidden"
      style={{
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        overscrollBehavior: "contain",
      }}
    >
      <header className="flex flex-shrink-0 items-center gap-4 border-border border-b p-4">
        <Button
          aria-label="Go back to settings list"
          className="p-2 focus:ring-2 focus:ring-ring focus:ring-offset-1"
          onClick={handleBackClick}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              handleBackClick();
            }
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleBackClick();
            }
          }}
          ref={backButtonRef}
          size="icon"
          style={{ minHeight: "44px", minWidth: "44px" }}
          tabIndex={0}
          variant="ghost"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        </Button>
        <h2 className="font-semibold text-lg">Settings</h2>
      </header>
      <main
        aria-labelledby="settings-section-title"
        className="h-full flex-1"
        role="main"
        style={{
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
          overscrollBehavior: "contain",
        }}
      >
        <FormSettingsContent
          section={activeSection}
          {...sectionProps}
          updateNotifications={sectionProps.updateNotifications}
        />
      </main>
    </div>
  );
}
