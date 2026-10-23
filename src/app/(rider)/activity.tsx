import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MOCK_RIDE_HISTORY } from '../../mocks/rides';
import { useRideStore } from '../../store/rideStore';
import { MOCK_PLACES } from '../../mocks/places';
import { formatFare } from '../../utils/formatters';
import type { RideHistoryItem } from '../../types';

const BLUE = '#2563EB';
const WHITE = '#FFFFFF';
const TEXT_PRIMARY = '#1A1A2E';
const TEXT_MUTED = '#6B7280';
const BORDER = '#E5E7EB';
const GRAY_BG = '#F5F7FA';

export default function ActivityScreen() {
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');
  const { status, setDestination, transition, reset } = useRideStore();

  const filtered = MOCK_RIDE_HISTORY.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const handleRebook = (item: RideHistoryItem) => {
    // Don't overwrite a ride that's already requested or underway
    if (status !== 'idle' && status !== 'searching' && status !== 'completed' && status !== 'cancelled') {
      Alert.alert('Ride in progress', 'Finish or cancel your current ride before booking another.', [
        { text: 'OK', style: 'cancel' },
        { text: 'View Ride', onPress: () => router.navigate('/(rider)/home') },
      ]);
      return;
    }
    // Start fresh from idle so the state machine allows → searching
    reset();
    const place = MOCK_PLACES.find((p) => p.name.includes(item.destination)) || {
      id: `rebook-${Date.now()}`,
      name: item.destination,
      address: `${item.destination}, Kathmandu`,
      shortAddress: item.destination,
      coordinate: { latitude: 27.7172, longitude: 85.3240 },
    };
    setDestination(place);
    transition('searching');
    router.navigate('/(rider)/home');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ride History</Text>
        <Text style={styles.headerSub}>Past trips & re-booking</Text>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {(['all', 'completed', 'cancelled'] as const).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.filterChip, filter === tab && styles.filterChipActive]}
            onPress={() => setFilter(tab)}
          >
            <Text style={[styles.filterText, filter === tab && styles.filterTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 14 }}>
        {filtered.map((item) => {
          const cancelled = item.status === 'cancelled';
          const icon = item.vehicleType === 'bike' ? '🏍️' : item.vehicleType === 'premium' ? '🚙' : '🚗';

          return (
            <View key={item.id} style={styles.card}>
              {/* Top row */}
              <View style={styles.cardTop}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                  <Text style={{ fontSize: 28 }}>{icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardDest} numberOfLines={1}>{item.destination}</Text>
                    <Text style={styles.cardMeta}>{item.date} · {item.duration > 0 ? `${item.duration} min` : 'Cancelled'}</Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.cardFare, cancelled && { color: TEXT_MUTED }]}>
                    {cancelled ? 'NPR 0' : formatFare(item.fare)}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: cancelled ? '#FEF2F2' : '#F0FDF4' }]}>
                    <Text style={[styles.statusText, { color: cancelled ? '#DC2626' : '#16A34A' }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Route */}
              <View style={styles.routeBlock}>
                <View style={styles.routeRow}>
                  <View style={[styles.routeDot, { backgroundColor: BLUE }]} />
                  <Text style={styles.routeText} numberOfLines={1}>From: <Text style={styles.routePlace}>{item.pickup}</Text></Text>
                </View>
                <View style={[styles.routeRow, { marginTop: 6 }]}>
                  <View style={[styles.routeDot, { backgroundColor: '#EF4444' }]} />
                  <Text style={styles.routeText} numberOfLines={1}>To: <Text style={styles.routePlace}>{item.destination}</Text></Text>
                </View>
              </View>

              {/* Footer */}
              <View style={styles.cardFooter}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 14 }}>👨</Text>
                  <Text style={styles.driverText}>{item.driverName}</Text>
                  {item.rating > 0 && <Text style={styles.ratingText}>⭐ {item.rating}</Text>}
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {!cancelled && (
                    <Pressable
                      style={styles.receiptBtn}
                      onPress={() => Alert.alert('Receipt', `Trip to ${item.destination}\n${formatFare(item.fare)}\nPaid via Cash`)}
                    >
                      <Text style={styles.receiptText}>Receipt</Text>
                    </Pressable>
                  )}
                  <Pressable style={styles.rebookBtn} onPress={() => handleRebook(item)}>
                    <Text style={styles.rebookText}>Rebook ↺</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: GRAY_BG },
  header:         { backgroundColor: WHITE, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: BORDER },
  headerTitle:    { fontSize: 22, fontWeight: '800', color: TEXT_PRIMARY },
  headerSub:      { fontSize: 12, color: TEXT_MUTED, marginTop: 2 },

  filterRow:      { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: WHITE, borderBottomWidth: 1, borderBottomColor: BORDER },
  filterChip:     { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: BORDER, backgroundColor: GRAY_BG },
  filterChipActive:{ borderColor: BLUE, backgroundColor: '#EFF6FF' },
  filterText:     { fontSize: 13, fontWeight: '600', color: TEXT_MUTED },
  filterTextActive:{ color: BLUE },

  card:           { backgroundColor: WHITE, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: BORDER, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  cardTop:        { flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: BORDER },
  cardDest:       { fontSize: 15, fontWeight: '700', color: TEXT_PRIMARY, marginBottom: 2 },
  cardMeta:       { fontSize: 12, color: TEXT_MUTED },
  cardFare:       { fontSize: 16, fontWeight: '800', color: TEXT_PRIMARY, marginBottom: 4 },
  statusBadge:    { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  statusText:     { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },

  routeBlock:     { marginBottom: 12 },
  routeRow:       { flexDirection: 'row', alignItems: 'center', gap: 10 },
  routeDot:       { width: 8, height: 8, borderRadius: 4 },
  routeText:      { fontSize: 12, color: TEXT_MUTED, flex: 1 },
  routePlace:     { color: TEXT_PRIMARY, fontWeight: '600' },

  cardFooter:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: BORDER },
  driverText:     { fontSize: 12, color: TEXT_MUTED },
  ratingText:     { fontSize: 12, color: '#F59E0B' },
  receiptBtn:     { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, borderWidth: 1, borderColor: BORDER, backgroundColor: GRAY_BG },
  receiptText:    { fontSize: 12, fontWeight: '600', color: TEXT_PRIMARY },
  rebookBtn:      { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, backgroundColor: BLUE },
  rebookText:     { fontSize: 12, fontWeight: '700', color: WHITE },
});
