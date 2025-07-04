#!/usr/bin/env node
import { runHealthCheck } from '../src/cli/healthCheck';

// 解析命令行参数
const args = process.argv.slice(2);

runHealthCheck(args).catch((err) => {
  console.error('❌ 运行失败:', err);
  process.exit(1);
});
