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
      <Card className="p-4 shadow-none md:p-6">
        <CardHeader className="flex items-center gap-4 space-y-0 p-0">
          <div aria-hidden="true" className="rounded-md bg-orange-500/10 p-3">
            <AlertTriangle className="size-6 text-orange-600" />
          </div>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-semibold text-foreground text-lg">
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
    <Card className="p-4 shadow-none md:p-6">
      <CardHeader className="flex items-center gap-4 space-y-0 p-0">
        <div aria-hidden="true" className="rounded-md bg-orange-500/10 p-3">
          <AlertTriangle className="size-6 text-orange-600" />
        </div>
        <div className="flex flex-col gap-1">
          <CardTitle className="font-semibold text-foreground text-lg">
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
              const dropoff =
                total > 0 ? 100 - Math.round((reached / total) * 100) : 0;
              const completionRate =
                total > 0 ? Math.round((reached / total) * 100) : 0;

              return (
                <TableRow key={block.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
                        {idx + 1}
                      </div>
                      {block.label ? block.label : `Step ${idx + 1}`}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold tabular-nums">
                        {reached}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        of {total}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold tabular-nums">
                        {dropoff}%
                      </span>
                      <div className="max-w-20 flex-1">
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          {/* Prevents visual issue if dropoff is 0 or very small */}
                          <div
                            aria-label={`Drop-off bar for step ${idx + 1}`}
                            className="h-full bg-destructive transition-all duration-300"
                            style={{
                              width: dropoff > 0 ? `${dropoff}%` : "2px",
                              minWidth: dropoff === 0 ? "2px" : undefined,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold tabular-nums">
                        {completionRate}%
                      </span>
                      <div className="max-w-20 flex-1">
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          {/* Prevents visual issue if completionRate is 0 or very small */}
                          <div
                            aria-label={`Completion bar for step ${idx + 1}`}
                            className="h-full bg-primary transition-all duration-300"
                            style={{
                              width:
                                completionRate > 0
                                  ? `${completionRate}%`
                                  : "2px",
                              minWidth:
                                completionRate === 0 ? "2px" : undefined,
                            }}
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
