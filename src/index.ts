/**
 * SmartlyQ CLI: builds the commander tree from the generated command
 * descriptors and dispatches through the official Node.js SDK.
 *
 *   smartlyq <resource> <method> [pathArgs...] [flags]
 *   smartlyq social create-post --data '{"text":"hi","account_ids":["acc_1"]}'
 */
import { Command } from 'commander';
import SmartlyQ, { type ClientOptions, type RequestOptions } from '@smartlyqofficial/node';
import { commands, type CommandDescriptor } from './commands.gen';
import { resolveApiKey } from './config';
import { formatError, formatOutput, parseData, parseQuery, type OutputMode } from './io';
import { runLogin, runLogout } from './login';
import { CliError, kebabCase } from './util';
import pkg from '../package.json';

export type { CommandDescriptor } from './commands.gen';
export { commands } from './commands.gen';
export { configDir, configPath, deleteStoredApiKey, readStoredApiKey, resolveApiKey, storeApiKey } from './config';
export { formatError, formatOutput, parseData, parseQuery, type OutputMode } from './io';
export { promptHidden, runLogin, runLogout } from './login';
export { CliError, kebabCase } from './util';

/** Flag values collected by commander for a resource/method command. */
export interface DispatchFlags {
  data?: string;
  query?: string;
  profile?: string;
  idempotencyKey?: string;
  apiKey?: string;
  baseUrl?: string;
  timeout?: string | number;
  output?: OutputMode;
}

const MISSING_KEY_MESSAGE =
  'No API key found. Run `smartlyq login` to store one, or set the SMARTLYQ_API_KEY environment variable, or pass --api-key.';

/**
 * Executes one command descriptor against the SDK and returns the API result.
 * `overrides` lets tests inject a fake fetch via the SDK's ClientOptions.
 */
export async function dispatch(
  desc: CommandDescriptor,
  pathArgs: string[],
  flags: DispatchFlags = {},
  overrides: Partial<ClientOptions> = {},
): Promise<unknown> {
  const apiKey = resolveApiKey(flags.apiKey) ?? overrides.apiKey;
  if (!apiKey) throw new CliError(MISSING_KEY_MESSAGE);

  const clientOptions: ClientOptions = { apiKey };
  if (flags.baseUrl) clientOptions.baseUrl = flags.baseUrl;
  if (flags.timeout !== undefined) {
    const timeout = Number(flags.timeout);
    if (!Number.isFinite(timeout) || timeout <= 0) {
      throw new CliError('--timeout must be a positive number of milliseconds.');
    }
    clientOptions.timeout = timeout;
  }
  Object.assign(clientOptions, overrides, { apiKey });

  const sq = new SmartlyQ(clientOptions);

  // Assemble arguments in the SDK's order: path params, body, query, options.
  const callArgs: unknown[] = [...pathArgs];
  if (desc.hasBody) {
    const body = flags.data !== undefined ? parseData(flags.data) : undefined;
    if (body === undefined && desc.bodyRequired) {
      throw new CliError(
        "This command requires a request body. Pass --data '<json>' (or --data @file.json, or --data - to read stdin).",
      );
    }
    callArgs.push(body);
  }
  if (desc.hasQuery) {
    callArgs.push(flags.query !== undefined ? parseQuery(flags.query) : undefined);
  }
  const options: RequestOptions = {};
  if (flags.profile) options.profileId = flags.profile;
  if (flags.idempotencyKey) options.idempotencyKey = flags.idempotencyKey;
  callArgs.push(Object.keys(options).length > 0 ? options : undefined);

  const resource = (sq as unknown as Record<string, Record<string, (...a: unknown[]) => Promise<unknown>>>)[
    desc.resourceKey
  ];
  return resource[desc.methodName](...callArgs);
}

function fail(err: unknown): void {
  process.stderr.write(`${formatError(err)}\n`);
  process.exitCode = 1;
}

function attachMethodCommand(resourceCmd: Command, desc: CommandDescriptor): void {
  const cmd = resourceCmd
    .command(desc.kebabMethod)
    .description(`${desc.summary} (${desc.httpMethod} ${desc.path})`);

  for (const param of desc.pathParams) {
    cmd.argument(`<${kebabCase(param)}>`, `path parameter for ${desc.path}`);
  }
  if (desc.hasBody) {
    cmd.option(
      '--data <json>',
      `request body as JSON${desc.bodyRequired ? '' : ' (optional)'}; @file.json reads a file, - reads stdin`,
    );
  }
  if (desc.hasQuery) {
    cmd.option('--query <query>', 'query parameters as k=v&k2=v2 pairs or a JSON object');
  }
  cmd
    .option('--profile <id>', 'act on behalf of a managed Profile (X-Profile-Id header)')
    .option('--idempotency-key <key>', 'idempotency key for safely retrying writes')
    .option('--api-key <key>', 'API key (defaults to SMARTLYQ_API_KEY, then `smartlyq login`)')
    .option('--base-url <url>', 'API base URL (default https://api.smartlyq.com/v1)')
    .option('--output <mode>', 'output format: pretty (indented JSON, default) or json (compact)', 'pretty')
    .option('--timeout <ms>', 'request timeout in milliseconds')
    .addHelpText(
      'after',
      [
        '',
        `Endpoint: ${desc.httpMethod} ${desc.path}`,
        ...(desc.pathParams.length > 0
          ? [`Path arguments: ${desc.pathParams.map((p) => `<${kebabCase(p)}>`).join(' ')}`]
          : []),
      ].join('\n'),
    )
    .action(async (...actionArgs: unknown[]) => {
      const flags = actionArgs[actionArgs.length - 2] as DispatchFlags & { output?: string };
      if (flags.output !== undefined && flags.output !== 'json' && flags.output !== 'pretty') {
        fail(new CliError('--output must be "json" or "pretty".'));
        return;
      }
      const pathArgs = actionArgs.slice(0, desc.pathParams.length) as string[];
      try {
        const result = await dispatch(desc, pathArgs, flags);
        const rendered = formatOutput(result, flags.output as OutputMode | undefined);
        if (rendered) process.stdout.write(`${rendered}\n`);
      } catch (err) {
        fail(err);
      }
    });
}

/** Builds the full commander program from the generated descriptors. */
export function buildProgram(): Command {
  const program = new Command('smartlyq');
  program
    .description(
      'SmartlyQ API command line - social posting, AI content generation (articles, images, video, audio, presentations), SEO research, CRM, and more.',
    )
    .version(pkg.version)
    .configureHelp({ sortSubcommands: true });

  program
    .command('login')
    .description('Prompt for your API key and store it in ~/.smartlyq/config.json')
    .action(async () => {
      try {
        await runLogin();
      } catch (err) {
        fail(err);
      }
    });

  program
    .command('logout')
    .description('Delete the stored API key')
    .action(() => {
      try {
        runLogout();
      } catch (err) {
        fail(err);
      }
    });

  const byResource = new Map<string, CommandDescriptor[]>();
  for (const desc of commands) {
    if (!byResource.has(desc.resourceKey)) byResource.set(desc.resourceKey, []);
    byResource.get(desc.resourceKey)!.push(desc);
  }

  for (const [resourceKey, descs] of byResource) {
    const resourceCmd = program
      .command(kebabCase(resourceKey))
      .description(`${descs.length} ${resourceKey} command${descs.length === 1 ? '' : 's'}`);
    for (const desc of descs) attachMethodCommand(resourceCmd, desc);
  }

  return program;
}

/** CLI entry point. */
export async function main(argv: string[] = process.argv): Promise<void> {
  const program = buildProgram();
  await program.parseAsync(argv);
}
