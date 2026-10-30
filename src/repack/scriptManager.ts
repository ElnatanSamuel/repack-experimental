import { ScriptManager } from '@callstack/repack/client';
import { Platform } from 'react-native';

/**
 * Returns chunk server base URL for development & production OTA.
 * Android emulator routes to host Mac via 10.0.2.2.
 */
export const getChunkBaseUrl = (): string => {
  return Platform.OS === 'android'
    ? 'http://10.0.2.2:8088'
    : 'http://localhost:8088';
};

/**
 * Initializes Re.Pack ScriptManager resolver for remote containers and secondary chunks.
 */
export const initScriptManager = (): void => {
  ScriptManager.shared.addResolver(async (scriptId, caller) => {
    const baseUrl = getChunkBaseUrl();

    // Caller undefined -> Resolving remote container root
    if (!caller) {
      const url = `${baseUrl}/${scriptId}/${Platform.OS}/${scriptId}.container.bundle`;
      console.log(`[ScriptManager] Resolving container [${scriptId}] from: ${url}`);
      return {
        url,
        cache: true,
        retry: 2,
        retryDelay: 1000,
        query: { v: Date.now().toString() },
      };
    }

    // Caller defined -> Resolving secondary chunk for that container
    const url = `${baseUrl}/${caller}/${Platform.OS}/${scriptId}.chunk.bundle`;
    console.log(`[ScriptManager] Resolving chunk [${scriptId}] for [${caller}] from: ${url}`);
    return {
      url,
      cache: true,
      retry: 2,
      retryDelay: 1000,
      query: { v: Date.now().toString() },
    };
  });

  console.log('[ScriptManager] Initialized with Base URL:', getChunkBaseUrl());
};
