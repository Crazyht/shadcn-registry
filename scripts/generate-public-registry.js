#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const registryDir = join(rootDir, 'registry');
const publicRDir = join(rootDir, 'public', 'r');

console.log('🚀 Generating public registry files...');

// Create public/r directory if it doesn't exist
if (!existsSync(publicRDir)) {
  mkdirSync(publicRDir, { recursive: true });
}

// Read registry.json
const registryJsonPath = join(registryDir, 'registry.json');
if (!existsSync(registryJsonPath)) {
  console.error('❌ registry.json not found at:', registryJsonPath);
  process.exit(1);
}

try {
  const registryContent = readFileSync(registryJsonPath, 'utf-8');
  console.log('📄 Registry file size:', registryContent.length, 'bytes');

  const registry = JSON.parse(registryContent);
  console.log('📋 Registry parsed successfully');
  console.log('📊 Registry items found:', registry.items?.length || 0);

  if (!registry.items || !Array.isArray(registry.items)) {
    console.error('❌ Invalid registry.json structure - items not found or not array');
    console.error('Registry keys:', Object.keys(registry));
    process.exit(1);
  }

  let generatedCount = 0;

  // Generate individual JSON files for each component/hook
  for (const item of registry.items) {
    const filename = `${item.name}.json`;
    const filePath = join(publicRDir, filename);

    // Create a clean item object with only necessary data for public consumption
    const publicItem = {
      name: item.name,
      type: item.type,
      description: item.description || '',
      files: item.files || [],
      dependencies: item.dependencies || [],
      devDependencies: item.devDependencies || []
    };

    // Write the individual JSON file
    writeFileSync(filePath, JSON.stringify(publicItem, null, 2));
    generatedCount++;

    console.log(`✓ Generated ${filename}`);
  }

  console.log(`📦 Generated ${generatedCount} public registry files in public/r/`);
  console.log('✅ Public registry generation completed!');

} catch (error) {
  console.error('❌ Error generating public registry files:', error.message);
  process.exit(1);
}
