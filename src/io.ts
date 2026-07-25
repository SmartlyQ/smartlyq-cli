/** Input parsing (--data / --query), output formatting, and error rendering. */
import { readFileSync } from 'node:fs';
import { SmartlyQError } from '@smartlyqofficial/node';
import { CliError } from './util';

export type OutputMode = 'json' | 'pretty';

function defaultReadStdin(): string {
  return readFileSync(0, 'utf8'); // fd 0 = stdin
}

/**
 * Parses a `--data` value into a request body.
 * Accepts inline JSON, `@file.json` to read a file, or `-` to read stdin.
 */
export function parseData(raw: string, readStdin: () => string = defaultReadStdin): unknown {
  let text = raw;
  if (raw === '-') {
    text = readStdin();
  } else if (raw.startsWith('@')) {
    const file = raw.slice(1);
    try {
      text = readFileSync(file, 'utf8');
    } catch (err) {
      throw new CliError(`Could not read --data file "${file}": ${(err as Error).message}`);
    }
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    throw new CliError(`Invalid JSON in --data: ${(err as Error).message}`);
  }
}

/**
 * Parses a `--query` value: either `k=v&k2=v2` pairs or a raw JSON object.
 * Repeated keys in pair form become arrays.
 */
export function parseQuery(raw: string): Record<string, unknown> {
  const trimmed = raw.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch (err) {
      throw new CliError(`Invalid JSON in --query: ${(err as Error).message}`);
    }
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new CliError('--query JSON must be an object, e.g. \'{"status":"draft"}\'.');
    }
    return parsed as Record<string, unknown>;
  }
  const out: Record<string, unknown> = {};
  for (const [key, value] of new URLSearchParams(trimmed)) {
    const existing = out[key];
    if (existing === undefined) {
      out[key] = value;
    } else if (Array.isArray(existing)) {
      existing.push(value);
    } else {
      out[key] = [existing, value];
    }
  }
  return out;
}

/** Renders a successful result. `pretty` (default) is colorless indented JSON. */
export function formatOutput(result: unknown, mode: OutputMode = 'pretty'): string {
  if (result === undefined) return '';
  return mode === 'json' ? JSON.stringify(result) : JSON.stringify(result, null, 2);
}

/** Renders any thrown error as a single stderr line. */
export function formatError(err: unknown): string {
  if (err instanceof CliError) return err.message;
  if (err instanceof SmartlyQError) {
    const code = err.code ?? 'UNKNOWN';
    const request = err.requestId ? ` (request ${err.requestId})` : '';
    return `Error ${err.status} ${code}: ${err.message}${request}`;
  }
  return err instanceof Error ? err.message : String(err);
}
