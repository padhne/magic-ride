import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import type { Coordinate } from '../types';
import { DUMMY_CURRENT_LOCATION } from '../mocks/places';

interface LocationState {
  coordinate: Coordinate;
  permissionGranted: boolean;
  loading: boolean;
}

/**
 * Requests foreground location permission. Falls back to DUMMY_CURRENT_LOCATION
 * if the user denies – so the app is always functional in the demo.
 */
export function useLocation(): LocationState {
  const [state, setState] = useState<LocationState>({
    coordinate: DUMMY_CURRENT_LOCATION,
    permissionGranted: false,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (mounted) setState({ coordinate: DUMMY_CURRENT_LOCATION, permissionGranted: false, loading: false });
          return;
        }
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (mounted)
          setState({
            coordinate: { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
            permissionGranted: true,
            loading: false,
          });
      } catch {
        // expo-location can fail in simulators – fallback gracefully
        if (mounted) setState({ coordinate: DUMMY_CURRENT_LOCATION, permissionGranted: false, loading: false });
      }
    })();

    return () => { mounted = false; };
  }, []);

  return state;
}
