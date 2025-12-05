import { HydraXHeader } from './HydraXHeader';
import { AttackPanel } from './AttackPanel';
import { SimulationConsole } from './SimulationConsole';
import { ResultsPanel } from './ResultsPanel';
import { DefensePanel } from './DefensePanel';
import { AdminPanel } from './AdminPanel';
import { StatsChart } from './StatsChart';
import { AlertTriangle } from 'lucide-react';

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background cyber-grid relative">
      <div className="absolute inset-0 cyber-scanline opacity-20 pointer-events-none" />
      
      <HydraXHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 p-4 rounded-lg bg-warning/10 border border-warning/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-warning">Educational Purpose Only</p>
            <p className="text-xs text-warning/80">
              This tool is for security testing on authorized local systems (127.0.0.1) only. 
              Unauthorized access to computer systems is illegal.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-4 space-y-6">
            <AttackPanel />
            <DefensePanel />
          </div>

          {/* Middle Column - Console & Results */}
          <div className="lg:col-span-5 space-y-6">
            <SimulationConsole />
            <ResultsPanel />
          </div>

          {/* Right Column - Admin & Stats */}
          <div className="lg:col-span-3 space-y-6">
            <AdminPanel />
            <StatsChart />
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            HydraX v1.0 • Security Simulation Platform • Local Mode Only
          </p>
        </div>
      </footer>
    </div>
  );
};
