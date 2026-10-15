import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { useDriverStore } from '../../store/driverStore';
import { Button } from '../../components/ui/Button';

const BLUE = '#2563EB';
const BLUE_LIGHT = '#EFF6FF';
const WHITE = '#FFFFFF';
const TEXT_PRIMARY = '#1A1A2E';
const TEXT_MUTED = '#6B7280';
const BORDER = '#E5E7EB';
const GRAY_BG = '#F5F7FA';

export default function DriverProfile() {
  const { user, setRole, logout } = useAuthStore();
  const { todayEarnings, todayTrips } = useDriverStore();

  const menuItems = [
    { icon: '📋', label: 'Trip History' },
    { icon: '💳', label: 'Payment Methods' },
    { icon: '🛡️', label: 'Safety & Emergency' },
    { icon: '💬', label: 'Help & Support' },
    { icon: '⚙️', label: 'Settings' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver Profile</Text>
        <Pressable
          style={styles.switchPill}
          onPress={() => { setRole('rider'); router.replace('/(rider)/home'); }}
        >
          <Text style={styles.switchText}>🧍 Rider Mode</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* User card */}
        <View style={styles.userCard}>
          <View style={styles.avatarWrap}>
            <Text style={{ fontSize: 36 }}>👨</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>James Wilson</Text>
            <Text style={styles.userPhone}>+977 9800000001</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
              <View style={styles.statChip}>
                <Text style={styles.statChipVal}>⭐ 4.9</Text>
              </View>
              <View style={styles.statChip}>
                <Text style={styles.statChipVal}>312 trips</Text>
              </View>
              <View style={[styles.statChip, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
                <Text style={[styles.statChipVal, { color: '#15803D' }]}>Online</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Today summary */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Today's Earnings</Text>
            <Text style={[styles.summaryVal, { color: BLUE }]}>NPR {(todayEarnings * 100).toFixed(0)}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Trips Today</Text>
            <Text style={styles.summaryVal}>{todayTrips}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Acceptance</Text>
            <Text style={[styles.summaryVal, { color: '#22C55E' }]}>98%</Text>
          </View>
        </View>

        {/* Vehicle info */}
        <View style={styles.vehicleCard}>
          <Text style={{ fontSize: 28, marginRight: 14 }}>🚗</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.vehicleName}>White Toyota Prius</Text>
            <Text style={styles.vehiclePlate}>Ba 1 Cha 2345 · Magic Ride Go</Text>
          </View>
          <Pressable onPress={() => Alert.alert('Vehicle', 'Edit vehicle details')}>
            <Text style={{ color: BLUE, fontWeight: '700', fontSize: 13 }}>Edit</Text>
          </Pressable>
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          {menuItems.map((item, idx) => (
            <Pressable
              key={item.label}
              style={[styles.menuRow, idx !== menuItems.length - 1 && styles.menuRowBorder]}
              onPress={() => Alert.alert(item.label, `${item.label} — demo`)}
            >
              <Text style={{ fontSize: 20, marginRight: 14 }}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
        </View>

        {/* Log Out */}
        <View style={{ marginHorizontal: 16 }}>
          <Button
            title="Log Out"
            variant="outline"
            size="md"
            onPress={() => { logout(); router.replace('/(auth)/welcome'); }}
            textStyle={{ color: '#EF4444' }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: GRAY_BG },
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: WHITE, borderBottomWidth: 1, borderBottomColor: BORDER },
  headerTitle:    { fontSize: 20, fontWeight: '800', color: TEXT_PRIMARY },
  switchPill:     { backgroundColor: BLUE_LIGHT, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: BLUE + '30' },
  switchText:     { fontSize: 12, fontWeight: '700', color: BLUE },

  userCard:       { backgroundColor: WHITE, margin: 16, borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderColor: BORDER },
  avatarWrap:     { width: 68, height: 68, borderRadius: 34, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: BLUE },
  userName:       { fontSize: 18, fontWeight: '800', color: TEXT_PRIMARY, marginBottom: 2 },
  userPhone:      { fontSize: 13, color: TEXT_MUTED },
  statChip:       { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: BORDER },
  statChipVal:    { fontSize: 11, fontWeight: '700', color: TEXT_PRIMARY },

  summaryRow:     { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginBottom: 14 },
  summaryCard:    { flex: 1, backgroundColor: WHITE, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: BORDER, alignItems: 'center' },
  summaryLabel:   { fontSize: 11, color: TEXT_MUTED, fontWeight: '600', marginBottom: 4, textAlign: 'center' },
  summaryVal:     { fontSize: 18, fontWeight: '800', color: TEXT_PRIMARY },

  vehicleCard:    { flexDirection: 'row', alignItems: 'center', backgroundColor: WHITE, marginHorizontal: 16, marginBottom: 14, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: BORDER },
  vehicleName:    { fontSize: 15, fontWeight: '700', color: TEXT_PRIMARY, marginBottom: 2 },
  vehiclePlate:   { fontSize: 12, color: TEXT_MUTED },

  menuCard:       { backgroundColor: WHITE, marginHorizontal: 16, marginBottom: 14, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: BORDER },
  menuRow:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16 },
  menuRowBorder:  { borderBottomWidth: 1, borderBottomColor: BORDER },
  menuLabel:      { flex: 1, fontSize: 15, fontWeight: '600', color: TEXT_PRIMARY },
  chevron:        { fontSize: 20, color: '#9CA3AF' },

  logoutBtn:      { marginHorizontal: 16, backgroundColor: WHITE, borderRadius: 14, paddingVertical: 15, alignItems: 'center', borderWidth: 1, borderColor: BORDER },
  logoutText:     { fontSize: 15, fontWeight: '700', color: '#EF4444' },
});
