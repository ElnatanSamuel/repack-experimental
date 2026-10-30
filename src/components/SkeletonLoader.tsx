import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface SkeletonLoaderProps {
  title?: string;
}

export default function SkeletonLoader({ title = 'Loading Micro-Frontend...' }: SkeletonLoaderProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#800080" />
      <Text style={styles.loadingText}>{title}</Text>
      <Text style={styles.subText}>Streaming chunk over-the-air from local server...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F8FAFC',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 12,
  },
  subText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
});
