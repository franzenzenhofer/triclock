import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const pkgPath = resolve(import.meta.dirname, '..', 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as { version: string };
const [major, minor, patch] = pkg.version.split('.').map(Number);
pkg.version = `${String(major)}.${String(minor)}.${String(patch + 1)}`;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
