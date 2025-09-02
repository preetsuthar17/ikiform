import type React from "react";
import { useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TrendsChartProps {
  trends: Record<string, number>;
}

const getFilteredTrends = (
  trends: Record<string, number>,
  range: "7" | "30" | "all"
) => {
  const dates = Object.keys(trends).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  if (range === "all") {
    return dates.map((date) => ({ date, value: trends[date] }));
  }

  // For 7d and 30d, show the last N entries instead of date-based filtering
  const entriesToShow = range === "7" ? 7 : 30;
  const filteredDates = dates.slice(-entriesToShow);

  return filteredDates.map((date) => ({ date, value: trends[date] }));
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-ele border border-border bg-card px-3 py-2">
        <p className="mb-1 font-semibold text-foreground">
          {formatDate(label)}
        </p>
        <p className="m-0 text-muted-foreground">
          Submissions:{" "}
          <span className="font-medium text-foreground">
            {payload[0].value}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export const TrendsChart: React.FC<TrendsChartProps> = ({ trends }) => {
  const [range, setRange] = useState<"7" | "30" | "all">("7");
  const data = useMemo(() => getFilteredTrends(trends, range), [trends, range]);

  // Debug logging
  console.log("TrendsChart - trends:", trends);
  console.log("TrendsChart - range:", range);
  console.log("TrendsChart - filtered data:", data);

  // Additional debugging for date filtering
  const dates = Object.keys(trends).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );
  if (dates.length > 0) {
    const entriesToShow = range === "7" ? 7 : 30;
    console.log("TrendsChart - total dates available:", dates.length);
    console.log("TrendsChart - entries to show:", entriesToShow);
    console.log("TrendsChart - last N dates:", dates.slice(-entriesToShow));
  }

  return (
    <Card className="flex flex-col gap-4 border-border bg-card p-6">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-foreground text-lg">
          Submission Trends
        </h3>
        <div className="flex gap-2">
          <Button
            onClick={() => setRange("7")}
            size="sm"
            variant={range === "7" ? "default" : "outline"}
          >
            7d
          </Button>
          <Button
            onClick={() => setRange("30")}
            size="sm"
            variant={range === "30" ? "default" : "outline"}
          >
            30d
          </Button>
          <Button
            onClick={() => setRange("all")}
            size="sm"
            variant={range === "all" ? "default" : "outline"}
          >
            All
          </Button>
        </div>
      </div>
      <div className="h-72 w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No data available for the selected time range
          </div>
        ) : (
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--hu-primary))"
                    stopOpacity={0.5}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--hu-primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                axisLine={false}
                dataKey="date"
                tick={{ fontSize: 12, fill: "hsl(var(--hu-muted-foreground))" }}
                tickFormatter={formatDate}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                dataKey="value"
                fill="url(#colorValue)"
                stroke="hsl(var(--hu-primary))"
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
