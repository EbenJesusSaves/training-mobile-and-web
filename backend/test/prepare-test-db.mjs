// Creates (if needed) and migrates the e2e test database. Never touches the development database.
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import pg from 'pg';

if (existsSync('.env')) process.loadEnvFile('.env');
const url = process.env.TEST_DATABASE_URL;
if (!url) throw new Error('Set TEST_DATABASE_URL (see .env.example).');
const parsed = new URL(url);
const database = parsed.pathname.slice(1);
if (!database.endsWith('_test')) throw new Error(`Refusing to use "${database}" for tests: the name must end in _test.`);

const admin = new pg.Client({ connectionString: url.replace(`/${database}`, '/postgres') });
await admin.connect();
const exists = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [database]);
if (exists.rowCount === 0) await admin.query(`CREATE DATABASE "${database}"`);
await admin.end();

execSync('npx prisma migrate deploy', { stdio: 'inherit', env: { ...process.env, DATABASE_URL: url } });
