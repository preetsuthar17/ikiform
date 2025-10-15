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
    <div className="hidden h-full gap-4 md:flex">
      <div className="flex w-64 flex-col gap-3 border-border border-r pr-4">
        <SettingsSearch
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
        <nav className="flex flex-col">
          {FORM_SETTINGS_SECTIONS.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                className={`w-full rounded-md px-3 py-3 text-left text-sm opacity-60 transition-colors ${
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
              >
                {section.label}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="flex h-full flex-1 flex-col">
        <FormSettingsContent
          section={activeSection}
          {...sectionProps}
          updateNotifications={sectionProps.updateNotifications}
        />
      </div>
    </div>
  );
}
