import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useDriverStore } from '../../store/driverStore';
import { useAuthStore } from '../../store/authStore';

const BLUE = '#2563EB';
const BLUE_LIGHT = '#EFF6FF';
const WHITE = '#FFFFFF';
const TEXT_PRIMARY = '#1A1A2E';
const TEXT_MUTED = '#6B7280';
const BORDER = '#E5E7EB';
const GRAY_BG = '#F5F7FA';
const GREEN = '#22C55E';

const WEEK_DATA = [
  { day: 'Mon', value: 2200, trips: 4 },
  { day: 'Tue', value: 3400, trips: 6 },
  { day: 'Wed', value: 1800, trips: 3 },
  { day: 'Thu', value: 4100, trips: 7 },
  { day: 'Fri', value: 5200, trips: 9 },
  { day: 'Sat', value: 3800, trips: 6 },
  { day: 'Sun', value: 2900, trips: 5 },
];
const maxVal = Math.max(...WEEK_DATA.map((d) => d.value));

export default function DriverEarnings() {
  const { todayEarnings, todayTrips } = useDriverStore();
  const { setRole } = useAuthStore();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Earnings</Text>
        <Pressable
          style={styles.switchPill}
          onPress={() => { setRole('rider'); router.replace('/(rider)/home'); }}
        >
          <Text style={styles.switchText}>🧍 Rider Mode</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Balance card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>NPR {(18500 + todayEarnings).toLocaleString()}</Text>
          <Text style={styles.balanceSub}>Available for withdrawal</Text>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
            <Pressable style={styles.cashOutBtn} onPress={() => Alert.alert('Cash Out', 'NPR transferred to your eSewa / Bank!')}>
              <Text style={styles.cashOutText}>Cash Out →</Text>
            </Pressable>
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatLabel}>Today</Text>
              <Text style={styles.balanceStatVal}>NPR {(2850 + todayEarnings).toLocaleString()}</Text>
            </View>
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatLabel}>Trips</Text>
              <Text style={styles.balanceStatVal}>{todayTrips + 7}</Text>
            </View>
          </View>
        </View>

        {/* Weekly bar chart */}
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <Text style={styles.sectionSub}>NPR {WEEK_DATA.reduce((a, b) => a + b.value, 0).toLocaleString()} total</Text>

          <View style={styles.chartArea}>
            {WEEK_DATA.map((d, i) => {
              const today = i === 4; // Friday = today in demo
              const barH = Math.max(8, (d.value / maxVal) * 100);
              return (
                <View key={d.day} style={styles.barCol}>
                  <Text style={styles.barValue}>NPR {(d.value / 1000).toFixed(1)}k</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { height: `${barH}%`, backgroundColor: today ? BLUE : '#CBD5E1' }]} />
                  </View>
                  <Text style={[styles.barDay, today && { color: BLUE, fontWeight: '700' }]}>{d.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Recent transactions */}
        <View style={styles.transCard}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {[
            { name: 'Bikash Thapa', route: 'Thamel → TIA Airport', time: '10:30 AM', amount: 450 },
            { name: 'Sita Sharma', route: 'New Baneshwor → Durbarmarg', time: '9:15 AM', amount: 120 },
            { name: 'Pooja Karki', route: 'Patan Durbar Sq → Swayambhu', time: '8:00 AM', amount: 350 },
          ].map((tx, idx) => (
            <View key={idx} style={[styles.txRow, idx !== 2 && styles.txRowBorder]}>
              <View style={styles.txAvatar}>
                <Text style={{ fontSize: 18 }}>🧍</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.txName}>{tx.name}</Text>
                <Text style={styles.txRoute}>{tx.route}</Text>
                <Text style={styles.txTime}>{tx.time}</Text>
              </View>
              <Text style={styles.txAmount}>+NPR {tx.amount}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: GRAY_BG },
  header:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: WHITE, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: BORDER },
  headerTitle:      { fontSize: 22, fontWeight: '800', color: TEXT_PRIMARY },
  switchPill:       { backgroundColor: BLUE_LIGHT, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: BLUE + '30' },
  switchText:       { fontSize: 12, fontWeight: '700', color: BLUE },

  balanceCard:      { backgroundColor: BLUE, margin: 16, borderRadius: 20, padding: 22 },
  balanceLabel:     { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 6 },
  balanceAmount:    { fontSize: 36, fontWeight: '800', color: WHITE, marginBottom: 4 },
  balanceSub:       { fontSize: 12, color: 'rgba(255,255,255,0.65)' },
  cashOutBtn:       { backgroundColor: WHITE, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  cashOutText:      { color: BLUE, fontWeight: '700', fontSize: 14 },
  balanceStat:      { alignItems: 'center', flex: 1 },
  balanceStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 2 },
  balanceStatVal:   { fontSize: 16, fontWeight: '800', color: WHITE },

  chartCard:        { backgroundColor: WHITE, marginHorizontal: 16, marginBottom: 14, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: BORDER },
  sectionTitle:     { fontSize: 16, fontWeight: '800', color: TEXT_PRIMARY, marginBottom: 2 },
  sectionSub:       { fontSize: 12, color: TEXT_MUTED, marginBottom: 16 },
  chartArea:        { flexDirection: 'row', alignItems: 'flex-end', height: 140, gap: 8 },
  barCol:           { flex: 1, alignItems: 'center', height: '100%' },
  barValue:         { fontSize: 8, color: TEXT_MUTED, marginBottom: 4, textAlign: 'center' },
  barTrack:         { flex: 1, width: '100%', justifyContent: 'flex-end' },
  barFill:          { width: '100%', borderRadius: 4 },
  barDay:           { fontSize: 11, color: TEXT_MUTED, marginTop: 6, fontWeight: '600' },

  transCard:        { backgroundColor: WHITE, marginHorizontal: 16, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: BORDER, padding: 18 },
  txRow:            { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  txRowBorder:      { borderBottomWidth: 1, borderBottomColor: BORDER },
  txAvatar:         { width: 42, height: 42, borderRadius: 21, backgroundColor: BLUE_LIGHT, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txName:           { fontSize: 14, fontWeight: '700', color: TEXT_PRIMARY, marginBottom: 2 },
  txRoute:          { fontSize: 12, color: TEXT_MUTED, marginBottom: 1 },
  txTime:           { fontSize: 11, color: TEXT_MUTED },
  txAmount:         { fontSize: 15, fontWeight: '800', color: GREEN },
});
