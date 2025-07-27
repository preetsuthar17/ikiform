// Icon imports
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
// UI components imports
import { Button } from '@/components/ui/button';

// Local imports
import type { FormSchema } from '@/lib/ai-builder/types';

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
        <div className="flex items-center gap-3 border-b bg-card/50 p-4 backdrop-blur md:hidden">
          <Button asChild size="icon" variant="ghost">
            <Link href="/form-builder">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-card bg-muted-foreground" />
            <span className="font-semibold text-lg">Kiko AI</span>
          </div>
        </div>
        <div className="hidden gap-2 overflow-x-auto p-3 max-sm:flex">
          {forms.map((form, idx) => (
            <Button
              key={form.id}
              onClick={() => setActiveFormId(form.id)}
              size="sm"
              variant={form.id === activeFormId ? 'secondary' : 'outline'}
            >
              {form.prompt
                ? `${form.prompt.slice(0, 12)}...`
                : `Form ${idx + 1}`}
            </Button>
          ))}
        </div>
        {activeForm?.schema && (
          <div className="hidden px-3 pb-3 max-sm:flex">
            <Button
              className="w-full rounded-card py-3 font-semibold text-base"
              onClick={onUseForm}
              size="lg"
            >
              Use this form
            </Button>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="hidden items-center justify-between gap-4 border-b bg-card/50 p-4 md:flex">
      <div className="flex gap-2">
        {forms.map((form, idx) => (
          <Button
            key={form.id}
            onClick={() => setActiveFormId(form.id)}
            variant={form.id === activeFormId ? 'secondary' : 'outline'}
          >
            {form.prompt ? `${form.prompt.slice(0, 20)}...` : `Form ${idx + 1}`}
          </Button>
        ))}
      </div>
      {activeForm?.schema && (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowJsonModal(true)}
            size="sm"
            variant="outline"
          >
            View JSON
          </Button>
          <Button onClick={onUseForm} size="sm">
            Use this form
          </Button>
        </div>
      )}
    </div>
  );
}
