import path from 'node:path';
import http from 'node:http';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as Repack from '@callstack/repack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let chunkServer = null;

function ensureChunkServer(distDir) {
  if (chunkServer || process.env.MINIAPP) return;

  const server = http.createServer((req, res) => {
    const urlPath = (req.url || '').split('?')[0];
    const filePath = path.join(distDir, urlPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const isPng = urlPath.endsWith('.png');
      res.writeHead(200, {
        'Content-Type': isPng
          ? 'image/png'
          : 'application/javascript; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      });
      return fs.createReadStream(filePath).pipe(res);
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Chunk not found');
  });

  server.on('error', err => {
    if (err.code !== 'EADDRINUSE') {
      console.warn('[ChunkServer] Port 8088 warning:', err.message);
    }
  });

  server.listen(8088, '0.0.0.0', () => {
    console.log(
      'ℹ [ChunkServer] Micro-frontend chunk server listening at http://0.0.0.0:8088',
    );
  });

  chunkServer = server;
}

// Host provides eager singletons for the entire application
const HOST_SHARED = {
  react: { singleton: true, eager: true, requiredVersion: false },
  'react-native': { singleton: true, eager: true, requiredVersion: false },
  'react-native/': { singleton: true, eager: true, requiredVersion: false },
  '@react-native/': { singleton: true, eager: true, requiredVersion: false },
};

// Containers consume the host's singletons lazily without providing their own copy,
// preventing premature share-scope initialization and shrinking bundle size.
const CONTAINER_SHARED = {
  react: {
    singleton: true,
    eager: false,
    import: false,
    requiredVersion: false,
  },
  'react-native': {
    singleton: true,
    eager: false,
    import: false,
    requiredVersion: false,
  },
  'react-native/': {
    singleton: true,
    eager: false,
    import: false,
    requiredVersion: false,
  },
  '@react-native/': {
    singleton: true,
    eager: false,
    import: false,
    requiredVersion: false,
  },
};

// Remote Mini-App definitions
export const MINI_APPS = {
  news_service: {
    name: 'news_service',
    exposes: {
      './NewsFeedScreen': './src/services/newsService/NewsFeedScreen.tsx',
    },
  },
  payment_service: {
    name: 'payment_service',
    exposes: {
      './PaymentQuickPayScreen':
        './src/services/paymentService/PaymentQuickPayScreen.tsx',
    },
  },
  test_service: {
    name: 'test_service',
    exposes: {
      './TestService': './src/services/testService/testService.tsx',
    },
  },
};

const EMPTY_MODULE = path.join(
  __dirname,
  'node_modules',
  '@callstack',
  'repack',
  'dist',
  'modules',
  'EmptyModule.js',
);
const INIT_SCRIPT_MANAGER = path.join(
  __dirname,
  'node_modules',
  '@callstack',
  'repack',
  'dist',
  'modules',
  'InitializeScriptManager.js',
);
const CONTAINER_ENTRY = path.join(
  __dirname,
  'src',
  'repack',
  'containerEntry.ts',
);

export default Repack.defineRspackConfig(env => {
  const {
    mode = 'development',
    context = __dirname,
    entry = './index.js',
    platform = process.env.PLATFORM || 'android',
    minimize = mode === 'production',
  } = env;

  // Hermes does not support lexical scope in `eval`, so bundles built with
  // rspack's `devtool: 'eval'` (the development-mode default) fail at runtime
  // with "Property 'exports' doesn't exist". Always opt out of eval devtool.
  const devtool = mode === 'production' ? false : 'source-map';

  const miniappName = process.env.MINIAPP;
  const isMiniApp = Boolean(miniappName && MINI_APPS[miniappName]);
  const activeMiniApp = isMiniApp ? MINI_APPS[miniappName] : null;

  const chunksDir = path.join(__dirname, 'dist', 'chunks');
  if (!isMiniApp) {
    ensureChunkServer(chunksDir);
  }

  const outputPath = isMiniApp
    ? path.join(__dirname, 'dist', 'chunks', miniappName, platform)
    : path.join(__dirname, 'build', platform);

  const resolveOptions = Repack.getResolveOptions(platform);

  return {
    context,
    mode,
    devtool,
    entry: isMiniApp ? { [miniappName]: CONTAINER_ENTRY } : entry,
    output: {
      clean: true,
      path: outputPath,
      uniqueName: isMiniApp ? miniappName : 'experimental_host',
      filename: isMiniApp ? `${miniappName}.container.bundle` : 'index.bundle',
      chunkFilename: '[name].chunk.bundle',
      assetModuleFilename: 'assets/[name][ext]',
    },
    resolve: {
      ...resolveOptions,
      alias: {
        ...resolveOptions.alias,
        ...(isMiniApp ? { [INIT_SCRIPT_MANAGER]: EMPTY_MODULE } : {}),
      },
      exportsFields: [],
    },
    module: {
      rules: [
        ...Repack.getJsTransformRules(),
        ...Repack.getAssetTransformRules(),
      ],
    },
    plugins: [
      new Repack.RepackPlugin({
        platform,
        initializeCore: isMiniApp ? EMPTY_MODULE : undefined,
      }),
      new Repack.plugins.ModuleFederationPluginV1({
        name: isMiniApp ? activeMiniApp.name : 'experimental_host',
        filename: isMiniApp
          ? `${activeMiniApp.name}.container.bundle`
          : undefined,
        exposes: isMiniApp ? activeMiniApp.exposes : undefined,
        shared: isMiniApp ? CONTAINER_SHARED : HOST_SHARED,
      }),
    ],
  };
});
