import { FORM_SETTINGS_SECTIONS } from "../index";
import type { FormSettingsSection } from "../types";
import { FormSettingsContent } from "./FormSettingsContent";
import { SettingsSearch } from "./SettingsSearch";

interface FormSettingsDesktopLayoutProps {
  activeSection: FormSettingsSection;
  onSectionChange: (section: FormSettingsSection) => void;
  sectionProps: any;
  onClose: () => void;
}

export function FormSettingsDesktopLayout({
  activeSection,
  onSectionChange,
  sectionProps,
  onClose,
}: FormSettingsDesktopLayoutProps) {
  return (
    <div
      className="hidden h-full gap-4 md:flex"
      style={{
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        overscrollBehavior: "contain",
      }}
    >
      <div className="flex w-64 flex-col gap-3 border-border border-r pr-4">
        <SettingsSearch
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
        <nav
          aria-label="Settings sections"
          className="flex flex-col gap-1"
          role="navigation"
        >
          {FORM_SETTINGS_SECTIONS.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                aria-current={isActive ? "page" : undefined}
                aria-label={`Go to ${section.label} settings`}
                className={`w-full rounded-md px-3 py-3 text-left text-sm opacity-60 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 ${
                  isActive
                    ? "font-medium opacity-100"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
                key={section.id}
                onClick={() => {
                  if (section.id === "design" && sectionProps?.formId) {
                    const url = `/form-builder/${sectionProps.formId}/customize`;
                    window.open(url, "_blank", "noopener,noreferrer");
                    return;
                  }
                  onSectionChange(section.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (section.id === "design" && sectionProps?.formId) {
                      const url = `/form-builder/${sectionProps.formId}/customize`;
                      window.open(url, "_blank", "noopener,noreferrer");
                      return;
                    }
                    onSectionChange(section.id);
                  }
                }}
                role="menuitem"
                style={{ minHeight: "44px" }}
                tabIndex={0}
              >
                {section.label}
              </button>
            );
          })}
        </nav>
      </div>
      <div
        className="flex h-full flex-1 flex-col"
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
      </div>
    </div>
  );
}
