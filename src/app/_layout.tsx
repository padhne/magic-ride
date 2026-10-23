// ─── Root layout — mounts providers and NativeWind ────────────────────────────
import '../../global.css'; // NativeWind v4: MUST be imported in the root layout
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '../store/authStore';
import { useRideStore } from '../store/rideStore';

SplashScreen.preventAutoHideAsync();

/** True once the persisted auth + ride stores have been read from storage. */
function useStoresHydrated() {
  const check = () => useAuthStore.persist.hasHydrated() && useRideStore.persist.hasHydrated();
  const [hydrated, setHydrated] = useState(check);

  useEffect(() => {
    const update = () => setHydrated(check());
    const unsubAuth = useAuthStore.persist.onFinishHydration(update);
    const unsubRide = useRideStore.persist.onFinishHydration(update);
    update();
    return () => { unsubAuth(); unsubRide(); };
  }, []);

  return hydrated;
}

export default function RootLayout() {
  const hydrated = useStoresHydrated();

  useEffect(() => {
    if (!hydrated) return;
    // Hide splash after a brief moment to allow first render
    const t = setTimeout(() => SplashScreen.hideAsync(), 300);
    return () => clearTimeout(t);
  }, [hydrated]);

  // Keep the native splash visible until we know whether the user is logged in
  if (!hydrated) return null;

  // index.tsx redirects to auth or the right home based on the restored session
  return (
    <GestureHandlerRootView style={{ flex: 1 }} className="flex-1">
      <Stack screenOptions={{ headerShown: false }}>
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
