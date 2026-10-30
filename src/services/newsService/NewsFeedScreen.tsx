import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar,
  BackHandler,
} from 'react-native';

interface Article {
  id: string;
  category: string;
  title: string;
  summary: string;
  readTime: string;
}

const ARTICLES: Article[] = [
  {
    id: '1',
    category: 'Technology',
    title: 'Modern Architecture in Mobile Engineering',
    summary: 'How decoupled modules and dynamic loading reduce application footprint and speed up release cycles.',
    readTime: '3 min',
  },
  {
    id: '2',
    category: 'Product',
    title: 'Designing Accessible User Interfaces',
    summary: 'Best practices for touch targets, contrast ratios, and screen reader navigation on mobile devices.',
    readTime: '4 min',
  },
  {
    id: '3',
    category: 'Engineering',
    title: 'Performance Optimizations with Hermes Engine',
    summary: 'Bytecode pre-compilation, memory layout, and runtime garbage collection in modern React Native.',
    readTime: '5 min',
  },
];

export default function NewsFeedScreen({ onBack }: { onBack?: () => void }) {
  const [articles] = useState<Article[]>(ARTICLES);

  useEffect(() => {
    if (!onBack) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => sub.remove();
  }, [onBack]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        {onBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.navTitle}>News</Text>
      </View>

      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.metaRow}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.readTime}>{item.readTime}</Text>
            </View>
            <Text style={styles.articleTitle}>{item.title}</Text>
            <Text style={styles.articleSummary}>{item.summary}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0,
  },
  navBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  list: {
    padding: 20,
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  readTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 22,
  },
  articleSummary: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
  },
});
