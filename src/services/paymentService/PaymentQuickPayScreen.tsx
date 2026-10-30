import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
  StatusBar,
  BackHandler,
} from 'react-native';

const AMOUNTS = [25, 50, 100, 250];

export default function PaymentQuickPayScreen({ onBack }: { onBack?: () => void }) {
  const [balance, setBalance] = useState<number>(1250.0);
  const [selectedAmount, setSelectedAmount] = useState<number>(50);

  useEffect(() => {
    if (!onBack) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => sub.remove();
  }, [onBack]);

  const handlePay = () => {
    if (balance < selectedAmount) {
      Alert.alert('Error', 'Insufficient balance.');
      return;
    }
    setBalance((prev) => prev - selectedAmount);
    Alert.alert('Payment Sent', `$${selectedAmount.toFixed(2)} transfer completed.`);
  };

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
        <Text style={styles.navTitle}>Quick Pay</Text>
      </View>

      <View style={styles.content}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
        </View>

        {/* Amount Selector */}
        <Text style={styles.sectionTitle}>Choose Amount</Text>
        <View style={styles.amountGrid}>
          {AMOUNTS.map((amt) => {
            const isSelected = selectedAmount === amt;
            return (
              <TouchableOpacity
                key={amt}
                style={[styles.amountButton, isSelected && styles.amountButtonSelected]}
                onPress={() => setSelectedAmount(amt)}
                accessibilityRole="button"
                accessibilityLabel={`Select $${amt}`}
              >
                <Text
                  style={[
                    styles.amountText,
                    isSelected && styles.amountTextSelected,
                  ]}
                >
                  ${amt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Pay Action */}
        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePay}
          accessibilityRole="button"
          accessibilityLabel={`Pay $${selectedAmount}`}
        >
          <Text style={styles.payButtonText}>Pay ${selectedAmount}</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    padding: 24,
    gap: 20,
  },
  balanceCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 24,
    gap: 6,
  },
  balanceLabel: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  amountGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  amountButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountButtonSelected: {
    borderColor: '#0F172A',
    backgroundColor: '#0F172A',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  amountTextSelected: {
    color: '#FFFFFF',
  },
  payButton: {
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
