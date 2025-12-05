import { useState, useRef, useEffect } from 'react';
import { Play, Square, RotateCcw, Target, Crosshair, Zap, BookOpen, Shuffle, Database, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useHydraX } from '@/contexts/HydraXContext';
import { attackTypes } from '@/data/mockData';
import { cn } from '@/lib/utils';

const attackIcons: Record<string, React.ReactNode> = {
  'brute-force': <Zap className="w-4 h-4" />,
  'dictionary': <BookOpen className="w-4 h-4" />,
  'hybrid': <Shuffle className="w-4 h-4" />,
  'credential-stuffing': <Database className="w-4 h-4" />,
  'timing': <Clock className="w-4 h-4" />,
};

export const AttackPanel = () => {
  const {
    targetAccounts,
    wordlist,
    defenseConfig,
    isSimulating,
    setIsSimulating,
    addLog,
    clearLogs,
    setSimulationResult,
  } = useHydraX();

  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [selectedAttack, setSelectedAttack] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const stopRef = useRef(false);

  useEffect(() => {
    if (!isSimulating) {
      stopRef.current = true;
    }
  }, [isSimulating]);

  const generateMutations = (word: string): string[] => {
    const mutations = [word];
    mutations.push(word + '123', word + '!', word + '1', word.toUpperCase());
    mutations.push(word.charAt(0).toUpperCase() + word.slice(1));
    mutations.push(word.replace(/a/gi, '@').replace(/e/gi, '3').replace(/i/gi, '1').replace(/o/gi, '0'));
    return mutations;
  };

  const runSimulation = async () => {
    if (!selectedTarget || !selectedAttack) return;

    const target = targetAccounts.find(a => a.id === selectedTarget);
    const attack = attackTypes.find(a => a.id === selectedAttack);
    if (!target || !attack) return;

    stopRef.current = false;
    setIsSimulating(true);
    setProgress(0);
    setCurrentAttempt(0);
    clearLogs();

    addLog({ type: 'info', message: `[HYDRAX] Initializing ${attack.name} module...` });
    addLog({ type: 'info', message: `[TARGET] ${target.username}@127.0.0.1:5000` });
    addLog({ type: 'info', message: `[WORDLIST] ${wordlist.length} entries loaded` });

    // Check defense mechanisms
    if (defenseConfig.rateLimiting) {
      addLog({ type: 'warning', message: '[DEFENSE] Rate limiting detected - slowing attack...' });
    }
    if (defenseConfig.captcha) {
      addLog({ type: 'warning', message: '[DEFENSE] CAPTCHA protection active' });
    }
    if (defenseConfig.accountLockout) {
      addLog({ type: 'warning', message: '[DEFENSE] Account lockout policy detected' });
    }

    await new Promise(r => setTimeout(r, 500));
    addLog({ type: 'info', message: '[CONN] Establishing connection to target...' });
    await new Promise(r => setTimeout(r, 300));
    addLog({ type: 'success', message: '[CONN] Connection established!' });

    let attempts = 0;
    let found = false;
    let foundPassword = '';
    const startTime = Date.now();
    let testWords: string[] = [];

    // Build wordlist based on attack type
    switch (selectedAttack) {
      case 'brute-force':
        addLog({ type: 'info', message: '[MODE] Brute Force - Testing all combinations' });
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < Math.min(wordlist.length, 50); i++) {
          let combo = '';
          for (let j = 0; j < 6; j++) {
            combo += chars[Math.floor(Math.random() * chars.length)];
          }
          testWords.push(combo);
        }
        testWords = [...testWords, ...wordlist];
        break;

      case 'dictionary':
        addLog({ type: 'info', message: '[MODE] Dictionary Attack - Using wordlist' });
        testWords = [...wordlist];
        break;

      case 'hybrid':
        addLog({ type: 'info', message: '[MODE] Hybrid Attack - Dictionary + Mutations' });
        wordlist.forEach(word => {
          testWords.push(...generateMutations(word));
        });
        break;

      case 'credential-stuffing':
        addLog({ type: 'info', message: '[MODE] Credential Stuffing - Testing leaked credentials' });
        testWords = wordlist.map(w => w);
        addLog({ type: 'info', message: `[LEAK-DB] Loaded ${testWords.length} credential pairs` });
        break;

      case 'timing':
        addLog({ type: 'info', message: '[MODE] Timing Attack - Analyzing response times' });
        testWords = [...wordlist];
        break;

      default:
        testWords = [...wordlist];
    }

    const totalWords = testWords.length;
    let lockoutCounter = 0;
    let blockedByDefense = false;

    for (let i = 0; i < testWords.length; i++) {
      if (stopRef.current) {
        addLog({ type: 'warning', message: '[ABORT] Simulation stopped by user' });
        break;
      }

      const word = testWords[i];
      attempts++;
      setCurrentAttempt(attempts);
      setProgress(Math.round((i / totalWords) * 100));

      // Simulate defense mechanisms
      if (defenseConfig.rateLimiting && attempts % 10 === 0) {
        addLog({ type: 'warning', message: '[RATE-LIMIT] Request throttled, waiting...' });
        await new Promise(r => setTimeout(r, 500));
      }

      if (defenseConfig.accountLockout && lockoutCounter >= 5) {
        addLog({ type: 'failure', message: '[LOCKOUT] Account temporarily locked after 5 failed attempts!' });
        blockedByDefense = true;
        await new Promise(r => setTimeout(r, 1000));
        lockoutCounter = 0;
      }

      if (defenseConfig.captcha && attempts % 15 === 0) {
        addLog({ type: 'warning', message: '[CAPTCHA] Challenge triggered - simulation bypassing...' });
        await new Promise(r => setTimeout(r, 300));
      }

      // Different delay based on attack type
      const baseDelay = selectedAttack === 'timing' ? 80 : 40;
      const delay = defenseConfig.rateLimiting ? baseDelay * 3 : baseDelay;
      await new Promise(r => setTimeout(r, delay + Math.random() * 30));

      if (selectedAttack === 'timing') {
        // Timing attack shows response time analysis
        const responseTime = Math.random() * 50 + 10;
        if (attempts % 8 === 0) {
          addLog({ type: 'attempt', message: `[TIMING] "${word}" - Response: ${responseTime.toFixed(2)}ms` });
        }
      }

      if (word === target.password) {
        found = true;
        foundPassword = word;
        addLog({ type: 'success', message: `[CRACKED] Password found: "${word}"` });
        addLog({ type: 'success', message: `[TARGET] ${target.username}:${word}@127.0.0.1:5000` });
        break;
      } else {
        lockoutCounter++;
        if (attempts % 8 === 0 || attempts <= 3) {
          addLog({ type: 'attempt', message: `[ATTEMPT ${attempts}/${totalWords}] Trying: "${word}" ... Failed` });
        }
      }
    }

    const timeTaken = (Date.now() - startTime) / 1000;
    setProgress(100);

    addLog({ type: 'info', message: '─'.repeat(50) });
    addLog({ type: 'info', message: `[COMPLETE] ${attack.name} finished` });
    addLog({ type: 'info', message: `[STATS] Attempts: ${attempts} | Time: ${timeTaken.toFixed(2)}s` });

    if (!found) {
      if (blockedByDefense) {
        addLog({ type: 'failure', message: '[RESULT] Attack blocked by defense mechanisms!' });
      } else {
        addLog({ type: 'failure', message: '[RESULT] Password not found in wordlist' });
      }
    }

    // Calculate risk score
    let riskScore = 0;
    if (found) {
      riskScore = 90;
      if (timeTaken < 5) riskScore = 100;
      else if (timeTaken < 30) riskScore = 85;
    } else {
      riskScore = 20;
      if (defenseConfig.rateLimiting) riskScore -= 5;
      if (defenseConfig.captcha) riskScore -= 5;
      if (defenseConfig.accountLockout) riskScore -= 5;
      if (defenseConfig.twoFactorAuth) riskScore -= 10;
    }

    setSimulationResult({
      attackType: attack.name,
      targetUser: target.username,
      totalAttempts: attempts,
      successfulAttempts: found ? 1 : 0,
      timeTaken,
      passwordFound: found,
      foundPassword: found ? foundPassword : undefined,
      riskScore: Math.max(0, riskScore),
    });

    setIsSimulating(false);
  };

  const stopSimulation = () => {
    stopRef.current = true;
    setIsSimulating(false);
  };

  const resetSimulation = () => {
    stopRef.current = true;
    setSelectedTarget('');
    setSelectedAttack('');
    setProgress(0);
    setCurrentAttempt(0);
    clearLogs();
    setSimulationResult(null);
  };

  const selectedAttackData = attackTypes.find(a => a.id === selectedAttack);

  return (
    <Card variant="cyber">
      <CardHeader className="border-b border-primary/30">
        <div className="flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-primary animate-pulse" />
          <CardTitle className="text-lg">Attack Configuration</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-5">
        <div className="space-y-2">
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
                  <span className="font-mono">{account.username}@127.0.0.1</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-primary flex items-center gap-2">
            <Crosshair className="w-4 h-4" />
            Select Attack Type (Hydra Mode)
          </label>
          <Select value={selectedAttack} onValueChange={setSelectedAttack} disabled={isSimulating}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Choose attack method..." />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {attackTypes.map(attack => (
                <SelectItem key={attack.id} value={attack.id}>
                  <div className="flex items-center gap-3">
                    {attackIcons[attack.id]}
                    <span className="font-medium">{attack.name}</span>
                    <span className={cn(
                      'text-xs px-1.5 py-0.5 rounded font-mono',
                      attack.riskLevel === 'critical' && 'bg-destructive/20 text-destructive',
                      attack.riskLevel === 'high' && 'bg-warning/20 text-warning',
                      attack.riskLevel === 'medium' && 'bg-primary/20 text-primary',
                      attack.riskLevel === 'low' && 'bg-accent/20 text-accent',
                    )}>
                      {attack.riskLevel.toUpperCase()}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedAttackData && (
          <div className="p-3 rounded-lg bg-secondary/50 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              {attackIcons[selectedAttackData.id]}
              <span className="font-semibold text-primary">{selectedAttackData.name}</span>
            </div>
            <p className="text-xs text-muted-foreground">{selectedAttackData.description}</p>
            <div className="mt-2 flex items-center gap-4">
              <span className="text-xs text-primary">Est. time: {selectedAttackData.estimatedTime}</span>
              <span className={cn(
                'text-xs px-2 py-0.5 rounded',
                selectedAttackData.riskLevel === 'critical' && 'bg-destructive/20 text-destructive',
                selectedAttackData.riskLevel === 'high' && 'bg-warning/20 text-warning',
                selectedAttackData.riskLevel === 'medium' && 'bg-primary/20 text-primary',
                selectedAttackData.riskLevel === 'low' && 'bg-accent/20 text-accent',
              )}>
                Risk: {selectedAttackData.riskLevel}
              </span>
            </div>
          </div>
        )}

        {isSimulating && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{currentAttempt} attempts</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="flex gap-2">
          {!isSimulating ? (
            <Button
              onClick={runSimulation}
              disabled={!selectedTarget || !selectedAttack || wordlist.length === 0}
              className="flex-1"
              variant="success"
              size="lg"
            >
              <Play className="w-4 h-4" />
              START ATTACK
            </Button>
          ) : (
            <Button onClick={stopSimulation} className="flex-1" variant="destructive" size="lg">
              <Square className="w-4 h-4" />
              STOP
            </Button>
          )}
          <Button onClick={resetSimulation} variant="outline" disabled={isSimulating}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {wordlist.length === 0 && (
          <p className="text-xs text-warning text-center">⚠ No wordlist loaded. Admin must upload wordlist first.</p>
        )}
      </CardContent>
    </Card>
  );
};
