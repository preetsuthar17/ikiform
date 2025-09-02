import { AlertTriangle } from "lucide-react";
import type React from "react";
import { Card } from "@/components/ui/card";
import type { Form, FormSubmission } from "@/lib/database";

function getDropoffCounts(form: Form, submissions: FormSubmission[]) {
  const blocks = form.schema.blocks || [];
  const blockIds = blocks.map((block) => block.id);
  const dropoffCounts: Record<string, number> = {};
  blockIds.forEach((id) => (dropoffCounts[id] = 0));

  submissions.forEach((sub) => {
    let reached = false;
    for (const block of blocks) {
      const hasAny = (block.fields || []).some(
        (f) =>
          sub.submission_data[f.id] !== undefined &&
          sub.submission_data[f.id] !== null &&
          sub.submission_data[f.id] !== ""
      );
      if (hasAny) {
        dropoffCounts[block.id]++;
        reached = true;
      } else if (reached) {
        break;
      }
    }
  });
  return dropoffCounts;
}

interface DropoffAnalyticsProps {
  form: Form;
  submissions: FormSubmission[];
}

export const DropoffAnalytics: React.FC<DropoffAnalyticsProps> = ({
  form,
  submissions,
}) => {
  if (!form.schema?.blocks || form.schema.blocks.length === 0) {
    return (
      <Card className="flex items-center gap-4 border-border bg-card p-6">
        <div className="rounded-card bg-orange-500/10 p-3">
          <AlertTriangle className="h-6 w-6 text-orange-600" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-foreground text-lg">
            Drop-off analytics
          </span>
          <span className="text-muted-foreground text-sm">
            Drop-off analytics are only available for multi-step forms.
          </span>
        </div>
      </Card>
    );
  }
  const dropoffCounts = getDropoffCounts(form, submissions);
  const total = submissions.length;
  return (
    <Card className="flex flex-col gap-4 border-border bg-card p-6">
      <div className="mb-2 flex items-center gap-4">
        <div className="rounded-card bg-orange-500/10 p-3">
          <AlertTriangle className="h-6 w-6 text-orange-600" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-foreground text-lg">
            Drop-off analytics
          </span>
          <span className="text-muted-foreground text-sm">
            Understand where users drop off in your forms.
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Step</th>
              <th className="px-3 py-2 text-left font-semibold">Reached</th>
              <th className="px-3 py-2 text-left font-semibold">Drop-off %</th>
            </tr>
          </thead>
          <tbody>
            {form.schema.blocks.map((block: any, idx: number) => {
              const reached = dropoffCounts[block.id] || 0;
              const dropoff =
                total > 0 ? 100 - Math.round((reached / total) * 100) : 0;
              return (
                <tr
                  className="border-border border-b last:border-0"
                  key={block.id}
                >
                  <td className="px-3 py-2 font-medium text-foreground">
                    {block.label ? block.label : `Step ${idx + 1}`}
                  </td>
                  <td className="px-3 py-2">{reached}</td>
                  <td className="px-3 py-2">{dropoff}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="text-muted-foreground text-xs">
        Drop-off % shows the percentage of users who did not reach each step.
      </div>
    </Card>
  );
};
