
export enum Environment {
  QUAL = 'qual',
  PREPROD = 'preprod',
  PROD = 'prod'
}

export enum Action {
  DEPLOY = 'deploy',
  RESTART = 'restart',
  STOP = 'stop',
  ROLLBACK = 'rollback',
  MAINTENANCE = 'maintenance'
}

export interface CommandConfig {
  project: string;
  environment: string;
  action: Action;
  version: string;
  verbose: boolean;
  checkMode: boolean;
  tags: string[];
  skipTags: string[];
  extraVars: Record<string, string>;
  extraVarsRaw?: string;
  // Advanced parameters
  limit?: string;
  forks?: number;
  diff?: boolean;
  remoteUser?: string;
  become?: boolean;
  startAtTask?: string;
  step?: boolean;
  syntaxCheck?: boolean;
  listTasks?: boolean;
  listTags?: boolean;
  timeout?: number;
  vaultPassword?: string;
  // M472 Specifics
  phase?: string;
  useMogendHome?: boolean;
}

export interface DeploymentProject {
  id: string;
  name: string;
  icon: string;
  playbook: string;
}

export interface SavedCommand {
  id: string;
  name: string;
  command: string;
  timestamp: number;
}
