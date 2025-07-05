import React from "react";

// UI Components
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Icons
import { Calendar, BarChart3, TrendingUp } from "lucide-react";

// Types
import type { InfoCardsProps } from "../types";

export const InfoCards: React.FC<InfoCardsProps> = ({
  form,
  data,
  formatDate,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="flex flex-col gap-4 p-6 bg-card border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-card">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Last Submission
          </h3>
        </div>
        {data.lastSubmission ? (
          <div className="flex flex-col gap-2">
            <p className="text-foreground font-medium">
              {formatDate(data.lastSubmission.submitted_at)}
            </p>
            <p className="text-sm text-muted-foreground">
              {data.lastSubmission.ip_address &&
                `From ${data.lastSubmission.ip_address}`}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground">No submissions yet</p>
        )}
      </Card>

      <Card className="flex flex-col gap-4 p-6 bg-card border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent rounded-card">
            <BarChart3 className="w-5 h-5 text-accent-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Form Status</h3>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Published</span>
            <Badge variant={form.is_published ? "default" : "secondary"}>
              {form.is_published ? "Yes" : "No"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Created</span>
            <span className="text-sm text-foreground">
              {formatDate(form.created_at)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Updated</span>
            <span className="text-sm text-foreground">
              {formatDate(form.updated_at)}
            </span>
          </div>
        </div>
      </Card>

      <Card className="flex flex-col gap-4 p-6 bg-card border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary rounded-card">
            <TrendingUp className="w-5 h-5 text-secondary-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Quick Stats</h3>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Avg. Fields Completed
            </span>
            <span className="text-sm font-medium text-foreground">
              {data.completionRate}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Most Active Day
            </span>
            {data.mostActiveDay ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {data.mostActiveDay[0]}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {data.mostActiveDay[1]} submissions
                </Badge>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">N/A</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Form Type</span>
            <Badge variant="outline">
              {form.schema.settings?.multiStep ? "Multi-Step" : "Single Page"}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};
