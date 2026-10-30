import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { Federated } from '@callstack/repack/client';
import { createFederatedScreen } from '../components/FederatedScreen';

const RemoteNewsScreen = createFederatedScreen(
  () => Federated.importModule('news_service', './NewsFeedScreen'),
  'News',
);

const RemotePaymentScreen = createFederatedScreen(
  () => Federated.importModule('payment_service', './PaymentQuickPayScreen'),
  'Quick Pay',
);

const RemoteTestScreen = createFederatedScreen(
  () => Federated.importModule('test_service', './TestService'),
  'Test Service',
);

type ActiveView = 'home' | 'news' | 'payment' | 'test';

export default function HomeScreen() {
  const [activeView, setActiveView] = useState<ActiveView>('home');

  if (activeView === 'news') {
    return <RemoteNewsScreen onBack={() => setActiveView('home')} />;
  }

  if (activeView === 'payment') {
    return <RemotePaymentScreen onBack={() => setActiveView('home')} />;
  }

  if (activeView === 'test') {
    return <RemoteTestScreen onBack={() => setActiveView('home')} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Mini Apps</Text>
          <Text style={styles.subtitle}>
            Modular services loaded on-demand
          </Text>
        </View>

        {/* News Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => setActiveView('news')}
          accessibilityRole="button"
          accessibilityLabel="Open News"
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>News</Text>
            <Text style={styles.cardDescription}>
              Read the latest stories, updates, and articles.
            </Text>
          </View>
          <Text style={styles.chevron}>→</Text>
        </TouchableOpacity>

        {/* Payments Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => setActiveView('payment')}
          accessibilityRole="button"
          accessibilityLabel="Open Payments"
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Quick Pay</Text>
            <Text style={styles.cardDescription}>
              Instant transfers, balance check, and payments.
            </Text>
          </View>
          <Text style={styles.chevron}>→</Text>
        </TouchableOpacity>

        {/* Test Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => setActiveView('test')}
          accessibilityRole="button"
          accessibilityLabel="Open Test Service"
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Test Service</Text>
            <Text style={styles.cardDescription}>
              Independent dynamic module demonstration.
            </Text>
          </View>
          <Text style={styles.chevron}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0,
  },
  content: {
    padding: 24,
    gap: 16,
  },
  header: {
    paddingVertical: 16,
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 80,
  },
  cardContent: {
    flex: 1,
    gap: 4,
    paddingRight: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  chevron: {
    fontSize: 18,
    fontWeight: '600',
    color: '#94A3B8',
  },
});
