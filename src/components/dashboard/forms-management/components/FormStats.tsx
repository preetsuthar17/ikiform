// Stats component for forms management
import React from "react";

// UI Components
import { Card } from "@/components/ui/card";

// Icons
import { Plus, Eye, Edit } from "lucide-react";

// Types
import type { FormStatsProps } from "../types";

export function FormStats({ forms }: FormStatsProps) {
  if (forms.length === 0) return null;

  const totalForms = forms.length;
  const publishedForms = forms.filter((f) => f.is_published).length;
  const draftForms = forms.filter((f) => !f.is_published).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="p-4 bg-card border-border rounded-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalForms}</p>
            <p className="text-sm text-muted-foreground">Total Forms</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card border-border rounded-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <Eye className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {publishedForms}
            </p>
            <p className="text-sm text-muted-foreground">Published</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card border-border rounded-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
            <Edit className="w-5 h-5 text-secondary-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{draftForms}</p>
            <p className="text-sm text-muted-foreground">Drafts</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
