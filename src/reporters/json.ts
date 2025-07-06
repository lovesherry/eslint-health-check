import path from 'path';
import fs from 'fs';
import { HealthCheckData } from '../types';

export function generateJsonReport(healthCheckData: HealthCheckData): void {
  const jsonPath = path.join(process.cwd(), 'health-check-data.json');
  fs.writeFileSync(jsonPath, JSON.stringify(healthCheckData, null, 2), 'utf-8');
  console.log(`✅ Health check data exported to: ${jsonPath}`);
}
