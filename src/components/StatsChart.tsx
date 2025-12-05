import { Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useHydraX } from '@/contexts/HydraXContext';

export const StatsChart = () => {
  const { simulationLogs, simulationResult } = useHydraX();

  const logTypeCounts = simulationLogs.reduce((acc, log) => {
    acc[log.type] = (acc[log.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = [
    { name: 'Attempts', value: logTypeCounts.attempt || 0, color: 'hsl(180, 100%, 50%)' },
    { name: 'Success', value: logTypeCounts.success || 0, color: 'hsl(142, 76%, 45%)' },
    { name: 'Failures', value: logTypeCounts.failure || 0, color: 'hsl(0, 84%, 60%)' },
    { name: 'Info', value: logTypeCounts.info || 0, color: 'hsl(215, 20%, 55%)' },
  ].filter(d => d.value > 0);

  const barData = simulationResult ? [
    { name: 'Attempts', value: simulationResult.totalAttempts },
    { name: 'Time (s)', value: Math.round(simulationResult.timeTaken * 10) / 10 },
    { name: 'Risk', value: simulationResult.riskScore },
  ] : [];

  return (
    <Card variant="glass">
      <CardHeader className="py-3 border-b border-border">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Analytics
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        {simulationLogs.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
            No data yet
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2 text-center">Log Distribution</p>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={45}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {barData.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 text-center">Metrics</p>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }} />
                    <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(222, 47%, 8%)',
                        border: '1px solid hsl(180, 100%, 50%)',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(180, 100%, 50%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {pieData.map(item => (
            <div key={item.name} className="flex items-center gap-1.5 text-xs">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-muted-foreground">{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
