import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable,
  StyleSheet, StatusBar, KeyboardAvoidingView, Platform,
  ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { sendOtp } from '../../services/mockService';

const BLUE = '#2563EB';

/**
 * Screen 4 – Phone Verification (Enter Number Page)
 * Button is anchored OUTSIDE ScrollView so it is always visible.
 */
export default function PhoneScreen() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Nepal mobile number validation
  // Valid prefixes: 98x, 97x, 96x (Ncell/NTC/Smart)
  const VALID_PREFIXES = ['980','981','982','984','985','986','972','974','975','961','962','963'];
  const digits = phone.replace(/\D/g, '');
  const isValidLength = digits.length === 10;
  const isValidPrefix = VALID_PREFIXES.some((p) => digits.startsWith(p));
  const isValid = isValidLength && isValidPrefix;
  const showLengthHint = digits.length > 0 && digits.length < 10;

  const handleSend = async () => {
    if (!isValidLength) {
      setError('Number must be exactly 10 digits (e.g. 98XXXXXXXX)');
      return;
    }
    if (!isValidPrefix) {
      setError('Enter a valid Nepal mobile number (98x, 97x, 96x...)');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await sendOtp(phone);
      router.push({ pathname: '/(auth)/otp', params: { phone } });
    } catch {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Back button */}
      <View style={styles.topBar}>
        <Pressable
          style={styles.back}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(auth)/role'))}
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={22} color="#1A1A2E" />
        </Pressable>
      </View>

      {/* Scrollable content (heading + input) */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading}>Enter your mobile number</Text>
          <Text style={styles.sub}>We'll send you a 6-digit verification code.</Text>

          {/* Phone input row */}
          <View style={[
            styles.inputRow,
            error ? styles.inputErr : {},
            isValid ? styles.inputOk : {},
          ]}>
            <View style={styles.countryPicker}>
              <Text style={styles.flag}>🇳🇵</Text>
              <Text style={styles.code}>+977</Text>
            </View>
            <View style={styles.divider} />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={(t) => {
                // Allow digits only
                const cleaned = t.replace(/\D/g, '');
                setPhone(cleaned);
                if (error) setError('');
              }}
              placeholder="98XXXXXXXX"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              maxLength={10}
            />
            {/* Live feedback icon */}
            {isValid && (
              <Ionicons name="checkmark-circle" size={22} color="#22C55E" style={{ marginLeft: 6 }} />
            )}
            {!!error && (
              <Ionicons name="close-circle" size={22} color="#EF4444" style={{ marginLeft: 6 }} />
            )}
          </View>

          {/* Live digit counter hint */}
          {showLengthHint && (
            <Text style={styles.lengthHint}>{digits.length}/10 digits entered</Text>
          )}
          {/* Invalid prefix warning (shown once 3+ digits typed) */}
          {digits.length >= 3 && !isValidPrefix && !error && (
            <View style={styles.warnBox}>
              <Ionicons name="information-circle" size={15} color="#D97706" style={{ marginRight: 6 }} />
              <Text style={styles.warnText}>Nepal numbers start with 98x, 97x or 96x</Text>
            </View>
          )}

          {/* Error banner */}
          {!!error && (
            <View style={styles.errBox}>
              <Ionicons name="alert-circle" size={16} color="#DC2626" style={{ marginRight: 6 }} />
              <Text style={styles.errText}>{error}</Text>
            </View>
          )}

          {/* Demo quick fill */}
          <Pressable
            style={styles.demoFill}
            onPress={() => { setPhone('9812345678'); setError(''); }}
            hitSlop={6}
          >
            <Ionicons name="flash" size={14} color={BLUE} style={{ marginRight: 6 }} />
            <Text style={styles.demoFillText}>Quick Fill: 9812345678</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── FIXED BOTTOM BUTTON — always visible, outside ScrollView ── */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          onPress={handleSend}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <Text style={styles.submitText}>Sending...</Text>
          ) : (
            <>
              <Text style={styles.submitText}>Send OTP</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.hint}>
          By continuing, you agree to receive SMS codes for verification.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 4,
  },
  back: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Scrollable area
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  heading: {
    fontSize: 27,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  sub: {
    fontSize: 14.5,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 20,
  },

  lengthHint: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    marginLeft: 4,
  },
  warnBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warnText: {
    color: '#92400E',
    fontSize: 12.5,
    fontWeight: '600',
    flex: 1,
  },

  // Input
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  inputErr: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inputOk: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 10,
  },
  flag: {
    fontSize: 22,
  },
  code: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#1A1A2E',
    fontWeight: '600',
  },

  // Error
  errBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },

  // Demo fill
  demoFill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  demoFillText: {
    color: BLUE,
    fontSize: 12.5,
    fontWeight: '700',
  },

  // Fixed bottom button
  bottomArea: {
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  submitBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BLUE,
    paddingVertical: 17,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 6,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  hint: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
  },
});
