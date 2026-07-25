/** Shared naming helpers for the CLI and its generators. */

/** Renders a camelCase SDK name as the kebab-case CLI name (createPost -> create-post). */
export function kebabCase(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

/** Error for user-facing CLI failures (bad input, missing key). Always exits 1. */
export class CliError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CliError';
  }
}
