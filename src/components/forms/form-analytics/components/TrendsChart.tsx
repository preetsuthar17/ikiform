import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

interface TrendsChartProps {
  trends: Record<string, number>;
}

const getFilteredTrends = (
  trends: Record<string, number>,
  range: "7" | "30" | "all",
) => {
  const dates = Object.keys(trends).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );
  let filteredDates = dates;
  if (range === "7") filteredDates = dates.slice(-7);
  if (range === "30") filteredDates = dates.slice(-30);
  return filteredDates.map((date) => ({ date, value: trends[date] }));
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-ele px-3 py-2 shadow-lg">
        <p className="text-foreground font-semibold mb-1">{label}</p>
        <p className="text-muted-foreground m-0">
          Submissions:{" "}
          <span className="text-foreground font-medium">
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

  return (
    <Card className="p-6 bg-card border-border flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-foreground">
          Submission Trends
        </h3>
        <div className="flex gap-2">
          <Button
            variant={range === "7" ? "default" : "outline"}
            size="sm"
            onClick={() => setRange("7")}
          >
            7d
          </Button>
          <Button
            variant={range === "30" ? "default" : "outline"}
            size="sm"
            onClick={() => setRange("30")}
          >
            30d
          </Button>
          <Button
            variant={range === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setRange("all")}
          >
            All
          </Button>
        </div>
      </div>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
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
              dataKey="date"
              tick={{ fontSize: 12, fill: "hsl(var(--hu-muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--hu-primary))"
              fill="url(#colorValue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
