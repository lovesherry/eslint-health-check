import type { Options as PrettierOptions } from 'prettier';

export type IDEType = 'vscode' | 'cursor';

export interface DepAnalysisResult {
  useEslint: boolean;
  issues: PluginCompatInfo[];
}

export type FileExtType = '.js' | '.ts' | '.jsx' | '.tsx' | '.vue';

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
  issues: string[];
  configContent: string | null;
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

export interface DepCompatibilityResult {
  useEslint: boolean;
  issues: PluginCompatInfo[];
}

export interface PrettierConfigResult {
  ext: FileExtType;
  filePath: string;
  errorMsg: string;
  prettierConfig: PrettierOptions | null;
}

export type IDESettings = Record<string, unknown>;

export interface EslintRulesResult {
  ext: FileExtType;
  filePath: string;
  errorMsg: string;
  rules: RuleUsage[];
}

export interface HealthCheckData {
  nodeInfo: NodeVersionInfo;
  depCompatibility: DepCompatibilityResult;
  eslintConfigFormat: ConfigFormatResult;
  eslintRules: EslintRulesResult[];
  prettierConfig: PrettierConfigResult[];
  editorConfig: string | null;
  ideSettings: IDESettings;
  currentIDE: string;
  hasEslintExtension: boolean;
  hasPrettierExtension: boolean;
}
