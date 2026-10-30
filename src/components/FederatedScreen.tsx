import React, { Component, Suspense, ErrorInfo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SkeletonLoader from './SkeletonLoader';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: (retry: () => void) => React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  key?: React.Key;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage?: string;
}

class ScreenErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[FederatedScreen] Failed to load remote chunk:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, errorMessage: undefined });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback(this.retry);
    }
    return this.props.children;
  }
}

export function createFederatedScreen(
  factory: () => Promise<any>,
  screenName: string,
): React.ComponentType<any> {
  const LazyComponent = React.lazy(factory);

  return function FederatedScreenWrapper(props: any) {
    const [retryCount, setRetryCount] = React.useState(0);

    return (
      <ScreenErrorBoundary
        key={retryCount}
        fallback={(retry) => (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠</Text>
            <Text style={styles.errorTitle}>Failed to Load {screenName}</Text>
            <Text style={styles.errorSubtitle}>
              Check that the chunk server is running (`npm run serve:chunks`) and reachable.
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setRetryCount((c) => c + 1);
                retry();
              }}
              accessibilityRole="button"
              accessibilityLabel="Retry loading screen"
            >
              <Text style={styles.retryButtonText}>Retry Loading</Text>
            </TouchableOpacity>
            {props.onBack && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={props.onBack}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Text style={styles.backButtonText}>Return to Home</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      >
        <Suspense fallback={<SkeletonLoader title={`Loading ${screenName}...`} />}>
          <LazyComponent {...props} />
        </Suspense>
      </ScreenErrorBoundary>
    );
  };
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F8FAFC',
    gap: 12,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  retryButton: {
    minHeight: 48,
    minWidth: 160,
    backgroundColor: '#800080',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  backButton: {
    minHeight: 44,
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
});
