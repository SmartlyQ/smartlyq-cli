# Contributing

Thanks for your interest in the SmartlyQ CLI!

## How this repo works

Most of this CLI is **generated** from the [SmartlyQ OpenAPI spec](https://docs.smartlyq.com):

- `src/commands.gen.ts` - the command descriptors, emitted by `scripts/generate-commands.ts`. Never edit by hand.
- `tests/commands.gen.test.ts` - per-command tests, emitted by `scripts/generate-tests.ts`. Never edit by hand.
- The README's Command Reference section is emitted by `scripts/generate-readme.ts`.

Hand-written code lives in `src/index.ts`, `src/cli.ts`, `src/config.ts`, `src/io.ts`, `src/login.ts`, `src/util.ts`, `scripts/`, and `tests/cli.test.ts`. Fixes to generated output belong in the generator scripts, or in the OpenAPI spec itself. The naming rules in `scripts/model.ts` are shared with the [Node.js SDK](https://www.npmjs.com/package/@smartlyqofficial/node) and must stay in sync with it.

```bash
npm ci
npm run generate           # regenerate src/commands.gen.ts from openapi.json
npm run generate:tests
npm run generate:readme
npm run build && npm test
```

## Never commit secrets

This is a **public** repository. Never commit real API keys (`sqk_live_...` / `sqk_test_...`), credentials, tokens, internal hostnames, or customer data. Use placeholders like `sqk_live_xxxxxxxxxxxx` or `YOUR_API_KEY` in examples.

Enable the local pre-commit scan once per clone:

```bash
git config core.hooksPath .githooks
```

CI also runs a gitleaks scan on every push and pull request. If you believe a secret has been exposed, rotate it immediately in your Developer Dashboard.
