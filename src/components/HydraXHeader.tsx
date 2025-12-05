import { Shield, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHydraX } from '@/contexts/HydraXContext';

export const HydraXHeader = () => {
  const { currentUser, logout } = useHydraX();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Shield className="w-10 h-10 text-primary animate-pulse-glow" />
            <div className="absolute inset-0 bg-primary/20 blur-xl" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-wider glow-text">
              HYDRAX
            </h1>
            <p className="text-xs text-muted-foreground tracking-widest">
              SECURITY SIMULATION PLATFORM
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs text-muted-foreground">
              LOCAL MODE: 127.0.0.1:5000
            </span>
          </div>

          {currentUser && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm">{currentUser.username}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary uppercase">
                  {currentUser.role}
                </span>
              </div>
              
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </header>
  );
};
