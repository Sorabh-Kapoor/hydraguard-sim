import { TargetAccount, AttackType, User } from '@/types/hydrax';

export const mockTargetAccounts: TargetAccount[] = [
  { id: '1', username: 'john_doe', password: 'password123', isActive: true },
  { id: '2', username: 'jane_smith', password: 'admin2024', isActive: true },
  { id: '3', username: 'test_user', password: 'test1234', isActive: true },
  { id: '4', username: 'demo_account', password: 'DemoPass!99', isActive: true },
  { id: '5', username: 'security_test', password: 'S3cur3P@ssw0rd!', isActive: false },
];

export const attackTypes: AttackType[] = [
  {
    id: 'brute-force',
    name: 'Brute Force',
    description: 'Systematically tries every possible password combination',
    icon: 'Hammer',
    estimatedTime: '2-5 min',
    riskLevel: 'high',
  },
  {
    id: 'dictionary',
    name: 'Dictionary Attack',
    description: 'Uses a wordlist of common passwords and variations',
    icon: 'BookOpen',
    estimatedTime: '30-60 sec',
    riskLevel: 'medium',
  },
  {
    id: 'hybrid',
    name: 'Hybrid Attack',
    description: 'Combines dictionary words with common patterns and mutations',
    icon: 'Combine',
    estimatedTime: '1-3 min',
    riskLevel: 'high',
  },
  {
    id: 'credential-stuffing',
    name: 'Credential Stuffing',
    description: 'Tests leaked credentials from data breaches',
    icon: 'Database',
    estimatedTime: '15-30 sec',
    riskLevel: 'critical',
  },
  {
    id: 'timing',
    name: 'Timing Attack',
    description: 'Analyzes response time differences to infer valid credentials',
    icon: 'Clock',
    estimatedTime: '3-5 min',
    riskLevel: 'low',
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@hydrax.local',
    password: 'admin',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    username: 'analyst1',
    email: 'analyst@hydrax.local',
    password: 'analyst',
    role: 'analyst',
    createdAt: new Date('2024-02-15'),
  },
];

export const defaultWordlist = [
  'password', '123456', 'password123', 'admin', 'letmein',
  'welcome', 'monkey', 'dragon', 'master', 'qwerty',
  'login', 'passw0rd', 'hello', 'abc123', 'admin123',
  'root', 'toor', 'pass', 'test', 'guest',
  'admin2024', 'password1', 'iloveyou', 'sunshine', 'princess',
  'football', 'baseball', 'soccer', 'hockey', 'batman',
  'superman', 'trustno1', 'shadow', 'ashley', 'michael',
  'test1234', 'DemoPass!99', 'S3cur3P@ssw0rd!',
];
