import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const root = fileURLToPath(new URL('../', import.meta.url));
const reserve = createServer();
await new Promise((resolve) => reserve.listen(0, '127.0.0.1', resolve));
const port = reserve.address().port;
await new Promise((resolve) => reserve.close(resolve));
const env = { ...process.env };
for (const key of Object.keys(env)) {
  if (key.startsWith('REPLIT_') || key.startsWith('REPL_')) delete env[key];
}
Object.assign(env, {
  PORT: String(port),
  OBJECT_STORAGE_BACKEND: 'gcs',
  ADMIN_PASSWORD: randomBytes(24).toString('hex'),
  TOKEN_SECRET: randomBytes(48).toString('hex'),
});
const child = spawn(process.execPath, ['scripts/portable.mjs', 'start'], {
  cwd: root, env, stdio: ['ignore', 'pipe', 'pipe'],
});
let logs = '';
child.stdout.on('data', (data) => { logs = (logs + data).slice(-12000); });
child.stderr.on('data', (data) => { logs = (logs + data).slice(-12000); });
const base = `http://127.0.0.1:${port}`;
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (child.exitCode !== null) throw new Error('Portable server exited before becoming ready.');
    try {
      const response = await fetch(`${base}/api/healthz`, { signal: AbortSignal.timeout(1500) });
      if (response.ok) { ready = true; break; }
    } catch {}
    await delay(250);
  }
  assert.ok(ready, 'Portable server must expose /api/healthz without Replit runtime variables.');
  for (const route of ['/', '/admin', '/tip/sample-slug', '/youtube-analyzer/', '/internet-promo/', '/internet-promo-v1/']) {
    const response = await fetch(base + route);
    assert.equal(response.status, 200, route);
    assert.match(response.headers.get('content-type'), /text\/html/, route);
    const html = await response.text();
    const src = html.match(/<script[^>]+src="([^"]+)"/)?.[1];
    assert.ok(src, `Built JavaScript must be referenced: ${route}`);
    const asset = await fetch(new URL(src, base + route));
    assert.equal(asset.status, 200, src);
    assert.match(asset.headers.get('content-type'), /javascript/, src);
    await asset.arrayBuffer();
    console.log(`PASS ${route}: HTML and built JavaScript`);
  }
  const missing = await fetch(`${base}/api/__portable_missing`);
  assert.equal(missing.status, 404);
  assert.match(missing.headers.get('content-type'), /json/);
  const admin = await fetch(`${base}/api/admin/me`);
  assert.equal(admin.status, 401, 'Admin endpoints must remain protected.');
  console.log('PASS healthcheck, API 404, admin protection, injected PORT, no Replit identity');
  console.log('Cloud storage credentials, remote integrations, and Railway itself are not exercised.');
} catch (error) {
  // These are startup/health/static requests only; never print environment values.
  console.error(error instanceof Error ? error.message : 'Portable verification failed.');
  console.error(logs);
  process.exitCode = 1;
} finally {
  child.kill('SIGTERM');
  await Promise.race([
    new Promise((resolve) => child.once('exit', resolve)),
    delay(5000).then(() => { child.kill('SIGKILL'); }),
  ]);
}
