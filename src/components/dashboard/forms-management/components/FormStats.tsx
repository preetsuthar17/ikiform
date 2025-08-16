import { Edit, Eye, Plus } from 'lucide-react';
import React from 'react';

import { Card } from '@/components/ui/card';

import type { FormStatsProps } from '../types';

export function FormStats({ forms }: FormStatsProps) {
  if (forms.length === 0) return null;

  const totalForms = forms.length;
  const publishedForms = forms.filter((f) => f.is_published).length;
  const draftForms = forms.filter((f) => !f.is_published).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="rounded-4xl border-none shadow-none bg-card p-4 md:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
            <Plus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-bold text-2xl text-foreground">{totalForms}</p>
            <p className="text-muted-foreground text-sm">Total Forms</p>
          </div>
        </div>
      </Card>

      <Card className="rounded-4xl border-none shadow-none bg-card p-4 md:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-600/10">
            <Eye className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="font-bold text-2xl text-foreground">
              {publishedForms}
            </p>
            <p className="text-muted-foreground text-sm">Published</p>
          </div>
        </div>
      </Card>

      <Card className="rounded-4xl border-none shadow-none bg-card p-4 md:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-600/10">
            <Edit className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="font-bold text-2xl text-foreground">{draftForms}</p>
            <p className="text-muted-foreground text-sm">Drafts</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
