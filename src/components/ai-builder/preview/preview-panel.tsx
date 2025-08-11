import { FormPreview } from "@/components/form-builder/form-preview";

import type { PreviewPanelProps } from "@/lib/ai-builder/types";
import { PreviewPanelHeader } from "./preview-panel-header";

export function PreviewPanel({
  forms,
  activeFormId,
  setActiveFormId,
  router,
  setShowJsonModal,
  activeForm,
}: PreviewPanelProps) {
  const handleUseForm = () => {
    if (activeForm?.schema) {
      localStorage.setItem(
        "importedFormSchema",
        JSON.stringify(activeForm.schema),
      );
      router.push("/form-builder");
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col gap-4">
      <PreviewPanelHeader
        activeForm={activeForm}
        activeFormId={activeFormId}
        forms={forms}
        isMobile={true}
        onUseForm={handleUseForm}
        setActiveFormId={setActiveFormId}
        setShowJsonModal={setShowJsonModal}
      />
      <PreviewPanelHeader
        activeForm={activeForm}
        activeFormId={activeFormId}
        forms={forms}
        isMobile={false}
        onUseForm={handleUseForm}
        setActiveFormId={setActiveFormId}
        setShowJsonModal={setShowJsonModal}
      />
      <div className="my-12 flex-1 overflow-auto p-3 md:p-6">
        {activeForm?.schema ? (
          <FormPreview
            onFieldDelete={() => {}}
            onFieldSelect={() => {}}
            onFieldsReorder={() => {}}
            schema={activeForm.schema}
            selectedFieldId={null}
          />
        ) : (
          <div className="flex items-center justify-center text-center text-muted-foreground">
            No form selected.
          </div>
        )}
      </div>
    </div>
  );
}
