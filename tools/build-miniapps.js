#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { rspack } = require('@rspack/core');

const PLATFORM = process.env.PLATFORM || 'android';
const MODE = process.env.NODE_ENV || 'development';

const projectRoot = path.resolve(__dirname, '..');
const distChunksDir = path.join(projectRoot, 'dist', 'chunks');

async function buildAll() {
  console.log(`[Re.Pack] Building dynamic mini-apps for platform: ${PLATFORM} (${MODE})...`);

  if (!fs.existsSync(distChunksDir)) {
    fs.mkdirSync(distChunksDir, { recursive: true });
  }

  const configModule = await import('../rspack.config.mjs');
  const configFn = configModule.default;
  const miniAppsToBuild = Object.keys(configModule.MINI_APPS || {});

  for (const miniapp of miniAppsToBuild) {
    console.log(`\n========================================`);
    console.log(`Building Mini-App Container: ${miniapp}`);
    console.log(`========================================`);

    process.env.MINIAPP = miniapp;
    process.env.PLATFORM = PLATFORM;
    process.env.NODE_ENV = MODE;

    const config = configFn({
      mode: MODE,
      platform: PLATFORM,
      context: projectRoot,
    });

    await new Promise((resolve, reject) => {
      rspack(config, (err, stats) => {
        if (err) {
          console.error(`[Error] Rspack compilation error:`, err);
          return reject(err);
        }
        if (stats?.hasErrors()) {
          const info = stats.toJson({ errors: true });
          console.error(`[Error] Build errors for ${miniapp}:`, info.errors);
          return reject(new Error(`Build failed for ${miniapp}`));
        }
        console.log(`[Success] Container ${miniapp} built successfully.`);
        resolve();
      });
    });
  }

  console.log(`\nAll dynamic mini-apps successfully built into: dist/chunks/`);
}

buildAll().catch((err) => {
  console.error('[Fatal] Mini-app build failed:', err.message);
  process.exit(1);
});
