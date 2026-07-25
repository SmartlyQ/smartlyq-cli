/** Hand-written CLI tests: naming, input parsing, config precedence, errors. */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SmartlyQError } from '@smartlyqofficial/node';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { commands } from '../src/commands.gen';
import {
  CliError,
  configPath,
  dispatch,
  formatError,
  formatOutput,
  kebabCase,
  parseData,
  parseQuery,
  readStoredApiKey,
  resolveApiKey,
  storeApiKey,
} from '../src/index';

const CLI_BIN = fileURLToPath(new URL('../dist/cli.js', import.meta.url));

describe('kebab-case mapping', () => {
  it('renders SDK camelCase method names as kebab-case', () => {
    expect(kebabCase('createPost')).toBe('create-post');
    expect(kebabCase('getMe')).toBe('get-me');
    expect(kebabCase('keywordResearch')).toBe('keyword-research');
    expect(kebabCase('textToSpeech')).toBe('text-to-speech');
    expect(kebabCase('list')).toBe('list');
  });

  it('maps every descriptor consistently', () => {
    expect(commands.length).toBeGreaterThan(100);
    for (const c of commands) {
      expect(c.kebabMethod).toBe(kebabCase(c.methodName));
    }
  });

  it('exposes the expected commands', () => {
    const names = commands.map((c) => `${c.resourceKey} ${c.kebabMethod}`);
    expect(names).toContain('social create-post');
    expect(names).toContain('account get-me');
    expect(names).toContain('seo keyword-research');
    expect(names).toContain('jobs get');
  });
});

describe('--data parsing', () => {
  it('parses inline JSON', () => {
    expect(parseData('{"text":"hi"}')).toEqual({ text: 'hi' });
  });

  it('reads @file.json from disk', () => {
    const dir = mkdtempSync(join(tmpdir(), 'sq-cli-data-'));
    const file = join(dir, 'body.json');
    writeFileSync(file, '{"text":"from file","n":2}');
    try {
      expect(parseData(`@${file}`)).toEqual({ text: 'from file', n: 2 });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('reads - from stdin', () => {
    expect(parseData('-', () => '{"text":"from stdin"}')).toEqual({ text: 'from stdin' });
  });

  it('rejects invalid JSON with a CliError', () => {
    expect(() => parseData('{oops')).toThrow(CliError);
    expect(() => parseData('@/nonexistent/path.json')).toThrow(CliError);
  });
});

describe('--query parsing', () => {
  it('parses k=v&k2=v2 pairs', () => {
    expect(parseQuery('status=draft&page=2')).toEqual({ status: 'draft', page: '2' });
  });

  it('collects repeated keys into arrays', () => {
    expect(parseQuery('tag=a&tag=b&tag=c')).toEqual({ tag: ['a', 'b', 'c'] });
  });

  it('parses a raw JSON object', () => {
    expect(parseQuery('{"status":"draft","page":2}')).toEqual({ status: 'draft', page: 2 });
  });

  it('rejects non-object JSON and bad JSON', () => {
    expect(() => parseQuery('{bad')).toThrow(CliError);
    expect(() => parseQuery('[1,2]')).toThrow(CliError);
  });
});

describe('config file and API key precedence', () => {
  let dir: string;
  let savedEnvKey: string | undefined;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'sq-cli-config-'));
    process.env.SMARTLYQ_CONFIG_DIR = dir;
    savedEnvKey = process.env.SMARTLYQ_API_KEY;
    delete process.env.SMARTLYQ_API_KEY;
  });

  afterEach(() => {
    delete process.env.SMARTLYQ_CONFIG_DIR;
    if (savedEnvKey === undefined) delete process.env.SMARTLYQ_API_KEY;
    else process.env.SMARTLYQ_API_KEY = savedEnvKey;
    rmSync(dir, { recursive: true, force: true });
  });

  it('stores the key with owner-only permissions and reads it back', () => {
    const path = storeApiKey('sqk_test_xxxxxxxxxxxx');
    expect(path).toBe(configPath());
    expect(existsSync(path)).toBe(true);
    expect(statSync(path).mode & 0o777).toBe(0o600);
    expect(readStoredApiKey()).toBe('sqk_test_xxxxxxxxxxxx');
    expect(JSON.parse(readFileSync(path, 'utf8')).apiKey).toBe('sqk_test_xxxxxxxxxxxx');
  });

  it('resolves flag > env > config file', () => {
    storeApiKey('sqk_test_filexxxxxxxxxx');
    expect(resolveApiKey(undefined)).toBe('sqk_test_filexxxxxxxxxx');

    process.env.SMARTLYQ_API_KEY = 'sqk_test_envxxxxxxxxxxx';
    expect(resolveApiKey(undefined)).toBe('sqk_test_envxxxxxxxxxxx');

    expect(resolveApiKey('sqk_test_flagxxxxxxxxxx')).toBe('sqk_test_flagxxxxxxxxxx');
  });

  it('returns undefined when nothing is configured', () => {
    expect(resolveApiKey(undefined)).toBeUndefined();
  });
});

describe('error formatting', () => {
  it('formats SmartlyQError with status, code, message, and request id', () => {
    const err = new SmartlyQError(
      401,
      {
        error: { code: 'INVALID_API_KEY', message: 'Invalid API key' },
        meta: { request_id: 'req_abc123' },
      },
      'HTTP 401',
    );
    expect(formatError(err)).toBe('Error 401 INVALID_API_KEY: Invalid API key (request req_abc123)');
  });

  it('omits the request suffix when there is no request id', () => {
    const err = new SmartlyQError(500, { error: { code: 'SERVER_ERROR', message: 'Boom' } }, 'HTTP 500');
    expect(formatError(err)).toBe('Error 500 SERVER_ERROR: Boom');
  });

  it('renders CliErrors as their plain message', () => {
    expect(formatError(new CliError('Bad input'))).toBe('Bad input');
  });
});

describe('output formatting', () => {
  it('pretty is indented, json is compact, undefined is empty', () => {
    expect(formatOutput({ a: 1 })).toBe('{\n  "a": 1\n}');
    expect(formatOutput({ a: 1 }, 'json')).toBe('{"a":1}');
    expect(formatOutput(undefined)).toBe('');
  });
});

describe('dispatch', () => {
  const getMe = commands.find((c) => c.resourceKey === 'account' && c.methodName === 'getMe')!;
  const createPost = commands.find((c) => c.resourceKey === 'social' && c.methodName === 'createPost')!;

  it('fails with a login hint when no API key is available', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'sq-cli-nokey-'));
    process.env.SMARTLYQ_CONFIG_DIR = dir;
    const saved = process.env.SMARTLYQ_API_KEY;
    delete process.env.SMARTLYQ_API_KEY;
    try {
      await expect(dispatch(getMe, [], {})).rejects.toThrow(/smartlyq login/);
    } finally {
      delete process.env.SMARTLYQ_CONFIG_DIR;
      if (saved !== undefined) process.env.SMARTLYQ_API_KEY = saved;
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('requires --data for a required body', async () => {
    await expect(dispatch(createPost, [], { apiKey: 'sqk_test_xxxxxxxxxxxx' })).rejects.toThrow(/--data/);
  });

  it('sends body, query, and per-request headers through the SDK', async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    const fetchImpl: typeof fetch = async (input, init) => {
      calls.push({ url: String(input), init: init ?? {} });
      return new Response(JSON.stringify({ success: true, data: { id: 'post_1' } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };
    const listPosts = commands.find((c) => c.resourceKey === 'social' && c.methodName === 'listPosts')!;

    await dispatch(
      createPost,
      [],
      {
        apiKey: 'sqk_test_xxxxxxxxxxxx',
        data: '{"text":"hi","account_ids":["acc_1"]}',
        profile: 'prof_1',
        idempotencyKey: 'idem-1',
      },
      { fetch: fetchImpl, maxRetries: 0 },
    );
    expect(calls[0].init.body).toBe('{"text":"hi","account_ids":["acc_1"]}');
    const headers = calls[0].init.headers as Record<string, string>;
    expect(headers['X-Profile-Id']).toBe('prof_1');
    expect(headers['Idempotency-Key']).toBe('idem-1');

    await dispatch(
      listPosts,
      [],
      { apiKey: 'sqk_test_xxxxxxxxxxxx', query: 'status=scheduled&page=2' },
      { fetch: fetchImpl, maxRetries: 0 },
    );
    const url = new URL(calls[1].url);
    expect(url.pathname).toBe('/v1/social/posts');
    expect(url.searchParams.get('status')).toBe('scheduled');
    expect(url.searchParams.get('page')).toBe('2');
  });
});

describe('built CLI exit codes (dist/cli.js)', () => {
  const emptyConfigDir = mkdtempSync(join(tmpdir(), 'sq-cli-bin-'));
  const cleanEnv = {
    ...process.env,
    SMARTLYQ_CONFIG_DIR: emptyConfigDir,
    SMARTLYQ_API_KEY: undefined as unknown as string,
  };
  delete (cleanEnv as Record<string, unknown>).SMARTLYQ_API_KEY;

  it('--help exits 0 and lists resources', () => {
    const res = spawnSync(process.execPath, [CLI_BIN, '--help'], { encoding: 'utf8' });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('social');
    expect(res.stdout).toContain('login');
  });

  it('missing API key exits 1 with a login hint', () => {
    const res = spawnSync(process.execPath, [CLI_BIN, 'account', 'get-me'], {
      encoding: 'utf8',
      env: cleanEnv,
    });
    expect(res.status).toBe(1);
    expect(res.stderr).toContain('smartlyq login');
  });

  it('invalid --data JSON exits 1 without calling the API', () => {
    const res = spawnSync(
      process.execPath,
      [CLI_BIN, 'social', 'create-post', '--data', '{nope', '--api-key', 'sqk_test_xxxxxxxxxxxx'],
      { encoding: 'utf8', env: cleanEnv },
    );
    expect(res.status).toBe(1);
    expect(res.stderr).toContain('Invalid JSON in --data');
  });
});
