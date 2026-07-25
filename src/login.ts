/** `smartlyq login` / `smartlyq logout`: manage the stored API key. */
import { createInterface } from 'node:readline';
import { Writable } from 'node:stream';
import { configPath, deleteStoredApiKey, storeApiKey } from './config';
import { CliError } from './util';

/** Prompts on the terminal without echoing the typed characters. */
export function promptHidden(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    process.stdout.write(prompt);
    const muted = new Writable({
      write(_chunk, _encoding, callback) {
        callback(); // swallow echo so the key is never printed
      },
    });
    const rl = createInterface({ input: process.stdin, output: muted, terminal: true });
    rl.question('', (answer) => {
      rl.close();
      process.stdout.write('\n');
      resolve(answer.trim());
    });
    rl.on('error', reject);
  });
}

export async function runLogin(): Promise<void> {
  const key = await promptHidden('SmartlyQ API key (input hidden): ');
  if (!key) {
    throw new CliError('No API key entered. Get one from your Developer Dashboard at https://app.smartlyq.com.');
  }
  if (!/^sqk_(live|test)_/.test(key)) {
    process.stderr.write('Warning: the key does not look like a SmartlyQ API key (sqk_live_... / sqk_test_...). Storing it anyway.\n');
  }
  const path = storeApiKey(key);
  process.stdout.write(`API key saved to ${path}\n`);
}

export function runLogout(): void {
  const removed = deleteStoredApiKey();
  process.stdout.write(
    removed ? `Logged out. Deleted ${configPath()}\n` : 'No stored API key found. Nothing to do.\n',
  );
}
