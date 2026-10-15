import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, StatusBar, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import type { UserRole } from '../../types';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const BLUE = '#2563EB';

export default function RoleScreen() {
  const { setRole, setDemoMode } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>('rider');

  const handleContinue = () => {
    setRole(selectedRole);
    setDemoMode('solo');
    router.push('/(auth)/phone');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Top bar with back button & Brand logo ── */}
      <View style={[styles.topBar, { justifyContent: 'space-between' }]}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(auth)/onboarding')}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={22} color="#1A1A2E" />
        </Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <Image
            source={require('../../../assets/images/magic-ride-logo.png')}
            style={{ width: 28, height: 28, borderRadius: 8 }}
            resizeMode="cover"
          />
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1A1A2E' }}>Magic Ride</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* ── Main Content ── */}
      <View style={styles.content}>
        <Text style={styles.heading}>Create your account</Text>
        <Text style={styles.sub}>Are you a rider or a driver?</Text>

        {/* ── Rider Card ── */}
        <Pressable
          style={[styles.card, selectedRole === 'rider' && styles.cardSelected]}
          onPress={() => setSelectedRole('rider')}
        >
          <View style={[styles.cardIcon, { backgroundColor: selectedRole === 'rider' ? '#DBEAFE' : '#EFF6FF' }]}>
            <Ionicons name="person" size={26} color={BLUE} />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Rider / Passenger</Text>
            <Text style={styles.cardSub}>Find a ride and reach your destination</Text>
          </View>
          <View style={[styles.radioCircle, selectedRole === 'rider' && styles.radioCircleSelected]}>
            {selectedRole === 'rider' && <View style={styles.radioDot} />}
          </View>
        </Pressable>

        {/* ── Driver Card ── */}
        <Pressable
          style={[styles.card, selectedRole === 'driver' && styles.cardSelected]}
          onPress={() => setSelectedRole('driver')}
        >
          <View style={[styles.cardIcon, { backgroundColor: selectedRole === 'driver' ? '#DCFCE7' : '#F0FDF4' }]}>
            <MaterialCommunityIcons name="car" size={28} color="#16A34A" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Driver</Text>
            <Text style={styles.cardSub}>Drive, accept rides and earn in Nepal</Text>
          </View>
          <View style={[styles.radioCircle, selectedRole === 'driver' && styles.radioCircleSelected]}>
            {selectedRole === 'driver' && <View style={styles.radioDot} />}
          </View>
        </Pressable>
      </View>

      {/* ── FIXED BOTTOM ACTION BAR ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>
            Continue as {selectedRole === 'driver' ? 'Driver' : 'Rider'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginHint}>Already have an account? </Text>
          <Pressable onPress={() => router.push('/(auth)/phone')} hitSlop={8}>
            <Text style={styles.loginLink}>Log in</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // ── Compact top bar (no extra gap) ──
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 4,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Content fills remaining space ──
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  heading: {
    fontSize: 27,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  sub: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 28,
    lineHeight: 21,
  },

  // ── Cards ──
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  cardSelected: {
    borderColor: BLUE,
    backgroundColor: '#EFF6FF',
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  cardIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 3,
  },
  cardSub: {
    fontSize: 12.5,
    color: '#6B7280',
    lineHeight: 17,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: BLUE,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: BLUE,
  },

  // ── Bottom bar with Continue button ──
  bottomBar: {
    paddingHorizontal: 24,
    paddingTop: 14,
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
    marginBottom: 14,
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
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginHint: {
    fontSize: 13,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 13,
    color: BLUE,
    fontWeight: '700',
  },
});
