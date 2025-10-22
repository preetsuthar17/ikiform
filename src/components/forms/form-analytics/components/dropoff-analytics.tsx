import { AlertTriangle } from "lucide-react";
import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      <Card className="shadow-none p-4 md:p-6">
        <CardHeader className="flex items-center gap-4 space-y-0 p-0">
          <div className="rounded-2xl bg-orange-500/10 p-3" aria-hidden="true">
            <AlertTriangle className="size-6 text-orange-600" />
          </div>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg font-semibold text-foreground">
              Drop-off analytics
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Drop-off analytics are only available for multi-step forms.
            </p>
          </div>
        </CardHeader>
      </Card>
    );
  }

  const dropoffCounts = getDropoffCounts(form, submissions);
  const total = submissions.length;

  return (
    <Card className="shadow-none p-4 md:p-6">
      <CardHeader className="flex items-center gap-4 space-y-0 p-0">
        <div className="rounded-2xl bg-orange-500/10 p-3" aria-hidden="true">
          <AlertTriangle className="size-6 text-orange-600" />
        </div>
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg font-semibold text-foreground">
            Drop-off analytics
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Understand where users drop off in your forms.
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="gap-4">
              <TableHead>Step</TableHead>
              <TableHead>Reached</TableHead>
              <TableHead>Drop-off %</TableHead>
              <TableHead>Completion %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {form.schema.blocks.map((block: any, idx: number) => {
              const reached = dropoffCounts[block.id] || 0;
              const dropoff = total > 0 ? 100 - Math.round((reached / total) * 100) : 0;
              const completionRate = total > 0 ? Math.round((reached / total) * 100) : 0;

              return (
                <TableRow key={block.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {idx + 1}
                      </div>
                      {block.label ? block.label : `Step ${idx + 1}`}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="tabular-nums font-semibold">{reached}</span>
                      <span className="text-muted-foreground text-sm">
                        of {total}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="tabular-nums font-semibold">{dropoff}%</span>
                      <div className="flex-1 max-w-20">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          {/* Prevents visual issue if dropoff is 0 or very small */}
                          <div 
                            className="h-full bg-destructive transition-all duration-300"
                            style={{
                              width: dropoff > 0 ? `${dropoff}%` : "2px",
                              minWidth: dropoff === 0 ? "2px" : undefined,
                            }}
                            aria-label={`Drop-off bar for step ${idx + 1}`}
                          />
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="tabular-nums font-semibold">{completionRate}%</span>
                      <div className="flex-1 max-w-20">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          {/* Prevents visual issue if completionRate is 0 or very small */}
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{
                              width: completionRate > 0 ? `${completionRate}%` : "2px",
                              minWidth: completionRate === 0 ? "2px" : undefined,
                            }}
                            aria-label={`Completion bar for step ${idx + 1}`}
                          />
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};