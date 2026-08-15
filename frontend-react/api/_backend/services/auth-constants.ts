import fs from 'node:fs';
import path from 'node:path';

function loadEnvFile(): void {
  if (process.env.JWT_SECRET) return;

  const candidates = [
    path.resolve(__dirname, '../../.env.local'),
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env.local'),
    path.resolve(__dirname, '../.env'),
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), 'backend/.env.local'),
    path.resolve(process.cwd(), 'backend/.env'),
  ];

  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) continue;

    const content = fs.readFileSync(candidate, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const match = trimmed.match(/^([^=\s]+)=(.*)$/);
      if (!match) continue;
      const [, key, value] = match;
      if (process.env[key] === undefined) {
        process.env[key] = value.replace(/(^"|"$)/g, '');
      }
    }

    if (process.env.JWT_SECRET) {
      return;
    }
  }
}

loadEnvFile();

export const ACCESS_TOKEN_EXP_SECONDS = Number(process.env.ACCESS_TOKEN_EXP_SECONDS ?? 900); // 15m
export const REFRESH_TOKEN_EXP_SECONDS = Number(process.env.REFRESH_TOKEN_EXP_SECONDS ?? 60 * 60 * 24 * 30); // 30 days
export const JWT_ALGORITHM = 'HS256';
export const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-jwt-secret-phase6b-verification-key-12345';
export const TOKEN_ISSUER = process.env.TOKEN_ISSUER ?? 'qutoof-nature';
