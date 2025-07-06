#!/usr/bin/env node
import { runHealthCheck } from '../src/cli/healthCheck';

runHealthCheck().catch((err) => {
  console.error('❌ 运行失败:', err);
  process.exit(1);
});
