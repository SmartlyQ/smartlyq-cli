/** Executable entry point for the `smartlyq` bin. */
import { main } from './index';
import { formatError } from './io';

main().catch((err: unknown) => {
  process.stderr.write(`${formatError(err)}\n`);
  process.exitCode = 1;
});
