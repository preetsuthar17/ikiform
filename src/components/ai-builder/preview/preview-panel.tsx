// Local imports
import { PreviewPanelProps } from "@/lib/ai-builder/types";
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
        JSON.stringify(activeForm.schema)
      );
      router.push("/form-builder");
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full gap-4">
      <PreviewPanelHeader
        forms={forms}
        activeFormId={activeFormId}
        setActiveFormId={setActiveFormId}
        activeForm={activeForm}
        setShowJsonModal={setShowJsonModal}
        onUseForm={handleUseForm}
        isMobile={true}
      />
      <PreviewPanelHeader
        forms={forms}
        activeFormId={activeFormId}
        setActiveFormId={setActiveFormId}
        activeForm={activeForm}
        setShowJsonModal={setShowJsonModal}
        onUseForm={handleUseForm}
        isMobile={false}
      />
      <div className="flex-1 overflow-auto md:p-6 p-3">
        {activeForm?.schema ? (
          <div className="text-muted-foreground flex items-center justify-center text-center">
            Form preview removed. Use the "Use Form" button to import this form
            into the form builder.
          </div>
        ) : (
          <div className="text-muted-foreground flex items-center justify-center text-center">
            No form selected.
          </div>
        )}
      </div>
    </div>
  );
}
