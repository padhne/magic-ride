import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  StatusBar, KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';

const BLUE    = '#2563EB';
const GREEN   = '#22C55E';

/** Avatar colour pool – displayed as initials when no real photo is chosen */
const AVATAR_COLORS = [
  '#2563EB', '#7C3AED', '#DB2777', '#D97706', '#059669', '#DC2626',
];

/**
 * Screen – Profile Setup (after OTP)
 * User can set a display name and pick an avatar colour (simulating photo pick).
 * Fully skippable – tapping Skip or the X goes straight to success.
 */
export default function ProfileSetupScreen() {
  const { user, setUser } = useAuthStore();
  const [name, setName]   = useState(user?.name || '');
  const [color, setColor] = useState(AVATAR_COLORS[0]);
  const [saving, setSaving] = useState(false);

  const initials = name.trim()
    ? name.trim().split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter your display name to continue.');
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600)); // simulate async
    if (user) {
      setUser({ ...user, name: name.trim() });
    }
    setSaving(false);
    router.replace('/(auth)/success');
  };

  const handleSkip = () => {
    router.replace('/(auth)/success');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Header row */}
          <View style={styles.headerRow}>
            <Pressable
              style={styles.backBtn}
              onPress={() => router.canGoBack() ? router.back() : router.replace('/(auth)/role')}
            >
              <Ionicons name="chevron-back" size={22} color="#1A1A2E" />
            </Pressable>
            <Pressable style={styles.skipTopBtn} onPress={handleSkip}>
              <Text style={styles.skipTopText}>Skip</Text>
            </Pressable>
          </View>

          {/* Progress indicator: step 3 of 3 */}
          <View style={styles.progressRow}>
            {[1, 2, 3].map((s) => (
              <View key={s} style={[styles.progressDot, s <= 3 && styles.progressDotDone]} />
            ))}
          </View>

          <View style={styles.content}>
            <Text style={styles.heading}>Set up your profile</Text>
            <Text style={styles.sub}>
              Add your name and pick an avatar.{'\n'}You can always update this later.
            </Text>

            {/* Avatar preview */}
            <View style={styles.avatarSection}>
              <View style={[styles.avatarCircle, { backgroundColor: color }]}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
              {/* Camera overlay button */}
              <View style={styles.cameraBtn}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.avatarHint}>Pick a colour below</Text>
            </View>

            {/* Colour picker */}
            <View style={styles.colorRow}>
              {AVATAR_COLORS.map((c) => (
                <Pressable key={c} onPress={() => setColor(c)}>
                  <View style={[styles.colorSwatch, { backgroundColor: c }, color === c && styles.colorSwatchSelected]}>
                    {color === c && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Name input */}
            <Text style={styles.label}>Display Name</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Samir Thapa"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={handleSave}
              />
            </View>

            {/* Optional note */}
            <View style={styles.noteBox}>
              <Ionicons name="information-circle-outline" size={16} color={BLUE} style={{ marginRight: 6, marginTop: 1 }} />
              <Text style={styles.noteText}>
                Your name is visible to your driver during a trip.
              </Text>
            </View>
          </View>

          {/* Bottom CTA */}
          <View style={styles.bottomArea}>
            <Button
              title="Save & Continue"
              variant="primary"
              size="lg"
              loading={saving}
              onPress={handleSave}
              style={{ marginBottom: 12 }}
            />
            <Button
              title="Skip for now"
              variant="ghost"
              size="lg"
              onPress={handleSkip}
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: '#FFFFFF' },

  headerRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12 },
  backBtn:      { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  skipTopBtn:   { paddingHorizontal: 12, paddingVertical: 8 },
  skipTopText:  { fontSize: 14, color: '#6B7280', fontWeight: '600' },

  progressRow:  { flexDirection: 'row', gap: 6, marginHorizontal: 24, marginTop: 10, marginBottom: 24 },
  progressDot:  { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB' },
  progressDotDone: { backgroundColor: BLUE },

  content:    { paddingHorizontal: 24, flex: 1 },
  heading:    { fontSize: 26, fontWeight: '800', color: '#1A1A2E', marginBottom: 6 },
  sub:        { fontSize: 14, color: '#6B7280', lineHeight: 22, marginBottom: 28 },

  avatarSection: { alignItems: 'center', marginBottom: 20, position: 'relative' },
  avatarCircle:  { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 },
  avatarInitials:{ fontSize: 36, fontWeight: '800', color: '#FFFFFF' },
  cameraBtn:     { position: 'absolute', bottom: 22, right: '32%', width: 30, height: 30, borderRadius: 15, backgroundColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  avatarHint:    { fontSize: 12, color: '#9CA3AF', marginTop: 8 },

  colorRow:     { flexDirection: 'row', gap: 12, marginBottom: 24, justifyContent: 'center' },
  colorSwatch:  { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  colorSwatchSelected: { borderWidth: 3, borderColor: '#1A1A2E' },

  label:    { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 8 },
  inputWrap:{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1.5, borderColor: '#E5E7EB', marginBottom: 16 },
  input:    { flex: 1, fontSize: 16, color: '#1A1A2E' },

  noteBox:  { flexDirection: 'row', backgroundColor: '#EFF6FF', borderRadius: 10, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#BFDBFE' },
  noteText: { flex: 1, fontSize: 12, color: '#1D4ED8', lineHeight: 18 },

  bottomArea: { paddingHorizontal: 24, paddingBottom: 32, paddingTop: 12 },
});

