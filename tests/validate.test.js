import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

test('tools/validate.mjs: Inhalte sind gültig (Exit-Code 0)', () => {
  const tool = fileURLToPath(new URL('../tools/validate.mjs', import.meta.url));
  const r = spawnSync(process.execPath, [tool], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
});
