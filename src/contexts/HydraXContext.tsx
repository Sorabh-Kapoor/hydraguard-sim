import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, TargetAccount, DefenseConfig, SimulationLog, SimulationResult } from '@/types/hydrax';
import { mockUsers, mockTargetAccounts, defaultWordlist } from '@/data/mockData';

interface HydraXContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  targetAccounts: TargetAccount[];
  setTargetAccounts: (accounts: TargetAccount[]) => void;
  wordlist: string[];
  setWordlist: (words: string[]) => void;
  defenseConfig: DefenseConfig;
  setDefenseConfig: (config: DefenseConfig) => void;
  simulationLogs: SimulationLog[];
  addLog: (log: Omit<SimulationLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  isSimulating: boolean;
  setIsSimulating: (value: boolean) => void;
  simulationResult: SimulationResult | null;
  setSimulationResult: (result: SimulationResult | null) => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const HydraXContext = createContext<HydraXContextType | undefined>(undefined);

export const HydraXProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [targetAccounts, setTargetAccounts] = useState<TargetAccount[]>(mockTargetAccounts);
  const [wordlist, setWordlist] = useState<string[]>(defaultWordlist);
  const [simulationLogs, setSimulationLogs] = useState<SimulationLog[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [defenseConfig, setDefenseConfig] = useState<DefenseConfig>({
    rateLimiting: false,
    captcha: false,
    accountLockout: false,
    twoFactorAuth: false,
    ipBlocking: false,
    passwordHashing: 'bcrypt',
  });

  const addLog = useCallback((log: Omit<SimulationLog, 'id' | 'timestamp'>) => {
    const newLog: SimulationLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    setSimulationLogs(prev => [...prev, newLog]);
  }, []);

  const clearLogs = useCallback(() => {
    setSimulationLogs([]);
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    const user = mockUsers.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    clearLogs();
    setSimulationResult(null);
  }, [clearLogs]);

  return (
    <HydraXContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        targetAccounts,
        setTargetAccounts,
        wordlist,
        setWordlist,
        defenseConfig,
        setDefenseConfig,
        simulationLogs,
        addLog,
        clearLogs,
        isSimulating,
        setIsSimulating,
        simulationResult,
        setSimulationResult,
        login,
        logout,
      }}
    >
      {children}
    </HydraXContext.Provider>
  );
};

export const useHydraX = () => {
  const context = useContext(HydraXContext);
  if (!context) {
    throw new Error('useHydraX must be used within a HydraXProvider');
  }
  return context;
};
