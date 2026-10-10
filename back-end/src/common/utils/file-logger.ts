import * as fs from 'fs';
import * as path from 'path';

export function appendLog(kind: 'access' | 'error' | 'router', payload: Record<string, unknown>): void {
  const now = new Date();
  const day = now.toISOString().slice(0, 10);
  const logsDir = path.join(process.cwd(), 'logs');
  fs.mkdirSync(logsDir, { recursive: true });
  const line = JSON.stringify({ timestamp: now.toISOString(), ...payload }) + '\n';
  fs.appendFileSync(path.join(logsDir, `${kind}-${day}.log`), line, 'utf8');
}
