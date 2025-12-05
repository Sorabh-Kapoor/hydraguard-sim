import { useEffect, useRef } from 'react';
import { Terminal, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useHydraX } from '@/contexts/HydraXContext';
import { cn } from '@/lib/utils';

export const SimulationConsole = () => {
  const { simulationLogs, clearLogs, isSimulating } = useHydraX();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [simulationLogs]);

  const getLogColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-accent';
      case 'failure': return 'text-destructive';
      case 'warning': return 'text-warning';
      case 'attempt': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getLogPrefix = (type: string) => {
    switch (type) {
      case 'success': return '[SUCCESS]';
      case 'failure': return '[FAILED]';
      case 'warning': return '[WARNING]';
      case 'attempt': return '[ATTEMPT]';
      default: return '[INFO]';
    }
  };

  return (
    <Card variant="terminal" className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between py-3 border-b border-primary/30">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Live Console</CardTitle>
          {isSimulating && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-destructive/20 border border-destructive/30">
              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <span className="text-xs text-destructive">RUNNING</span>
            </div>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={clearLogs}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <div
          ref={scrollRef}
          className="h-80 overflow-y-auto p-4 font-mono text-sm space-y-1"
        >
          {simulationLogs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <span className="animate-typing">Waiting for simulation...</span>
              <span className="animate-typing">_</span>
            </div>
          ) : (
            simulationLogs.map((log) => (
              <div key={log.id} className="flex gap-2">
                <span className="text-muted-foreground shrink-0">
                  [{log.timestamp.toLocaleTimeString()}]
                </span>
                <span className={cn('shrink-0 font-semibold', getLogColor(log.type))}>
                  {getLogPrefix(log.type)}
                </span>
                <span className={getLogColor(log.type)}>{log.message}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
