import type { Options as PrettierOptions } from 'prettier';

export type IDEType = 'vscode' | 'webstorm' | 'cursor';
export interface PackageJson {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  engines?: {
    node?: string;
    npm?: string;
  };
  publisher?: string;
}

export interface PluginCompatInfo {
  name: string;
  version: string;
  peerDependencies: Record<string, string>;
  engines: Record<string, string>;
  compatible: boolean;
  issues: string[];
}

export interface ConfigFormatResult {
  eslintVersion: string;
  configType: 'flat' | 'eslintrc' | 'unknown';
  configFile: string | null;
  configFilePath: string | null;
  configFiles: { name: string; exists: boolean }[];
  compatible: boolean;
  issues: string[];
}

export interface RuleUsage {
  name: string;
  status: 'off' | 'on' | 'warn';
  value: (string | number)[];
}
export interface FileRuleAnalysis {
  fileType: string;
  filePath: string;
  rules: RuleUsage[];
}

export interface EditorConfigAnalysis {
  exists: boolean;
  content: string | null;
  extensionInstalled: boolean;
  detectIndentsEnabled: boolean;
  effective: boolean;
}

export interface IDEExtensionInfo {
  ide: string;
  extension: string;
  version?: string;
  status: 'maybe-installed' | 'not-installed';
}

export interface NodeVersionInfo {
  version: string;
  platform: string;
  arch: string;
  nodePath: string;
}

export interface PrettierConfigByType {
  fileType: string;
  filePath: string;
  prettierConfig: PrettierOptions | null;
}
