/**
 * Filters the spec-derived model down to what the INSTALLED SDK actually
 * supports. When the spec is momentarily ahead of the published
 * @smartlyqofficial/node package (registry propagation, publish in flight),
 * the affected commands are skipped with a notice instead of generating a
 * CLI that calls methods the SDK does not have - they appear automatically
 * on the next regeneration once the SDK has caught up.
 */
import { SmartlyQ } from '@smartlyqofficial/node';

import type { ResourceSpec } from './model';

export function filterToInstalledSdk(resources: ResourceSpec[]): ResourceSpec[] {
  const probe = new SmartlyQ({ apiKey: 'sqk_test_xxxxxxxxxxxx' }) as unknown as Record<
    string,
    Record<string, unknown>
  >;

  const skipped: string[] = [];
  const kept = resources
    .map((r) => {
      const methods = r.methods.filter((m) => {
        const supported = typeof probe[r.key]?.[m.name] === 'function';
        if (!supported) skipped.push(`${r.key}.${m.name} (${m.httpMethod} ${m.path})`);
        return supported;
      });
      return { ...r, methods };
    })
    .filter((r) => r.methods.length > 0);

  if (skipped.length > 0) {
    console.log(
      `NOTE: skipped ${skipped.length} command(s) not yet in the installed SDK ` +
        `(spec ahead of published package - they will appear on the next regeneration):`,
    );
    for (const s of skipped) console.log(`  - ${s}`);
  }
  return kept;
}
