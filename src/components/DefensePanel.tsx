import { Shield, Clock, Lock, Fingerprint, Globe, Key } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHydraX } from '@/contexts/HydraXContext';

export const DefensePanel = () => {
  const { defenseConfig, setDefenseConfig } = useHydraX();

  const toggleDefense = (key: keyof typeof defenseConfig) => {
    if (key === 'passwordHashing') return;
    setDefenseConfig({ ...defenseConfig, [key]: !defenseConfig[key] });
  };

  const defenses = [
    { key: 'rateLimiting', label: 'Rate Limiting', icon: Clock, description: 'Limit login attempts per minute' },
    { key: 'captcha', label: 'CAPTCHA', icon: Shield, description: 'Human verification challenge' },
    { key: 'accountLockout', label: 'Account Lockout', icon: Lock, description: 'Lock after failed attempts' },
    { key: 'twoFactorAuth', label: '2FA', icon: Fingerprint, description: 'Two-factor authentication' },
    { key: 'ipBlocking', label: 'IP Blocking', icon: Globe, description: 'Block suspicious IPs' },
  ] as const;

  return (
    <Card variant="cyber">
      <CardHeader className="border-b border-primary/30">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent" />
          <CardTitle className="text-lg">Defense Controls</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        {defenses.map(({ key, label, icon: Icon, description }) => (
          <div
            key={key}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
            <Switch
              checked={defenseConfig[key] as boolean}
              onCheckedChange={() => toggleDefense(key)}
            />
          </div>
        ))}

        <div className="p-3 rounded-lg bg-secondary/30 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <Key className="w-4 h-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Password Hashing</p>
              <p className="text-xs text-muted-foreground">Algorithm for storing passwords</p>
            </div>
          </div>
          <Select
            value={defenseConfig.passwordHashing}
            onValueChange={(value: 'bcrypt' | 'sha256' | 'argon2') =>
              setDefenseConfig({ ...defenseConfig, passwordHashing: value })
            }
          >
            <SelectTrigger className="bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="bcrypt">bcrypt (Recommended)</SelectItem>
              <SelectItem value="argon2">Argon2 (Most Secure)</SelectItem>
              <SelectItem value="sha256">SHA-256 (Legacy)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
