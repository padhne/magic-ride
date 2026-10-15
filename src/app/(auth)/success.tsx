import React from 'react';
import {
  View, Text, StyleSheet, StatusBar, TouchableOpacity, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';

const GREEN = '#22C55E';
const BLUE  = '#2563EB';

/**
 * Screen 6 – Account Created / Registration Complete
 * "Continue to Home" button is anchored at the bottom — always visible.
 */
export default function SuccessScreen() {
  const { role } = useAuthStore();
  const targetHome = role === 'driver' ? '/(driver)/home' : '/(rider)/home';

  const handleContinue = () => router.replace(targetHome as any);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Centered success illustration ── */}
      <View style={styles.centerContent}>
        {/* Sparkle dots */}
        <View style={[styles.spark, { top: '20%', right: '25%', backgroundColor: '#6EE7B7' }]} />
        <View style={[styles.spark, { top: '22%', right: '18%', width: 10, height: 10, backgroundColor: '#60A5FA' }]} />
        <View style={[styles.spark, { bottom: '28%', left: '22%', backgroundColor: '#FCD34D' }]} />

        {/* Green check circle */}
        <View style={styles.checkGlow}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={52} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.heading}>Account Created!</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 6 }}>
          <Image
            source={require('../../../assets/images/magic-ride-logo.png')}
            style={{ width: 22, height: 22, borderRadius: 6 }}
            resizeMode="cover"
          />
          <Text style={styles.sub}>Welcome to Magic Ride</Text>
        </View>
        <Text style={styles.caption}>Your account is ready.{'\n'}Let's get you moving!</Text>
      </View>

      {/* ── FIXED BOTTOM BUTTON — always visible ── */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>Continue to Home</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>

        <Text style={styles.hint}>
          Riding as <Text style={{ fontWeight: '700', color: BLUE }}>
            {role === 'driver' ? 'Driver' : 'Rider'}
          </Text>
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

  // Centered area fills all space above bottom bar
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    position: 'relative',
  },
  spark: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  // Check circle
  checkGlow: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(34,197,94,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.40,
    shadowRadius: 18,
    elevation: 10,
  },

  heading: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  sub: {
    fontSize: 17,
    fontWeight: '700',
    color: BLUE,
    textAlign: 'center',
    marginBottom: 10,
  },
  caption: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Fixed bottom area
  bottomArea: {
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 14,
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
