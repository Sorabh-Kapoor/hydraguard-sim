export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'analyst' | 'viewer';
  createdAt: Date;
}

export interface TargetAccount {
  id: string;
  username: string;
  password: string;
  isActive: boolean;
}

export interface AttackType {
  id: string;
  name: string;
  description: string;
  icon: string;
  estimatedTime: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface SimulationLog {
  id: string;
  timestamp: Date;
  type: 'info' | 'attempt' | 'success' | 'failure' | 'warning';
  message: string;
}

export interface SimulationResult {
  attackType: string;
  targetUser: string;
  totalAttempts: number;
  successfulAttempts: number;
  timeTaken: number;
  passwordFound: boolean;
  foundPassword?: string;
  riskScore: number;
}

export interface DefenseConfig {
  rateLimiting: boolean;
  captcha: boolean;
  accountLockout: boolean;
  twoFactorAuth: boolean;
  ipBlocking: boolean;
  passwordHashing: 'bcrypt' | 'sha256' | 'argon2';
}

export interface PasswordAnalysis {
  password: string;
  strength: number;
  crackTime: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  suggestions: string[];
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSpecial: boolean;
  length: number;
}
