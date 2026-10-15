import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, StatusBar, Animated,
  TouchableOpacity, Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


/**
 * Screen 1 – Splash Screen
 * Dark navy, animated M logo, city silhouette, white car, location pin.
 * Has a clear "Get Started" button — user must tap it to proceed.
 * No auto-advance.
 */
export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoOpac  = useRef(new Animated.Value(0)).current;
  const textOpac  = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(20)).current;
  const carOpac   = useRef(new Animated.Value(0)).current;
  const carSlide  = useRef(new Animated.Value(40)).current;
  const btnOpac   = useRef(new Animated.Value(0)).current;
  const btnSlide  = useRef(new Animated.Value(30)).current;

  const handleContinue = () => {
    router.replace('/(auth)/onboarding');
  };

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 7 }),
        Animated.timing(logoOpac, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(textOpac,  { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(textSlide, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(carOpac,  { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(carSlide, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(btnOpac,  { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.timing(btnSlide, { toValue: 0, duration: 450, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const BLDG_H = [52, 66, 38, 74, 58, 34, 62, 82, 46, 70, 54, 78];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1628" translucent />
      <View style={styles.bgGlow1} />
      <View style={styles.bgGlow2} />

      {/* Logo + Brand */}
      <View style={styles.centerWrap}>
        <Animated.View style={{ opacity: logoOpac, transform: [{ scale: logoScale }], alignItems: 'center' }}>
          <View style={styles.logoGlow} />
          <Image
            source={require('../../../assets/images/magic-ride-logo.png')}
            style={styles.splashLogo}
            resizeMode="cover"
          />
        </Animated.View>
        <Animated.View style={{ opacity: textOpac, transform: [{ translateY: textSlide }], alignItems: 'center', marginTop: 22 }}>
          <Text style={styles.brand}>Magic Ride</Text>
          <Text style={styles.tagline}>Cars & Bikes Across Nepal</Text>
        </Animated.View>
      </View>

      {/* Bottom: city + car + pin */}
      <Animated.View style={[styles.bottomScene, { opacity: carOpac, transform: [{ translateY: carSlide }] }]}>
        {/* Location pin */}
        <View style={styles.pinWrap}>
          <View style={styles.pinCircle}>
            <Ionicons name="location" size={15} color="#FFFFFF" />
          </View>
          <View style={styles.pinTail} />
        </View>

        {/* City silhouette */}
        <View style={styles.cityRow}>
          {BLDG_H.map((bh, i) => (
            <View key={i} style={[styles.bldg, { height: bh, width: 12 + (i % 5) * 3, marginLeft: i === 0 ? 0 : 3 }]} />
          ))}
        </View>

        {/* Road */}
        <View style={styles.road}>
          <View style={styles.roadLine} />
        </View>

        {/* Car */}
        <View style={styles.carScene}>
          <View style={styles.carRoof}>
            <View style={styles.windowFront} />
            <View style={styles.windowBack} />
          </View>
          <View style={styles.carBody}>
            <View style={styles.headlight} />
            <View style={styles.taillight} />
          </View>
          <View style={styles.wheelsRow}>
            <View style={styles.wheel} />
            <View style={styles.wheel} />
          </View>
        </View>
      </Animated.View>

      {/* ── GET STARTED BUTTON ─ always visible, no auto-advance ── */}
      <Animated.View
        style={[
          styles.bottomBtnArea,
          {
            paddingBottom: Math.max(32, insets.bottom + 20),
            opacity: btnOpac,
            transform: [{ translateY: btnSlide }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.getStartedBtn}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>

        <Text style={styles.tagText}>🇳🇵 Ride across Nepal</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1, backgroundColor: '#0A1628', alignItems: 'center' },
  bgGlow1:     { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(37,99,235,0.14)', top: -70, right: -70 },
  bgGlow2:     { position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: 'rgba(99,102,241,0.09)', bottom: 110, left: -70 },

  centerWrap:  { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 40 },
  logoGlow:    { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(59,130,246,0.35)' },
  splashLogo:  { width: 104, height: 104, borderRadius: 28, borderWidth: 2, borderColor: '#3B82F6', shadowColor: '#2563EB', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 18 },
  brand:       { fontSize: 32, fontWeight: '800', color: '#FFFFFF', textAlign: 'center', letterSpacing: 0.3, marginBottom: 8 },
  tagline:     { fontSize: 14, color: 'rgba(255,255,255,0.65)', textAlign: 'center', letterSpacing: 0.5 },

  bottomScene:   { width: '100%', alignItems: 'center', position: 'relative', paddingTop: 10 },
  pinWrap:     { position: 'absolute', top: -8, right: '28%', alignItems: 'center', zIndex: 10 },
  pinCircle:   { width: 32, height: 32, borderRadius: 16, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center', shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 5 },
  pinTail:     { width: 3, height: 8, backgroundColor: '#3B82F6', borderBottomLeftRadius: 2, borderBottomRightRadius: 2 },
  cityRow:     { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 10, opacity: 0.45 },
  bldg:        { backgroundColor: '#1E40AF', borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  road:        { width: '100%', height: 12, backgroundColor: 'rgba(255,255,255,0.10)' },
  roadLine:    { position: 'absolute', top: 5, left: 0, right: 0, height: 2, backgroundColor: 'rgba(255,255,255,0.22)' },
  carScene:    { alignItems: 'center', marginTop: 12 },
  carRoof:     { width: 108, height: 38, backgroundColor: '#E8F0FE', borderTopLeftRadius: 20, borderTopRightRadius: 20, marginBottom: -4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 8, paddingTop: 8 },
  windowFront: { width: 36, height: 22, backgroundColor: 'rgba(147,197,253,0.45)', borderRadius: 5 },
  windowBack:  { width: 36, height: 22, backgroundColor: 'rgba(147,197,253,0.45)', borderRadius: 5 },
  carBody:     { width: 160, height: 52, backgroundColor: '#FFFFFF', borderRadius: 10, position: 'relative', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.22, shadowRadius: 10, elevation: 6 },
  headlight:   { position: 'absolute', right: 8, top: 18, width: 14, height: 9, borderRadius: 4, backgroundColor: '#FCD34D' },
  taillight:   { position: 'absolute', left: 8, top: 18, width: 10, height: 9, borderRadius: 3, backgroundColor: '#FCA5A5' },
  wheelsRow:   { flexDirection: 'row', justifyContent: 'space-between', width: 136, marginTop: -8 },
  wheel:       { width: 28, height: 28, borderRadius: 14, backgroundColor: '#1E293B', borderWidth: 5, borderColor: '#475569' },

  // ── Bottom CTA Area ──
  bottomBtnArea: {
    width: '100%',
    paddingHorizontal: 28,
    paddingTop: 24,
    alignItems: 'center',
  },
  getStartedBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 17,
    borderRadius: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 14,
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  tagText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
