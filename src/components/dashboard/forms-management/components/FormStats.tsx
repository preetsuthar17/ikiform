import { Edit, Eye, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { FormStatsProps } from "../types";

export function FormStats({ forms, loading }: FormStatsProps) {
  if (loading) {
    return (
      <div
        aria-label="Loading form statistics"
        className="grid grid-cols-1 gap-4"
        role="region"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            className="rounded-xl p-6 py-7 shadow-none"
            key={i}
            role="article"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-md" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-7 w-8" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </Skeleton>
        ))}
      </div>
    );
  }

  if (forms.length === 0) return null;

  const totalForms = forms.length;
  const publishedForms = forms.filter((f) => f.is_published).length;
  const draftForms = forms.filter((f) => !f.is_published).length;

  const stats = [
    {
      label: "Total Forms",
      value: totalForms,
      icon: Plus,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Published",
      value: publishedForms,
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-600/10",
    },
    {
      label: "Drafts",
      value: draftForms,
      icon: Edit,
      color: "text-yellow-600",
      bgColor: "bg-yellow-600/10",
    },
  ];

  return (
    <div
      aria-label="Form statistics"
      className="grid grid-cols-1 gap-4"
      role="region"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            aria-label={`${stat.label}: ${stat.value}`}
            className="p-6 shadow-none"
            key={stat.label}
            role="article"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-md ${stat.bgColor}`}
              >
                <Icon aria-hidden="true" className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-2xl text-foreground tabular-nums">
                  {stat.value}
                </p>
                <p className="font-medium text-muted-foreground text-sm">
                  {stat.label}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
