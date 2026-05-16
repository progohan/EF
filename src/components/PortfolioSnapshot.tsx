import React, { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BriefcaseBusiness, DollarSign, GitBranch, MapPinned, Route, TrainFront } from 'lucide-react';
import { ResumeData } from '../types';
import { buildPortfolioMetrics, formatYears } from '../lib/portfolioMetrics';

interface PortfolioSnapshotProps {
  data: ResumeData;
}

const chartColors = ['#0057a8', '#168aad', '#6a994e', '#f59e0b', '#7c3aed', '#64748b'];

const formatProjectValue = (valueMillions: number | null | undefined) => {
  if (!valueMillions) return 'N/A';
  if (valueMillions >= 1000) return `$${(valueMillions / 1000).toFixed(1).replace(/\.0$/, '')}B`;
  return `$${Math.round(valueMillions)}M`;
};

const PortfolioSnapshot: React.FC<PortfolioSnapshotProps> = ({ data }) => {
  const metrics = useMemo(() => buildPortfolioMetrics(data), [data]);

  const headlineStats = [
    {
      label: 'Career Experience',
      value: `${formatYears(metrics.careerYears)} yrs`,
      detail: 'Infrastructure leadership',
      icon: BriefcaseBusiness,
    },
    {
      label: 'Key Projects',
      value: metrics.totalProjects.toString(),
      detail: 'Major programs represented',
      icon: Route,
    },
    {
      label: 'Rail Portfolio',
      value: metrics.railProjects.toString(),
      detail: `${metrics.railYears} active project years`,
      icon: TrainFront,
    },
    {
      label: 'Highway & Bridges',
      value: metrics.highwayProjects.toString(),
      detail: `${metrics.highwayYears} active project years`,
      icon: GitBranch,
    },
    {
      label: 'Largest Project',
      value: formatProjectValue(metrics.largestProject?.parsedValueMillions),
      detail: metrics.largestProject?.name ?? 'Project value unavailable',
      icon: DollarSign,
    },
    {
      label: 'Regions',
      value: metrics.regions.length.toString(),
      detail: 'U.S., Canada, Europe, South America',
      icon: MapPinned,
    },
  ];

  return (
    <section id="snapshot" className="py-16 sm:py-20 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Portfolio Snapshot
            </h2>
            <p className="text-muted-foreground mt-6 text-lg max-w-3xl mx-auto">
              A data-driven view of infrastructure delivery scale, sector depth, and contract exposure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {headlineStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-background border border-border rounded-lg p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                    </div>
                    <span className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{stat.detail}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-background border border-border rounded-lg p-5 shadow-sm lg:col-span-1">
              <h3 className="text-lg font-semibold text-foreground mb-4">Projects by Contract</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.contractChart}
                      dataKey="count"
                      nameKey="name"
                      innerRadius={58}
                      outerRadius={92}
                      paddingAngle={3}
                    >
                      {metrics.contractChart.map((entry, index) => (
                        <Cell key={entry.key} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {metrics.contractChart.map((item, index) => (
                  <div key={item.key} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: chartColors[index % chartColors.length] }}
                    />
                    <span>{item.name}: {item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-5 shadow-sm lg:col-span-2">
              <h3 className="text-lg font-semibold text-foreground mb-1">Portfolio Value by Category</h3>
              <p className="text-sm text-muted-foreground mb-4">
                USD-equivalent value across listed key projects, with total portfolio shown for context.
              </p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.sectorChart} margin={{ top: 8, right: 12, left: 0, bottom: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatProjectValue(Number(value))} />
                    <Tooltip formatter={(value) => [formatProjectValue(Number(value)), 'USD-equivalent value']} />
                    <Bar dataKey="valueMillions" radius={[6, 6, 0, 0]}>
                      {metrics.sectorChart.map((entry, index) => (
                        <Cell key={entry.key} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSnapshot;
