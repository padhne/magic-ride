// ─── App entry point — redirects to correct route group ───────────────────────
import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export default function Index() {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/splash" />;
  }

  if (role === 'driver') {
    return <Redirect href="/(driver)/home" />;
  }

  return <Redirect href="/(rider)/home" />;
}
