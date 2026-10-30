import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

export default function TestServiceScreen({ onBack }: { onBack?: () => void }) {
  const [count, setCount] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        {onBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.navTitle}>Test Service</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dynamic Module Loaded</Text>
          <Text style={styles.cardBody}>
            This screen is compiled independently and loaded over-the-air into the host application.
          </Text>
          <View style={styles.counterBox}>
            <Text style={styles.counterText}>Interactive State Count: {count}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setCount((c) => c + 1)}
              accessibilityRole="button"
              accessibilityLabel="Increment count"
            >
              <Text style={styles.buttonText}>+ Increment Counter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  content: {
    padding: 24,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardBody: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  counterBox: {
    marginTop: 8,
    gap: 10,
  },
  counterText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  button: {
    minHeight: 46,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
