import inquirer from 'inquirer';
import type { IDEType } from '../types';

export interface IDEChoice {
  name: string;
  value: IDEType;
}

export const IDE_CHOICES: IDEChoice[] = [
  { name: 'Visual Studio Code', value: 'vscode' },
  { name: 'Cursor', value: 'cursor' },
];

export async function selectIDE(): Promise<IDEType> {
  const { ide } = await inquirer.prompt<{ ide: IDEType }>([
    {
      type: 'list',
      name: 'ide',
      message: 'Please select your current IDE:',
      choices: IDE_CHOICES,
      default: 'vscode',
    },
  ]);

  return ide;
}

export async function confirmEslintExtension(): Promise<boolean> {
  const { hasEslintExtension } = await inquirer.prompt<{
    hasEslintExtension: boolean;
  }>([
    {
      type: 'confirm',
      name: 'hasEslintExtension',
      message:
        '⚠️  IMPORTANT: Have you installed the ESLint extension in your IDE? This will affect the detection results.',
      default: false,
    },
  ]);

  return hasEslintExtension;
}

export async function confirmPrettierExtension(): Promise<boolean> {
  const { hasPrettierExtension } = await inquirer.prompt<{
    hasPrettierExtension: boolean;
  }>([
    {
      type: 'confirm',
      name: 'hasPrettierExtension',
      message:
        '⚠️  CRITICAL: Have you installed the "Prettier - Code formatter" extension in your IDE? This is essential for accurate Prettier configuration analysis.',
      default: false,
    },
  ]);

  return hasPrettierExtension;
}

export async function selectAIProvider(
  availableProviders: string[]
): Promise<string> {
  const { selectedProvider } = await inquirer.prompt<{
    selectedProvider: string;
  }>([
    {
      type: 'list',
      name: 'selectedProvider',
      message: 'Multiple AI providers found. Please select one:',
      choices: availableProviders.map((name) => ({ name, value: name })),
      default: availableProviders[0],
    },
  ]);

  return selectedProvider;
}
