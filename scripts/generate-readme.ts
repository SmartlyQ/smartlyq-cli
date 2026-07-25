/**
 * Regenerates the "Command Reference" section of README.md (between the marker
 * comments) from openapi.json, so the README always matches the CLI surface.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { kebabCase } from '../src/util';
import { buildModel, type MethodSpec } from './model';

const BEGIN = '<!-- BEGIN GENERATED REFERENCE -->';
const END = '<!-- END GENERATED REFERENCE -->';

function commandLine(resourceKey: string, m: MethodSpec): string {
  const parts = ['smartlyq', kebabCase(resourceKey), kebabCase(m.name)];
  for (const p of m.pathParams) parts.push(`<${kebabCase(p.arg)}>`);
  if (m.hasBody) parts.push(m.bodyRequired ? '--data <json>' : '[--data <json>]');
  if (m.hasQuery) parts.push('[--query <query>]');
  return parts.join(' ');
}

const resources = buildModel();
const lines: string[] = [];

for (const r of resources) {
  lines.push(`### ${r.tag}`, '');
  lines.push('| Command | Endpoint | Description |');
  lines.push('| --- | --- | --- |');
  for (const m of r.methods) {
    lines.push(`| \`${commandLine(r.key, m)}\` | \`${m.httpMethod} ${m.path}\` | ${m.summary} |`);
  }
  lines.push('');
}

const readme = readFileSync('README.md', 'utf8');
const beginIdx = readme.indexOf(BEGIN);
const endIdx = readme.indexOf(END);
if (beginIdx === -1 || endIdx === -1) {
  throw new Error('README.md is missing the generated-reference markers.');
}

const updated =
  readme.slice(0, beginIdx + BEGIN.length) + '\n\n' + lines.join('\n') + readme.slice(endIdx);
writeFileSync('README.md', updated);

const count = resources.reduce((n, r) => n + r.methods.length, 0);
console.log(`README reference updated: ${resources.length} resources, ${count} commands.`);
