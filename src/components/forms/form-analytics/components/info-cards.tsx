// Icons
import { BarChart3, Calendar, TrendingUp } from 'lucide-react';
import type React from 'react';
import { Badge } from '@/components/ui/badge';
// UI Components
import { Card } from '@/components/ui/card';

// Types
import type { InfoCardsProps } from '../types';

export const InfoCards: React.FC<InfoCardsProps> = ({
  form,
  data,
  formatDate,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="flex flex-col gap-4 border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-card bg-primary/10 p-2">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground text-lg">
            Last Submission
          </h3>
        </div>
        {data.lastSubmission ? (
          <div className="flex flex-col gap-2">
            <p className="font-medium text-foreground">
              {formatDate(data.lastSubmission.submitted_at)}
            </p>
            <p className="text-muted-foreground text-sm">
              {data.lastSubmission.ip_address &&
                `From ${data.lastSubmission.ip_address}`}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground">No submissions yet</p>
        )}
      </Card>

      <Card className="flex flex-col gap-4 border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-card bg-primary/10 p-2">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground text-lg">Form Status</h3>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Published</span>
            <Badge variant={form.is_published ? 'default' : 'secondary'}>
              {form.is_published ? 'Yes' : 'No'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Created</span>
            <span className="text-foreground text-sm">
              {formatDate(form.created_at)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Updated</span>
            <span className="text-foreground text-sm">
              {formatDate(form.updated_at)}
            </span>
          </div>
        </div>
      </Card>

      <Card className="flex flex-col gap-4 border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-card bg-primary/10 p-2">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground text-lg">Quick Stats</h3>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">
              Avg. Fields Completed
            </span>
            <span className="font-medium text-foreground text-sm">
              {data.completionRate}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">
              Most Active Day
            </span>
            {data.mostActiveDay ? (
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground text-sm">
                  {data.mostActiveDay[0]}
                </span>
                <Badge className="text-xs" variant="secondary">
                  {data.mostActiveDay[1]} submissions
                </Badge>
              </div>
            ) : (
              <span className="text-muted-foreground text-sm">N/A</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Form Type</span>
            <Badge variant="outline">
              {form.schema.settings?.multiStep ? 'Multi-Step' : 'Single Page'}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};
