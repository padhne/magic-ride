// ─── Root layout — mounts providers and NativeWind ────────────────────────────
import '../../global.css'; // NativeWind v4: MUST be imported in the root layout
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '../store/authStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    // Hide splash after a brief moment to allow first render
    const t = setTimeout(() => SplashScreen.hideAsync(), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }} className="flex-1">
      <Stack initialRouteName="(auth)" screenOptions={{ headerShown: false }}>
        {/* Auth group — shown when not authenticated */}
        <Stack.Screen name="(auth)" />
        {/* Main app tabs — shown when authenticated */}
        <Stack.Screen name="(rider)" />
        <Stack.Screen name="(driver)" />
        {/* Shared screens accessible from both modes */}
        <Stack.Screen name="(shared)" />
      </Stack>
    </GestureHandlerRootView>
  );
}
