#!/usr/bin/env node

import { mkdirSync, copyFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const registryDir = join(rootDir, 'registry');
const distDir = join(rootDir, 'dist');
const distRegistryDir = join(distDir, 'registry');

console.log('🚀 Building registry...');
console.log('📁 Root dir:', rootDir);
console.log('📁 Registry dir:', registryDir);
console.log('📁 Dist dir:', distDir);

// First, generate public registry files
console.log('📦 Generating public registry files...');
execSync('node scripts/generate-public-registry.js', { cwd: rootDir, stdio: 'inherit' });

// Create dist/registry directory
if (!existsSync(distRegistryDir)) {
  mkdirSync(distRegistryDir, { recursive: true });
}

// Copy registry.json
const registryJsonPath = join(registryDir, 'registry.json');
const distRegistryJsonPath = join(distRegistryDir, 'registry.json');

if (existsSync(registryJsonPath)) {
  copyFileSync(registryJsonPath, distRegistryJsonPath);
  console.log('✓ Copied registry.json');
}

// Function to copy directory recursively
function copyDirectory(src, dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }

  const items = readdirSync(src);

  for (const item of items) {
    const srcPath = join(src, item);
    const destPath = join(dest, item);

    if (statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

// Copy the entire new-york directory structure
const newYorkSrc = join(registryDir, 'new-york');
const newYorkDest = join(distRegistryDir, 'new-york');

if (existsSync(newYorkSrc)) {
  copyDirectory(newYorkSrc, newYorkDest);
  console.log('✓ Copied new-york components');
}

// Count files
function countFiles(dir) {
  let count = 0;
  if (!existsSync(dir)) return count;

  const items = readdirSync(dir);
  for (const item of items) {
    const itemPath = join(dir, item);
    if (statSync(itemPath).isDirectory()) {
      count += countFiles(itemPath);
    } else {
      count++;
    }
  }
  return count;
}

const totalFiles = countFiles(distRegistryDir);
console.log(`📦 Total files in production registry: ${totalFiles}`);
console.log('✅ Registry build completed!');
