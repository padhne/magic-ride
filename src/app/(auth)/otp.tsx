import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  StatusBar, KeyboardAvoidingView, Platform,
  ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { verifyOtp } from '../../services/mockService';
import { useAuthStore } from '../../store/authStore';

const BLUE = '#2563EB';

/**
 * Screen 5 – OTP Verification
 * 6 digit boxes + resend countdown.
 * Continue button is OUTSIDE ScrollView — always visible at bottom.
 */
export default function OtpScreen() {
  const { phone } = useLocalSearchParams<{ phone?: string }>();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const refs = useRef<(TextInput | null)[]>([]);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const getCode = () => digits.join('');
  const isComplete = getCode().length === 6;

  const handleVerify = async () => {
    const code = getCode();
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await verifyOtp(phone || '+977 9812345678', '1234');
      setUser(res.user);
      router.replace('/(auth)/profile-setup');
    } catch (err: any) {
      setError(err?.message || 'Invalid code. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (text: string, index: number) => {
    const val = text.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = val;
    setDigits(next);
    setError('');
    if (val && index < 5) refs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const autoFill = () => {
    setDigits('123456'.split(''));
    setError('');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Scrollable content */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back button */}
          <Pressable
            style={styles.back}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/(auth)/phone'))}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={22} color="#1A1A2E" />
          </Pressable>

          <Text style={styles.heading}>Verify your number</Text>
          <Text style={styles.sub}>
            Enter the 6-digit code sent to{'\n'}
            <Text style={styles.phoneText}>{phone || '+977 98XXXXXXXX'}</Text>
          </Text>

          {/* 6 OTP boxes */}
          <View style={styles.boxRow}>
            {digits.map((d, i) => (
              <TextInput
                key={i}
                ref={(r) => { refs.current[i] = r; }}
                style={[
                  styles.box,
                  d ? styles.boxFilled : {},
                  error ? styles.boxErr : {},
                ]}
                value={d}
                onChangeText={(t) => handleChange(t, i)}
                onKeyPress={(e) => handleKeyPress(e, i)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                selectionColor={BLUE}
                autoFocus={i === 0}
              />
            ))}
          </View>

          {/* Error */}
          {!!error && (
            <View style={styles.errBox}>
              <Ionicons name="alert-circle" size={16} color="#DC2626" style={{ marginRight: 6 }} />
              <Text style={styles.errText}>{error}</Text>
            </View>
          )}

          {/* Auto-fill demo + Resend row */}
          <View style={styles.resendRow}>
            <Pressable style={styles.demoBtn} onPress={autoFill}>
              <Ionicons name="flash" size={13} color={BLUE} style={{ marginRight: 4 }} />
              <Text style={styles.demoBtnText}>Auto-fill (123456)</Text>
            </Pressable>
            <Pressable disabled={countdown > 0} onPress={() => setCountdown(30)}>
              <Text style={countdown > 0 ? styles.resendOff : styles.resendOn}>
                {countdown > 0 ? `Resend (${countdown}s)` : 'Resend'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── FIXED BOTTOM BUTTON — always visible ── */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={[styles.continueBtn, (!isComplete || loading) && styles.continueBtnDisabled]}
          onPress={handleVerify}
          disabled={!isComplete || loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <Text style={styles.continueBtnText}>Verifying...</Text>
          ) : (
            <>
              <Text style={styles.continueBtnText}>Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.hint}>
          Use code <Text style={{ fontWeight: '700', color: BLUE }}>123456</Text> for demo
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

  // Scroll area
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
  },
  back: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  sub: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 28,
    lineHeight: 22,
  },
  phoneText: {
    color: '#1A1A2E',
    fontWeight: '700',
  },

  // OTP boxes
  boxRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  box: {
    flex: 1,
    height: 60,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  boxFilled: {
    borderColor: BLUE,
    backgroundColor: '#EFF6FF',
  },
  boxErr: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
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

  // Resend row
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  demoBtnText: {
    color: BLUE,
    fontSize: 12,
    fontWeight: '700',
  },
  resendOff: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  resendOn: {
    fontSize: 13,
    color: BLUE,
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
  continueBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BLUE,
    paddingVertical: 17,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 6,
  },
  continueBtnDisabled: {
    backgroundColor: '#93C5FD',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  hint: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
  },
});
