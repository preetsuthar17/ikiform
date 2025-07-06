// Icon imports
import { ArrowLeft } from "lucide-react";

// UI components imports
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Local imports
import { FormSchema } from "@/lib/ai-builder/types";

interface PreviewPanelHeaderProps {
  forms: FormSchema[];
  activeFormId: string | null;
  setActiveFormId: (id: string) => void;
  activeForm: FormSchema | undefined;
  setShowJsonModal: (show: boolean) => void;
  onUseForm: () => void;
  isMobile?: boolean;
}

export function PreviewPanelHeader({
  forms,
  activeFormId,
  setActiveFormId,
  activeForm,
  setShowJsonModal,
  onUseForm,
  isMobile = false,
}: PreviewPanelHeaderProps) {
  if (isMobile) {
    return (
      <>
        <div className="md:hidden flex items-center gap-3 border-b bg-card/50 backdrop-blur p-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/form-builder">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 bg-muted-foreground rounded-full"></span>
            <span className="text-lg font-semibold">Kiko AI</span>
          </div>
        </div>
        <div className="max-sm:flex hidden gap-2 overflow-x-auto p-3">
          {forms.map((form, idx) => (
            <Button
              key={form.id}
              size="sm"
              variant={form.id === activeFormId ? "secondary" : "outline"}
              onClick={() => setActiveFormId(form.id)}
            >
              {form.prompt
                ? `${form.prompt.slice(0, 12)}...`
                : `Form ${idx + 1}`}
            </Button>
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="hidden md:flex items-center justify-between border-b bg-card/50 p-4 gap-4">
      <div className="flex gap-2">
        {forms.map((form, idx) => (
          <Button
            key={form.id}
            variant={form.id === activeFormId ? "secondary" : "outline"}
            onClick={() => setActiveFormId(form.id)}
          >
            {form.prompt ? `${form.prompt.slice(0, 20)}...` : `Form ${idx + 1}`}
          </Button>
        ))}
      </div>
      {activeForm?.schema && (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowJsonModal(true)}
          >
            View JSON
          </Button>
          <Button size="sm" onClick={onUseForm}>
            Use this form
          </Button>
        </div>
      )}
    </div>
  );
}
