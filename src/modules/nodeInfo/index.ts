import os from 'os';
import type { NodeVersionInfo } from '../../types';

export function getNodeEnvironmentInfo(): NodeVersionInfo {
  return {
    version: process.version,
    platform: os.platform(),
    arch: os.arch(),
    nodePath: process.execPath,
  };
}
