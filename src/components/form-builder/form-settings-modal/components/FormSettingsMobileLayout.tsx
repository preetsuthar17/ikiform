import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FORM_SETTINGS_SECTIONS } from "../index";
import type { FormSettingsSection } from "../types";
import { FormSettingsContent } from "./FormSettingsContent";

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
  return (
    <div className="flex h-full flex-col gap-4 md:hidden">
      <div className="flex flex-shrink-0 items-center gap-4 border-0 border-border p-2 md:border-b md:p-4">
        <ScrollArea className="pb-4" orientation="horizontal">
          <Tabs
            items={FORM_SETTINGS_SECTIONS}
            onValueChange={(value) =>
              onSectionChange(value as FormSettingsSection)
            }
            size="sm"
            value={activeSection}
            variant="underline"
          />
        </ScrollArea>
      </div>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-4 p-0 md:p-4">
            {FORM_SETTINGS_SECTIONS.map((section) => (
              <TabsContent
                activeValue={activeSection}
                key={section.id}
                value={section.id}
              >
                <FormSettingsContent
                  section={section.id}
                  {...sectionProps}
                  updateNotifications={sectionProps.updateNotifications}
                />
              </TabsContent>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
