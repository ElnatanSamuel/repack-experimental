/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { initScriptManager } from './src/repack/scriptManager';

// Initialize Re.Pack Module Federation chunk resolver
initScriptManager();

AppRegistry.registerComponent(appName, () => App);
