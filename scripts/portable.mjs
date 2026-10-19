import { existsSync, readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const envFile = path.join(root, '.env');
if (existsSync(envFile)) process.loadEnvFile(envFile);
const apps = JSON.parse(readFileSync(new URL('./web-apps.json', import.meta.url), 'utf8'));
const mode = process.argv[2];
if (!['build', 'start', 'dev', 'db:push'].includes(mode)) {
  throw new Error('Usage: node scripts/portable.mjs build|start|dev|db:push');
}

function run(command, args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      env: { ...process.env, ...env },
      stdio: 'inherit',
      shell: process.platform === 'win32' && command === 'pnpm',
    });
    const stop = (signal) => child.kill(signal);
    const interrupt = () => stop('SIGINT');
    const terminate = () => stop('SIGTERM');
    process.once('SIGINT', interrupt);
    process.once('SIGTERM', terminate);
    const cleanup = () => {
      process.removeListener('SIGINT', interrupt);
      process.removeListener('SIGTERM', terminate);
    };
    child.once('error', (error) => { cleanup(); reject(error); });
    child.once('exit', (code, signal) => {
      cleanup();
      if (code === 0) resolve();
      else reject(new Error(`${path.basename(command)} exited (${signal || code}).`));
    });
  });
}

function pnpm(args, env) {
  // npm_execpath is supplied by pnpm run, including on Windows.
  return process.env.npm_execpath
    ? run(process.execPath, [process.env.npm_execpath, ...args], env)
    : run('pnpm', args, env);
}

async function build() {
  if (process.env.VITE_PUBLIC_SITE_URL) {
    const url = new URL(process.env.VITE_PUBLIC_SITE_URL);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
      throw new Error('VITE_PUBLIC_SITE_URL must be a public HTTP(S) site URL without credentials.');
    }
  }
  await pnpm(['run', 'typecheck']);
  for (const app of apps) {
    await pnpm(['--filter', app.package, 'run', 'build'], {
      NODE_ENV: 'production',
      PORT: process.env.PORT || '3000',
      BASE_PATH: app.basePath,
    });
  }
  await pnpm(['--filter', '@workspace/api-server', 'run', 'build']);
}

async function start() {
  for (const key of ['DATABASE_URL', 'ADMIN_PASSWORD', 'TOKEN_SECRET']) {
    if (!process.env[key]?.trim()) throw new Error(`${key} is required; configure .env or Railway Variables.`);
  }
  if (process.env.ADMIN_PASSWORD.length < 12 || process.env.TOKEN_SECRET.length < 32) {
    throw new Error('Use ADMIN_PASSWORD with at least 12 characters and TOKEN_SECRET with at least 32 characters.');
  }
  const entry = path.join(root, 'artifacts/api-server/dist/index.mjs');
  if (!existsSync(entry)) throw new Error('Build output missing. Run pnpm build first.');
  await run(process.execPath, ['--enable-source-maps', entry], {
    NODE_ENV: mode === 'dev' ? 'development' : 'production',
    PORT: process.env.PORT || '3000',
    SERVE_STATIC: 'true',
  });
}

try {
  if (mode === 'db:push') {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
    await pnpm(['--filter', '@workspace/db', 'run', 'push']);
  } else {
    if (mode === 'build' || mode === 'dev') await build();
    if (mode !== 'build') await start();
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Command failed.');
  process.exitCode = 1;
}
