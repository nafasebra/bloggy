import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

/** @param {string[]} files */
const quotePaths = (files) =>
  files.map((file) => `"${path.resolve(root, file)}"`).join(' ');

/** @param {string} dir */
const relPaths = (dir) => (files) =>
  files.map((f) => path.relative(dir, f).replace(/\\/g, '/'));

/** @param {string} packageDir */
const eslintBin = (packageDir) =>
  path.join(root, packageDir, 'node_modules', 'eslint', 'bin', 'eslint.js');

/**
 * ESLint via node from repo root (works on Windows; avoids `cd … &&`).
 * @param {string} packageDir
 * @param {string} configFile
 */
const eslintNode = (packageDir, configFile = 'eslint.config.mjs') => (files) => {
  if (!files.length) return [];
  const config = path.join(root, packageDir, configFile);
  return `node "${eslintBin(packageDir)}" --config "${config}" --fix --max-warnings 0 ${quotePaths(files)}`;
};

/** ESLint in a pnpm workspace package */
const eslintPnpm = (packageDir) => (files) => {
  const rel = relPaths(packageDir)(files);
  if (!rel.length) return [];
  const pkgPath = path.join(root, packageDir);
  const fileArgs = rel.map((f) => `"${f}"`).join(' ');
  return `pnpm --dir "${pkgPath}" exec eslint --fix --max-warnings 0 ${fileArgs}`;
};

/** @type {import('lint-staged').Configuration} */
export default {
  'backend/{src,test}/**/*.ts': [
    (files) =>
      `npm --prefix backend exec -- prettier --write ${quotePaths(files)}`,
    eslintNode('backend'),
  ],
  'frontend/**/*.{ts,tsx,md,json,css}': (files) =>
    `pnpm --dir "${path.join(root, 'frontend')}" exec prettier --write ${quotePaths(files)}`,
  'frontend/apps/web/**/*.{ts,tsx}': eslintPnpm('frontend/apps/web'),
  'frontend/apps/dashboard/**/*.{ts,tsx}': eslintPnpm(
    'frontend/apps/dashboard',
  ),
  'frontend/apps/storybook/**/*.{ts,tsx}': eslintPnpm(
    'frontend/apps/storybook',
  ),
  'frontend/packages/ui/**/*.{ts,tsx}': eslintPnpm('frontend/packages/ui'),
};
