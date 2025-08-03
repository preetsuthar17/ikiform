'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface GradientAreaChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  height?: number;
  color?: string;
  gradientId?: string;
  title?: string;
  className?: string;
}

interface MultiAreaChartProps {
  data: any[];
  areas: Array<{
    dataKey: string;
    color: string;
    name: string;
  }>;
  xAxisKey: string;
  height?: number;
  title?: string;
}

interface BarChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  height?: number;
  color?: string;
  title?: string;
}

interface PieChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  height?: number;
  colors?: string[];
  title?: string;
}

export function GradientAreaChart({
  data,
  dataKey,
  xAxisKey,
  height = 300,
  color = '#8b5cf6',
  gradientId = 'colorGradient',
  title,
  className = '',
}: GradientAreaChartProps) {
  return (
    <div className={`w-full ${className}`}>
      {title && <h3 className="mb-4 font-semibold text-lg">{title}</h3>}
      <ResponsiveContainer height={height} width="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 60, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis
            axisLine={false}
            className="text-muted-foreground text-xs"
            dataKey={xAxisKey}
            tickLine={false}
          />
          <YAxis hide={true} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--hu-card))',
              border: '1px solid hsl(var(--hu-border))',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          <Area
            dataKey={dataKey}
            fill={`url(#${gradientId})`}
            fillOpacity={1}
            stroke={color}
            strokeWidth={2}
            type="monotone"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MultiAreaChart({
  data,
  areas,
  xAxisKey,
  height = 300,
  title,
}: MultiAreaChartProps) {
  return (
    <div className="w-full">
      {title && <h3 className="mb-4 font-semibold text-lg">{title}</h3>}
      <ResponsiveContainer height={height} width="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 60, left: 0, bottom: 0 }}
        >
          <defs>
            {areas.map((area, index) => (
              <linearGradient
                id={`gradient-${area.dataKey}`}
                key={area.dataKey}
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop offset="5%" stopColor={area.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={area.color} stopOpacity={0.05} />
              </linearGradient>
            ))}
          </defs>
          <XAxis
            axisLine={false}
            className="text-muted-foreground text-xs"
            dataKey={xAxisKey}
            tickLine={false}
          />
          <YAxis hide={true} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--hu-card))',
              border: '1px solid hsl(var(--hu-border))',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          {areas.map((area) => (
            <Area
              dataKey={area.dataKey}
              fill={`url(#gradient-${area.dataKey})`}
              fillOpacity={1}
              key={area.dataKey}
              stackId="1"
              stroke={area.color}
              strokeWidth={2}
              type="monotone"
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GradientBarChart({
  data,
  dataKey,
  xAxisKey,
  height = 300,
  color = '#10b981',
  title,
}: BarChartProps) {
  return (
    <div className="w-full">
      {title && <h3 className="mb-4 font-semibold text-lg">{title}</h3>}
      <ResponsiveContainer height={height} width="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 60, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.9} />
              <stop offset="95%" stopColor={color} stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <XAxis
            axisLine={false}
            className="text-muted-foreground text-xs"
            dataKey={xAxisKey}
            tickLine={false}
          />
          <YAxis hide={true} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--hu-card))',
              border: '1px solid hsl(var(--hu-border))',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          <Bar
            dataKey={dataKey}
            fill="url(#barGradient)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GradientPieChart({
  data,
  dataKey,
  nameKey,
  height = 300,
  colors = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'],
  title,
}: PieChartProps) {
  return (
    <div className="w-full">
      {title && <h3 className="mb-4 font-semibold text-lg">{title}</h3>}
      <ResponsiveContainer height={height} width="100%">
        <PieChart>
          <Pie
            cx="50%"
            cy="50%"
            data={data}
            dataKey={dataKey}
            innerRadius={60}
            outerRadius={120}
            paddingAngle={5}
          >
            {data.map((entry, index) => (
              <Cell
                fill={colors[index % colors.length]}
                key={`cell-${index}`}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--hu-card))',
              border: '1px solid hsl(var(--hu-border))',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GradientLineChart({
  data,
  dataKey,
  xAxisKey,
  height = 300,
  color = '#3b82f6',
  title,
}: GradientAreaChartProps) {
  return (
    <div className="w-full">
      {title && <h3 className="mb-4 font-semibold text-lg">{title}</h3>}
      <ResponsiveContainer height={height} width="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 60, left: 0, bottom: 0 }}
        >
          <XAxis
            axisLine={false}
            className="text-muted-foreground text-xs"
            dataKey={xAxisKey}
            tickLine={false}
          />
          <YAxis hide={true} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--hu-card))',
              border: '1px solid hsl(var(--hu-border))',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          <Line
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
            dataKey={dataKey}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            stroke={color}
            strokeWidth={3}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
