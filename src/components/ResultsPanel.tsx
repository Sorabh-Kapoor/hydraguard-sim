import { CheckCircle, XCircle, Clock, Target, Zap, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useHydraX } from '@/contexts/HydraXContext';
import { cn } from '@/lib/utils';

export const ResultsPanel = () => {
  const { simulationResult } = useHydraX();

  if (!simulationResult) {
    return (
      <Card variant="glass" className="h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Simulation Results
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48 text-muted-foreground">
          Run a simulation to see results
        </CardContent>
      </Card>
    );
  }

  const getRiskColor = (score: number) => {
    if (score >= 75) return 'text-destructive';
    if (score >= 50) return 'text-warning';
    if (score >= 25) return 'text-primary';
    return 'text-accent';
  };

  return (
    <Card variant="cyber" className="h-full">
      <CardHeader className="border-b border-primary/30">
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Simulation Results
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
          <div className="flex items-center gap-3">
            {simulationResult.passwordFound ? (
              <div className="p-2 rounded-full bg-destructive/20 danger-glow">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
            ) : (
              <div className="p-2 rounded-full bg-accent/20 success-glow">
                <CheckCircle className="w-6 h-6 text-accent" />
              </div>
            )}
            <div>
              <p className="font-semibold">
                {simulationResult.passwordFound ? 'VULNERABLE' : 'PROTECTED'}
              </p>
              <p className="text-xs text-muted-foreground">
                {simulationResult.passwordFound
                  ? `Password cracked: "${simulationResult.foundPassword}"`
                  : 'Password not found in wordlist'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-secondary/30 border border-border">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Target className="w-3 h-3" />
              Target
            </div>
            <p className="font-mono">{simulationResult.targetUser}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Zap className="w-3 h-3" />
              Attack Type
            </div>
            <p className="font-mono text-sm">{simulationResult.attackType}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Clock className="w-3 h-3" />
              Time Taken
            </div>
            <p className="font-mono">{simulationResult.timeTaken.toFixed(2)}s</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              Attempts
            </div>
            <p className="font-mono">{simulationResult.totalAttempts}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Risk Score</span>
            <span className={cn('font-bold', getRiskColor(simulationResult.riskScore))}>
              {simulationResult.riskScore}/100
            </span>
          </div>
          <Progress
            value={simulationResult.riskScore}
            className="h-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};
