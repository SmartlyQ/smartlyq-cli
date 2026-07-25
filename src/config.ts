/**
 * Stored-credential handling: `smartlyq login` writes the API key to
 * `~/.smartlyq/config.json` (chmod 600). Resolution order everywhere:
 * `--api-key` flag > `SMARTLYQ_API_KEY` env > config file.
 */
import { chmodSync, existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

interface StoredConfig {
  apiKey?: string;
}

/** Config directory (`~/.smartlyq`, overridable via SMARTLYQ_CONFIG_DIR for tests). */
export function configDir(): string {
  return process.env.SMARTLYQ_CONFIG_DIR ?? join(homedir(), '.smartlyq');
}

export function configPath(): string {
  return join(configDir(), 'config.json');
}

function readConfig(): StoredConfig {
  try {
    return JSON.parse(readFileSync(configPath(), 'utf8')) as StoredConfig;
  } catch {
    return {};
  }
}

/** The API key stored by `smartlyq login`, if any. */
export function readStoredApiKey(): string | undefined {
  const key = readConfig().apiKey;
  return typeof key === 'string' && key.length > 0 ? key : undefined;
}

/** Persists the API key with owner-only permissions. */
export function storeApiKey(apiKey: string): string {
  const dir = configDir();
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  const path = configPath();
  writeFileSync(path, `${JSON.stringify({ ...readConfig(), apiKey }, null, 2)}\n`, { mode: 0o600 });
  chmodSync(path, 0o600); // writeFileSync mode is ignored when the file already exists
  return path;
}

/** Deletes the stored config. Returns true if a file was removed. */
export function deleteStoredApiKey(): boolean {
  const path = configPath();
  if (!existsSync(path)) return false;
  unlinkSync(path);
  return true;
}

/** Resolves the API key: flag > SMARTLYQ_API_KEY env > config file. */
export function resolveApiKey(flagValue?: string): string | undefined {
  if (flagValue) return flagValue;
  const env = process.env.SMARTLYQ_API_KEY;
  if (env) return env;
  return readStoredApiKey();
}
