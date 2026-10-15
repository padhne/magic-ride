import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';

/**
 * Screen 13 – Profile & Settings
 * Matching reference: avatar, name, phone, menu list with chevrons, Log Out.
 */
export default function RiderProfile() {
  const { user, setRole, logout } = useAuthStore();

  const menuItems = [
    { icon: '🕐', label: 'Ride History' },
    { icon: '💳', label: 'Payment Methods' },
    { icon: '🎁', label: 'Promo & Offers' },
    { icon: '💬', label: 'Help & Support' },
    { icon: '⚙️', label: 'Settings' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* Top header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Pressable
          style={styles.switchPill}
          onPress={() => { setRole('driver'); router.replace('/(driver)/home'); }}
        >
          <Text style={styles.switchText}>🚗 Drive</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* User card */}
        <View style={styles.userCard}>
          <View style={styles.avatarWrap}>
            <Text style={{ fontSize: 36 }}>👤</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{user?.name || 'Samir Rain'}</Text>
            <Text style={styles.userPhone}>{user?.phone || '+977 9800000000'}</Text>
          </View>
        </View>

        {/* Menu list */}
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

const BLUE = '#2563EB';
const WHITE = '#FFFFFF';
const TEXT_PRIMARY = '#1A1A2E';
const TEXT_MUTED = '#6B7280';
const BORDER = '#E5E7EB';

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: '#F5F7FA' },
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: WHITE, borderBottomWidth: 1, borderBottomColor: BORDER },
  headerTitle:    { fontSize: 20, fontWeight: '800', color: TEXT_PRIMARY },
  switchPill:     { backgroundColor: '#EFF6FF', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: BLUE + '30' },
  switchText:     { fontSize: 13, fontWeight: '700', color: BLUE },

  userCard:       { backgroundColor: WHITE, margin: 16, borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  avatarWrap:     { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: BLUE },
  userName:       { fontSize: 18, fontWeight: '800', color: TEXT_PRIMARY, marginBottom: 4 },
  userPhone:      { fontSize: 13, color: TEXT_MUTED },


  menuCard:       { backgroundColor: WHITE, marginHorizontal: 16, marginBottom: 14, borderRadius: 18, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  menuRow:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16 },
  menuRowBorder:  { borderBottomWidth: 1, borderBottomColor: BORDER },
  menuLabel:      { flex: 1, fontSize: 15, fontWeight: '600', color: TEXT_PRIMARY },
  chevron:        { fontSize: 20, color: '#9CA3AF' },

  logoutBtn:      { marginHorizontal: 16, backgroundColor: WHITE, borderRadius: 14, paddingVertical: 15, alignItems: 'center', borderWidth: 1, borderColor: BORDER },
  logoutText:     { fontSize: 15, fontWeight: '700', color: '#EF4444' },
});
