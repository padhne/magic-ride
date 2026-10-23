import React, { useState, useEffect } from 'react';
import {
  View, Text, Pressable, ScrollView, Alert, StyleSheet, StatusBar, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MapSimulation } from '../../components/MapSimulation';
import { useDriverStore } from '../../store/driverStore';
import { useRideStore } from '../../store/rideStore';
import { useAuthStore } from '../../store/authStore';
import { MOCK_DRIVERS } from '../../mocks/users';
import { Button } from '../../components/ui/Button';
import { formatFare } from '../../utils/formatters';

const BLUE = '#2563EB';
const BLUE_LIGHT = '#EFF6FF';
const WHITE = '#FFFFFF';
const TEXT_PRIMARY = '#1A1A2E';
const TEXT_MUTED = '#6B7280';
const BORDER = '#E5E7EB';
const GREEN = '#22C55E';
const RED = '#EF4444';
const GRAY_BG = '#F5F7FA';

export default function DriverHome() {
  const { setRole } = useAuthStore();
  const {
    isOnline, setOnline,
    pendingRequest, setPendingRequest,
    activeRide, setActiveRide,
    todayEarnings, todayTrips, addEarnings,
  } = useDriverStore();

  const { status, transition, setAssignedDriver, reset: resetRide } = useRideStore();

  const [countdown, setCountdown] = useState(15);
  const [navStep, setNavStep] = useState<'to_pickup' | 'arrived' | 'to_dropoff' | 'finished'>('to_pickup');

  // Countdown for incoming request
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (pendingRequest && isOnline && !activeRide) {
      setCountdown(15);
      timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) { clearInterval(timer); setPendingRequest(null); return 0; }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [pendingRequest, isOnline, activeRide]);

  // Sync nav step with ride status
  useEffect(() => {
    if (status === 'accepted' || status === 'driver_arriving') setNavStep('to_pickup');
    else if (status === 'arrived') setNavStep('arrived');
    else if (status === 'in_progress') setNavStep('to_dropoff');
    else if (status === 'completed') setNavStep('finished');
  }, [status]);

  const handleAccept = () => {
    if (!pendingRequest) return;
    setActiveRide(pendingRequest);
    setPendingRequest(null);
    setAssignedDriver(MOCK_DRIVERS[0]);
    transition('accepted');
    setNavStep('to_pickup');
  };

  const handleDecline = () => setPendingRequest(null);

  const navButtonLabel = {
    to_pickup:  'Mark Arrived at Pickup →',
    arrived:    'Start Trip →',
    to_dropoff: 'Complete Trip →',
    finished:   'Done • Wait for Next Ride',
  }[navStep];

  const handleNavAction = () => {
    if (navStep === 'to_pickup') { transition('arrived'); setNavStep('arrived'); }
    else if (navStep === 'arrived') { transition('in_progress'); setNavStep('to_dropoff'); }
    else if (navStep === 'to_dropoff') { addEarnings(activeRide?.fare || 150); transition('completed'); setNavStep('finished'); }
    else { setActiveRide(null); resetRide(); setNavStep('to_pickup'); }
  };

  return (
    <View style={{ flex: 1, backgroundColor: GRAY_BG }}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: WHITE }}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image
              source={require('../../../assets/images/magic-ride-logo.png')}
              style={styles.logoMiniImg}
              resizeMode="cover"
            />
            <View>
              <Text style={styles.driverLabel}>Driver Mode</Text>
              <Text style={styles.driverName}>James Wilson</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Pressable
              style={styles.switchPill}
              onPress={() => { setRole('rider'); router.replace('/(rider)/home'); }}
            >
              <Text style={styles.switchText}>🧍 Rider</Text>
            </Pressable>
            {/* Online indicator */}
            <View style={[styles.onlineDot, { backgroundColor: isOnline ? GREEN : '#9CA3AF' }]} />
          </View>
        </View>
      </SafeAreaView>

      {/* ── MAP ─────────────────────────────────────────────────── */}
      <MapSimulation
        height={200}
        routeStatus={status}
        vehicleType="car"
        isDriverView={true}
      />

      {/* ── BOTTOM SHEET ────────────────────────────────────────── */}
      <View style={styles.sheet}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 64 }}>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Earnings</Text>
              <Text style={[styles.statValue, { color: GREEN }]}>NPR {(todayEarnings * 100).toFixed(0)}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Trips</Text>
              <Text style={styles.statValue}>{todayTrips}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Acceptance</Text>
              <Text style={[styles.statValue, { color: BLUE }]}>98%</Text>
            </View>
          </View>

          {/* ── OFFLINE / WAITING ─────────────────────────────────── */}
          {!activeRide && !pendingRequest && (
            <View style={styles.centeredCard}>
              <View style={[styles.onlineCircle, { backgroundColor: isOnline ? BLUE_LIGHT : '#F3F4F6', borderColor: isOnline ? BLUE : BORDER }]}>
                <Text style={{ fontSize: 36 }}>{isOnline ? '📡' : '💤'}</Text>
              </View>
              <Text style={styles.cardTitle}>
                {isOnline ? "You're Online & Ready" : "You're Offline"}
              </Text>
              <Text style={styles.cardSub}>
                {isOnline
                  ? 'Waiting for ride requests nearby...'
                  : 'Go online to start receiving requests.'}
              </Text>
              <Button
                title={isOnline ? 'Go Offline' : 'Go Online Now →'}
                variant={isOnline ? 'outline' : 'primary'}
                size="lg"
                onPress={() => setOnline(!isOnline)}
              />
            </View>
          )}

          {/* ── INCOMING REQUEST ──────────────────────────────────── */}
          {pendingRequest && isOnline && !activeRide && (
            <View style={styles.requestCard}>
              {/* Header */}
              <View style={styles.requestHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 20 }}>🔔</Text>
                  <Text style={styles.requestTitle}>New Ride Request!</Text>
                </View>
                <View style={styles.countdownPill}>
                  <Text style={styles.countdownText}>{countdown}s</Text>
                </View>
              </View>

              {/* Rider info */}
              <View style={styles.riderRow}>
                <View style={styles.riderAvatar}>
                  <Text style={{ fontSize: 22 }}>🧍</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.riderName}>{pendingRequest.riderName}</Text>
                  <Text style={styles.riderMeta}>⭐ {pendingRequest.riderRating} • 47 trips</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.riderFareLabel}>Fare</Text>
                  <Text style={styles.riderFare}>{formatFare(pendingRequest.fare)}</Text>
                </View>
              </View>

              {/* Route */}
              <View style={styles.routeCard}>
                <View style={styles.routeRow}>
                  <View style={[styles.routeDot, { backgroundColor: GREEN }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.routeTag}>PICKUP (2.1 km away)</Text>
                    <Text style={styles.routePlace} numberOfLines={1}>{pendingRequest.pickup.name}</Text>
                  </View>
                </View>
                <View style={[styles.routeRow, { marginTop: 10 }]}>
                  <View style={[styles.routeDot, { backgroundColor: RED }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.routeTag}>DESTINATION (4.5 km trip)</Text>
                    <Text style={styles.routePlace} numberOfLines={1}>{pendingRequest.destination.name}</Text>
                  </View>
                </View>
              </View>

              {/* Accept / Decline */}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Button
                  title="Decline"
                  variant="outline"
                  size="md"
                  onPress={handleDecline}
                  fullWidth={false}
                  style={{ width: 105 }}
                />
                <Button
                  title={`Accept (${formatFare(pendingRequest.fare)}) →`}
                  variant="success"
                  size="md"
                  onPress={handleAccept}
                  fullWidth={false}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          )}

          {/* ── ACTIVE RIDE FLOW ──────────────────────────────────── */}
          {activeRide && (
            <View>
              {/* Stage header */}
              <View style={styles.stageBar}>
                <View>
                  <Text style={styles.stageLabel}>Active Mission</Text>
                  <Text style={styles.stageTitle}>
                    {navStep === 'to_pickup'  && '🚗 Driving to Pickup'}
                    {navStep === 'arrived'    && '📍 Arrived at Pickup'}
                    {navStep === 'to_dropoff' && '🛣️ Heading to Destination'}
                    {navStep === 'finished'   && '🎉 Ride Completed!'}
                  </Text>
                </View>
                <Text style={styles.stageEarn}>NPR {(activeRide.fare * 10).toFixed(0)}</Text>
              </View>

              {/* Rider info */}
              <View style={styles.driverCard}>
                <View style={styles.riderAvatar}>
                  <Text style={{ fontSize: 22 }}>🧍</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.riderName}>{activeRide.riderName}</Text>
                  <Text style={styles.riderMeta}>⭐ {activeRide.riderRating}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Pressable style={styles.iconBtn} onPress={() => Alert.alert('Call', '')}>
                    <Text style={{ fontSize: 16 }}>📞</Text>
                  </Pressable>
                  <Pressable style={styles.pinBtn} onPress={() => Alert.alert('PIN', '4821')}>
                    <Text style={styles.pinText}>PIN: 4821</Text>
                  </Pressable>
                </View>
              </View>

              {/* Earnings flash */}
              {navStep === 'finished' && (
                <View style={styles.earnFlash}>
                  <Text style={styles.earnFlashText}>+NPR {(activeRide.fare * 10).toFixed(0)} added to earnings! 🎉</Text>
                </View>
              )}

              {/* CTA */}
              <Button
                title={navButtonLabel}
                variant={navStep === 'finished' ? 'success' : 'primary'}
                size="lg"
                onPress={handleNavAction}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  logoMiniImg:    { width: 34, height: 34, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  logoMini:       { width: 30, height: 30, borderRadius: 8, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center' },
  logoLetter:     { color: WHITE, fontWeight: '900', fontSize: 16 },
  driverLabel:    { fontSize: 10, fontWeight: '700', color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: 0.8 },
  driverName:     { fontSize: 16, fontWeight: '800', color: TEXT_PRIMARY },
  switchPill:     { backgroundColor: BLUE_LIGHT, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: BLUE + '30' },
  switchText:     { fontSize: 12, fontWeight: '700', color: BLUE },
  onlineDot:      { width: 12, height: 12, borderRadius: 6 },

  sheet:          { flex: 1, backgroundColor: WHITE, borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -16, paddingHorizontal: 18, paddingTop: 18 },

  statsRow:       { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard:       { flex: 1, backgroundColor: GRAY_BG, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: BORDER, alignItems: 'center' },
  statLabel:      { fontSize: 11, color: TEXT_MUTED, fontWeight: '600', marginBottom: 4 },
  statValue:      { fontSize: 18, fontWeight: '800', color: TEXT_PRIMARY },

  centeredCard:   { alignItems: 'center', backgroundColor: WHITE, borderRadius: 20, padding: 28, borderWidth: 1, borderColor: BORDER },
  onlineCircle:   { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 2, marginBottom: 16 },
  cardTitle:      { fontSize: 18, fontWeight: '800', color: TEXT_PRIMARY, marginBottom: 8 },
  cardSub:        { fontSize: 13, color: TEXT_MUTED, textAlign: 'center', marginBottom: 20, lineHeight: 20 },

  cta:            { backgroundColor: BLUE, borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  ctaRed:         { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#FECACA' },
  ctaText:        { color: WHITE, fontWeight: '700', fontSize: 15 },

  requestCard:    { backgroundColor: WHITE, borderRadius: 18, padding: 18, borderWidth: 2, borderColor: BLUE, shadowColor: BLUE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 6 },
  requestHeader:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: BORDER },
  requestTitle:   { fontSize: 16, fontWeight: '800', color: TEXT_PRIMARY },
  countdownPill:  { backgroundColor: BLUE, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  countdownText:  { color: WHITE, fontWeight: '700', fontSize: 13 },

  riderRow:       { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  riderAvatar:    { width: 46, height: 46, borderRadius: 23, backgroundColor: BLUE_LIGHT, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  riderName:      { fontSize: 15, fontWeight: '700', color: TEXT_PRIMARY, marginBottom: 2 },
  riderMeta:      { fontSize: 12, color: TEXT_MUTED },
  riderFareLabel: { fontSize: 11, color: TEXT_MUTED },
  riderFare:      { fontSize: 20, fontWeight: '800', color: TEXT_PRIMARY },

  routeCard:      { backgroundColor: GRAY_BG, borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: BORDER },
  routeRow:       { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  routeDot:       { width: 10, height: 10, borderRadius: 5, marginTop: 3 },
  routeTag:       { fontSize: 10, color: TEXT_MUTED, fontWeight: '600', marginBottom: 2, textTransform: 'uppercase' },
  routePlace:     { fontSize: 13, fontWeight: '700', color: TEXT_PRIMARY },

  declineBtn:     { paddingHorizontal: 20, paddingVertical: 15, borderRadius: 14, borderWidth: 1, borderColor: BORDER, backgroundColor: GRAY_BG, alignItems: 'center' },
  declineText:    { color: TEXT_MUTED, fontWeight: '600', fontSize: 14 },

  stageBar:       { backgroundColor: BLUE_LIGHT, borderRadius: 14, padding: 14, marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: BLUE + '25' },
  stageLabel:     { fontSize: 10, color: TEXT_MUTED, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  stageTitle:     { fontSize: 15, fontWeight: '800', color: TEXT_PRIMARY },
  stageEarn:      { fontSize: 20, fontWeight: '800', color: BLUE },

  driverCard:     { backgroundColor: WHITE, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 14, borderWidth: 1, borderColor: BORDER },
  iconBtn:        { width: 36, height: 36, borderRadius: 18, backgroundColor: GRAY_BG, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: BORDER },
  pinBtn:         { backgroundColor: BLUE_LIGHT, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: BLUE + '30' },
  pinText:        { color: BLUE, fontSize: 11, fontWeight: '700' },

  earnFlash:      { backgroundColor: '#F0FDF4', borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#BBF7D0', alignItems: 'center' },
  earnFlashText:  { color: '#15803D', fontWeight: '700', fontSize: 14 },
});
