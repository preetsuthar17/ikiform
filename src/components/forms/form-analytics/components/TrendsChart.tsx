import type React from "react";
import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrendsChartProps {
	trends: Record<string, number>;
}

const safeParseTime = (value: string) => {
	const t = Date.parse(value);
	return Number.isNaN(t) ? null : t;
};

const formatDate = (value: string) => {
	const ts = safeParseTime(value);
	if (ts === null) {
		return value;
	}
	const date = new Date(ts);
	return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getAllTrends = (trends: Record<string, number>) => {
	const keys = Object.keys(trends);
	const dates = keys.sort((a, b) => {
		const ta = safeParseTime(a);
		const tb = safeParseTime(b);
		if (ta !== null && tb !== null) return ta - tb;
		if (ta === null && tb === null) return a.localeCompare(b);
		return ta !== null ? -1 : 1;
	});
	return dates.map((date) => ({ date, value: trends[date] }));
};

const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className="rounded-xl border border-border bg-card px-3 py-2">
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
	const data = useMemo(() => getAllTrends(trends), [trends]);

	return (
		<Card className="p-4 shadow-none md:p-6">
			<CardHeader className="flex items-center justify-between p-0">
				<CardTitle className="font-semibold text-foreground text-lg">
					Submission Trends
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<div className="h-72 w-full">
					{data.length === 0 ? (
						<div className="flex h-full items-center justify-center text-muted-foreground">
							No data available
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
											stopColor="var(--primary)"
											stopOpacity={0.5}
										/>
										<stop
											offset="95%"
											stopColor="var(--primary)"
											stopOpacity={0}
										/>
									</linearGradient>
								</defs>
								<XAxis
									axisLine={false}
									dataKey="date"
									tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
									tickFormatter={formatDate}
									tickLine={false}
								/>
								<Tooltip content={<CustomTooltip />} />
								<Area
									dataKey="value"
									fill="url(#colorValue)"
									stroke="var(--primary)"
									strokeWidth={2}
									type="monotone"
								/>
							</AreaChart>
						</ResponsiveContainer>
					)}
				</div>
			</CardContent>
		</Card>
	);
};
