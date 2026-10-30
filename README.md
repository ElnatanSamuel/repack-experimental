# CBE Micro-Frontend SuperApp (Re.Pack 5 + Module Federation)

Dynamic Native Micro-Frontend SuperApp built with **React Native 0.80.3**, **Re.Pack 5.4.2**, **Rspack 1.7.12**, and **Hermes**.

Feature services are compiled as independent remote containers, hosted locally on port `8088`, and dynamically loaded over-the-air (OTA) on-demand into the Host Shell.

---

## Quick Start: How to Run the App

You only need two commands in two terminal windows:

### Terminal 1: Start the Development & Chunk Servers
```bash
npm start
```
> **What this does automatically:**
> 1. Runs `prestart` to compile all remote mini-apps into `dist/chunks/`.
> 2. Starts the Re.Pack Host DevServer on **port 8081** (`index.bundle`).
> 3. Spawns the embedded static Chunk Server on **port 8088** (`dist/chunks/`).

### Terminal 2: Launch the Android App
```bash
npm run android
```

---

## How to Add a New Mini-App Service

Adding a new service requires **3 steps**:

### Step 1: Create your Service Component
Create your screen component under `src/services/<serviceName>/<ScreenName>.tsx`:

```tsx
// src/services/loyaltyService/LoyaltyScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

export default function LoyaltyScreen({ onBack }: { onBack?: () => void }) {
  return (
    <SafeAreaView style={styles.container}>
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title}>CBE Loyalty Rewards</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFFFFF' },
  backButton: { minHeight: 44, justifyContent: 'center', marginBottom: 12 },
  backText: { color: '#800080', fontSize: 16, fontWeight: '700' },
  title: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
});
```

---

### Step 2: Register Container in `rspack.config.mjs`
Add your service as a **top-level key** in `export const MINI_APPS` inside `rspack.config.mjs`:

```javascript
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
      './PaymentQuickPayScreen': './src/services/paymentService/PaymentQuickPayScreen.tsx',
    },
  },
  // ADD YOUR NEW SERVICE HERE (top-level key, valid JS identifier with underscores):
  loyalty_service: {
    name: 'loyalty_service',
    exposes: {
      './LoyaltyScreen': './src/services/loyaltyService/LoyaltyScreen.tsx',
    },
  },
};
```

> [!CAUTION]
> - **Top-Level Only**: Do not accidentally nest your service inside another service object.
> - **Naming**: Use underscores (`loyalty_service`), never hyphens (`loyalty-service`), because Module Federation attaches containers to global JavaScript identifiers (`self.<name>`).

---

### Step 3: Wire into the Host Dashboard (`src/screens/HomeScreen.tsx`)

1. **Import with `createFederatedScreen`**:
   ```typescript
   const RemoteLoyaltyScreen = createFederatedScreen(
     () => Federated.importModule('loyalty_service', './LoyaltyScreen'),
     'CBE Loyalty Rewards',
   );
   ```

2. **Add to `ActiveView` union**:
   ```typescript
   type ActiveView = 'home' | 'news' | 'payment' | 'loyalty';
   ```

3. **Add View Switch Condition**:
   ```typescript
   if (activeView === 'loyalty') {
     return <RemoteLoyaltyScreen onBack={() => setActiveView('home')} />;
   }
   ```

4. **Add UI Card in ScrollView**:
   ```tsx
   <TouchableOpacity
     style={styles.serviceCard}
     onPress={() => setActiveView('loyalty')}
     accessibilityRole="button"
     accessibilityLabel="Launch Loyalty Rewards"
   >
     <View style={styles.cardHeader}>
       <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
         <Text style={styles.cardIcon}>🎁</Text>
       </View>
       <View style={styles.cardTag}>
         <Text style={styles.cardTagText}>CONTAINER 3</Text>
       </View>
     </View>
     <Text style={styles.cardTitle}>Loyalty Rewards</Text>
     <Text style={styles.cardDescription}>
       Remote container `loyalty_service` handling customer points and cashback.
     </Text>
     <View style={styles.cardFooter}>
       <Text style={styles.launchText}>Launch Mini-App →</Text>
     </View>
   </TouchableOpacity>
   ```

5. **Restart or reload**:
   ```bash
   npm start
   ```

---

## How to Remove an Existing Service

1. **Remove from UI (`src/screens/HomeScreen.tsx`)**:
   - Delete the `RemoteScreen` declaration.
   - Delete its condition `if (activeView === '...')`.
   - Delete the `<TouchableOpacity>` card from the JSX.
2. **Unregister in `rspack.config.mjs`**:
   - Remove the service entry from `export const MINI_APPS`.
3. **Delete Source & Chunks**:
   - Delete the directory `src/services/<serviceName>/`.
   - Delete the output artifacts: `rm -rf dist/chunks/<serviceName>/`.
4. **Re-run**:
   ```bash
   npm start
   ```

---

## Project Structure & Architecture

```
├── rspack.config.mjs             # Unified Rspack & Module Federation configuration
├── tools/build-miniapps.js       # Dynamic multi-container compiler
├── dist/chunks/                  # Output for compiled remote containers
│   ├── news_service/android/
│   ├── payment_service/android/
│   └── test_service/android/
├── src/
│   ├── repack/
│   │   ├── containerEntry.ts     # Inert empty container entry point
│   │   └── scriptManager.ts      # Chunk locator & resolver with retries
│   ├── components/
│   │   ├── FederatedScreen.tsx   # React.Suspense + ScreenErrorBoundary wrapper
│   │   └── SkeletonLoader.tsx    # Native skeleton shimmer fallback
│   ├── screens/
│   │   └── HomeScreen.tsx        # Host dashboard with mini-app cards
│   └── services/                 # Remote mini-app source code
```

---

## Architectural Rules & Enforcements

1. **Hermes `eval` Opt-Out**: `devtool` is strictly set to `source-map` (dev) or `false` (prod). Hermes does not support lexical scoping in eval-wrapped bundles.
2. **Inert Container Startup**: Containers point `entry` and `RepackPlugin.initializeCore` to an empty module (`containerEntry.ts`). They do not boot a second React Native runtime inside the host.
3. **Singleton Negotiation**: Containers use `eager: false, import: false` for React and React Native singletons. The host provides the single runtime instance, eliminating share-scope conflicts and shrinking containers from ~5 MB to ~65 KB.
