import { useState } from 'react';
import { Play, Square, RotateCcw, Target, Crosshair } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHydraX } from '@/contexts/HydraXContext';
import { attackTypes } from '@/data/mockData';
import { cn } from '@/lib/utils';

export const AttackPanel = () => {
  const {
    targetAccounts,
    wordlist,
    isSimulating,
    setIsSimulating,
    addLog,
    clearLogs,
    setSimulationResult,
  } = useHydraX();

  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [selectedAttack, setSelectedAttack] = useState<string>('');

  const runSimulation = async () => {
    if (!selectedTarget || !selectedAttack) return;

    const target = targetAccounts.find(a => a.id === selectedTarget);
    const attack = attackTypes.find(a => a.id === selectedAttack);
    if (!target || !attack) return;

    setIsSimulating(true);
    clearLogs();

    addLog({ type: 'info', message: `Starting ${attack.name} simulation on target: ${target.username}` });
    addLog({ type: 'info', message: `Wordlist loaded: ${wordlist.length} entries` });
    addLog({ type: 'info', message: 'Connecting to local server: 127.0.0.1:5000...' });

    await new Promise(r => setTimeout(r, 800));
    addLog({ type: 'info', message: 'Connection established. Beginning attack simulation...' });

    let attempts = 0;
    let found = false;
    const startTime = Date.now();

    for (const word of wordlist) {
      if (!isSimulating) break;
      
      attempts++;
      await new Promise(r => setTimeout(r, 50 + Math.random() * 100));

      if (word === target.password) {
        found = true;
        addLog({ type: 'success', message: `PASSWORD FOUND: "${word}" for user ${target.username}` });
        break;
      } else {
        if (attempts % 5 === 0) {
          addLog({ type: 'attempt', message: `Trying: "${word}" ... Failed (${attempts}/${wordlist.length})` });
        }
      }
    }

    const timeTaken = (Date.now() - startTime) / 1000;

    if (!found) {
      addLog({ type: 'failure', message: `Attack completed. Password not found in wordlist.` });
    }

    addLog({ type: 'info', message: `Simulation complete. Total attempts: ${attempts}, Time: ${timeTaken.toFixed(2)}s` });

    setSimulationResult({
      attackType: attack.name,
      targetUser: target.username,
      totalAttempts: attempts,
      successfulAttempts: found ? 1 : 0,
      timeTaken,
      passwordFound: found,
      foundPassword: found ? target.password : undefined,
      riskScore: found ? 85 : 25,
    });

    setIsSimulating(false);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    addLog({ type: 'warning', message: 'Simulation stopped by user.' });
  };

  const resetSimulation = () => {
    setSelectedTarget('');
    setSelectedAttack('');
    clearLogs();
    setSimulationResult(null);
  };

  const selectedAttackData = attackTypes.find(a => a.id === selectedAttack);

  return (
    <Card variant="cyber">
      <CardHeader className="border-b border-primary/30">
        <div className="flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Attack Configuration</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="space-y-3">
          <label className="text-sm text-primary flex items-center gap-2">
            <Target className="w-4 h-4" />
            Select Target User
          </label>
          <Select value={selectedTarget} onValueChange={setSelectedTarget} disabled={isSimulating}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Choose target account..." />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {targetAccounts.filter(a => a.isActive).map(account => (
                <SelectItem key={account.id} value={account.id}>
                  {account.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <label className="text-sm text-primary flex items-center gap-2">
            <Crosshair className="w-4 h-4" />
            Select Attack Type
          </label>
          <Select value={selectedAttack} onValueChange={setSelectedAttack} disabled={isSimulating}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Choose attack method..." />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {attackTypes.map(attack => (
                <SelectItem key={attack.id} value={attack.id}>
                  <div className="flex items-center gap-2">
                    <span>{attack.name}</span>
                    <span className={cn(
                      'text-xs px-1.5 py-0.5 rounded',
                      attack.riskLevel === 'critical' && 'bg-destructive/20 text-destructive',
                      attack.riskLevel === 'high' && 'bg-warning/20 text-warning',
                      attack.riskLevel === 'medium' && 'bg-primary/20 text-primary',
                      attack.riskLevel === 'low' && 'bg-accent/20 text-accent',
                    )}>
                      {attack.riskLevel}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedAttackData && (
          <div className="p-3 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground">{selectedAttackData.description}</p>
            <p className="text-xs text-primary mt-1">Est. time: {selectedAttackData.estimatedTime}</p>
          </div>
        )}

        <div className="flex gap-2">
          {!isSimulating ? (
            <Button
              onClick={runSimulation}
              disabled={!selectedTarget || !selectedAttack}
              className="flex-1"
              variant="success"
            >
              <Play className="w-4 h-4" />
              Start Simulation
            </Button>
          ) : (
            <Button onClick={stopSimulation} className="flex-1" variant="destructive">
              <Square className="w-4 h-4" />
              Stop
            </Button>
          )}
          <Button onClick={resetSimulation} variant="outline" disabled={isSimulating}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
