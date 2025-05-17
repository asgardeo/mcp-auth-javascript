import {build} from 'esbuild';
import {exec} from 'child_process';
import {promisify} from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

// Common build options
const commonOptions = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  // External dependencies that shouldn't be bundled
  external: ['express', 'cors', '@asgardeo/mcp-node'],
  sourcemap: true,
  minify: true,
  target: 'node18',
};

// Build ESM version
async function buildESM() {
  await build({
    ...commonOptions,
    outfile: 'dist/index.js',
    format: 'esm',
  });
  console.log('✅ ESM build complete');
}

// Build CommonJS version
async function buildCJS() {
  await build({
    ...commonOptions,
    outfile: 'dist/cjs/index.js',
    format: 'cjs',
  });

  // Create a package.json for the CJS directory to specify type
  fs.mkdirSync('dist/cjs', {recursive: true});
  fs.writeFileSync('dist/cjs/package.json', JSON.stringify({type: 'commonjs'}, null, 2));
  console.log('✅ CJS build complete');
}

// Generate TypeScript declaration files
async function generateTypes() {
  try {
    // Using the lib config to generate declarations
    await execAsync('tsc -p tsconfig.lib.json --emitDeclarationOnly');
    console.log('✅ TypeScript declarations generated');
  } catch (error) {
    console.error('❌ Error generating TypeScript declarations:', error);
    process.exit(1);
  }
}

// Clean previous build
async function clean() {
  try {
    await execAsync('rm -rf dist');
    console.log('✅ Previous build cleaned');
  } catch (error) {
    console.error('❌ Error cleaning previous build:', error);
  }
}

// Main build function
async function runBuild() {
  try {
    console.log('🚀 Starting build process...');

    await clean();
    await Promise.all([buildESM(), buildCJS()]);
    await generateTypes();

    console.log('✅ Build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

runBuild();
