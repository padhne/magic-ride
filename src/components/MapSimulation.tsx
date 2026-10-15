import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import type { Coordinate } from '../types';
import { DUMMY_CURRENT_LOCATION } from '../mocks/places';

interface MapSimulationProps {
  riderLocation?: Coordinate | null;
  driverLocation?: Coordinate | null;
  destinationLocation?: Coordinate | null;
  routeStatus?:
    | 'idle'
    | 'searching'
    | 'requested'
    | 'accepted'
    | 'driver_arriving'
    | 'arrived'
    | 'in_progress'
    | 'completed'
    | 'cancelled';
  vehicleType?: 'car' | 'bike' | 'premium';
  height?: number;
  isDriverView?: boolean;
}

const WebViewComp = WebView as any;

export function MapSimulation({
  riderLocation,
  driverLocation,
  destinationLocation,
  routeStatus = 'idle',
  vehicleType = 'car',
  height = 360,
  isDriverView = false,
}: MapSimulationProps) {
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef<any>(null);

  const riderCoord = useMemo(
    () => ({
      latitude: riderLocation?.latitude ?? DUMMY_CURRENT_LOCATION.latitude,
      longitude: riderLocation?.longitude ?? DUMMY_CURRENT_LOCATION.longitude,
    }),
    [riderLocation]
  );

  const destCoord = useMemo(
    () =>
      destinationLocation
        ? {
            latitude: destinationLocation.latitude,
            longitude: destinationLocation.longitude,
          }
        : null,
    [destinationLocation]
  );

  // Simulated moving driver position
  const [driverPos, setDriverPos] = useState<Coordinate>({
    latitude: driverLocation?.latitude ?? (riderCoord.latitude - 0.005),
    longitude: driverLocation?.longitude ?? (riderCoord.longitude - 0.004),
  });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (routeStatus === 'driver_arriving') {
      let step = 0;
      interval = setInterval(() => {
        step += 1;
        const progress = Math.min(step / 10, 1);
        setDriverPos({
          latitude: riderCoord.latitude - 0.005 * (1 - progress),
          longitude: riderCoord.longitude - 0.004 * (1 - progress),
        });
        if (progress >= 1) clearInterval(interval);
      }, 500);
    } else if (routeStatus === 'arrived') {
      setDriverPos({ ...riderCoord });
    } else if (routeStatus === 'in_progress' && destCoord) {
      let step = 0;
      interval = setInterval(() => {
        step += 1;
        const progress = Math.min(step / 14, 1);
        setDriverPos({
          latitude: riderCoord.latitude + (destCoord.latitude - riderCoord.latitude) * progress,
          longitude: riderCoord.longitude + (destCoord.longitude - riderCoord.longitude) * progress,
        });
        if (progress >= 1) clearInterval(interval);
      }, 500);
    } else {
      setDriverPos({
        latitude: driverLocation?.latitude ?? (riderCoord.latitude - 0.005),
        longitude: driverLocation?.longitude ?? (riderCoord.longitude - 0.004),
      });
    }

    return () => clearInterval(interval);
  }, [routeStatus, riderCoord, destCoord, driverLocation]);

  const vehicleIcon = vehicleType === 'bike' ? '🏍️' : vehicleType === 'premium' ? '🚙' : '🚗';

  const showActiveDriver =
    routeStatus === 'accepted' ||
    routeStatus === 'driver_arriving' ||
    routeStatus === 'arrived' ||
    routeStatus === 'in_progress';

  // Robust Leaflet HTML with CartoDB Voyager + OSM tiles & offline fallback
  const mapHtml = useMemo(() => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    html, body, #map { width: 100%; height: 100%; overflow: hidden; background: #E8ECEF; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    
    .pin-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      transform: translate(-50%, -100%);
      position: absolute;
    }
    .pin-badge {
      width: 32px;
      height: 32px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2.5px solid #FFFFFF;
      box-shadow: 0 4px 10px rgba(0,0,0,0.25);
      font-size: 15px;
    }
    .pin-pickup { background: #2563EB; }
    .pin-dest { background: #EF4444; }
    .pin-label {
      background: #FFFFFF;
      color: #1A1A2E;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 8px;
      margin-top: 3px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.18);
      white-space: nowrap;
    }
    .driver-pin {
      width: 38px;
      height: 38px;
      border-radius: 19px;
      background: #FFFFFF;
      border: 2px solid #2563EB;
      box-shadow: 0 4px 12px rgba(37,99,235,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      transform: translate(-50%, -50%);
      position: absolute;
    }
    .idle-car {
      font-size: 22px;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));
      transform: translate(-50%, -50%);
      position: absolute;
    }
    .pulse-ring {
      position: absolute;
      width: 48px;
      height: 48px;
      border-radius: 24px;
      background: rgba(37, 99, 235, 0.28);
      border: 1.5px solid #2563EB;
      top: -8px;
      left: -8px;
      animation: pulse 1.8s infinite ease-out;
      pointer-events: none;
    }
    @keyframes pulse {
      0% { transform: scale(0.5); opacity: 0.9; }
      100% { transform: scale(2.2); opacity: 0; }
    }
    
    /* Fallback stylized Kathmandu map view in case network tiles fail */
    #offlineFallback {
      display: none;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0; left: 0;
      background: #E8EDF2;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  
  <div id="offlineFallback">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D1D5DB" stroke-width="0.8"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="#E5E7EB"/>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <!-- Stylized Kathmandu Ring Road & main streets -->
      <path d="M -20 140 Q 180 80 420 160" stroke="#FFFFFF" stroke-width="12" fill="none"/>
      <path d="M -20 140 Q 180 80 420 160" stroke="#FDE047" stroke-width="4" stroke-dasharray="8,6" fill="none"/>
      <path d="M 80 -20 Q 120 180 200 380" stroke="#FFFFFF" stroke-width="10" fill="none"/>
      <path d="M 220 -20 Q 200 160 320 380" stroke="#FFFFFF" stroke-width="8" fill="none"/>
      <path d="M 40 220 L 360 120" stroke="#FFFFFF" stroke-width="8" fill="none"/>
      <!-- River -->
      <path d="M -20 280 Q 140 220 300 290 T 480 260" stroke="#93C5FD" stroke-width="14" fill="none" opacity="0.6"/>
    </svg>
    <div style="position:absolute; bottom:12px; left:12px; background:white; padding:4px 8px; border-radius:6px; font-size:10px; color:#4B5563; font-weight:700;">
      📍 Kathmandu City Area
    </div>
  </div>

  <script>
    function showFallback() {
      var fb = document.getElementById('offlineFallback');
      if (fb) fb.style.display = 'block';
    }

    try {
      if (typeof L === 'undefined') {
        showFallback();
      } else {
        var map = L.map('map', {
          center: [${riderCoord.latitude}, ${riderCoord.longitude}],
          zoom: 15,
          zoomControl: false,
          attributionControl: false
        });

        // Use CartoDB Voyager tiles (clean, reliable, beautiful streets, no WebGL needed)
        var tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          subdomains: 'abcd',
          maxZoom: 19
        }).addTo(map);

        tileLayer.on('tileerror', function() {
          // If Carto fails, fallback to standard OSM
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
          }).addTo(map);
        });

        // Pickup Marker
        var pickupEl = document.createElement('div');
        pickupEl.className = 'pin-wrap';
        pickupEl.innerHTML = \`
          ${routeStatus === 'searching' || routeStatus === 'requested' ? '<div class="pulse-ring"></div>' : ''}
          <div class="pin-badge pin-pickup">📍</div>
          <div class="pin-label">${isDriverView ? 'Rider Pickup' : 'You are here'}</div>
        \`;
        var pickupIcon = L.divIcon({
          className: '',
          html: pickupEl.outerHTML,
          iconSize: [0, 0]
        });
        L.marker([${riderCoord.latitude}, ${riderCoord.longitude}], { icon: pickupIcon }).addTo(map);

        ${destCoord ? `
        // Destination Marker
        var destEl = document.createElement('div');
        destEl.className = 'pin-wrap';
        destEl.innerHTML = '<div class="pin-badge pin-dest">🏁</div><div class="pin-label" style="background:#1A1A2E;color:#FFFFFF">Destination</div>';
        var destIcon = L.divIcon({
          className: '',
          html: destEl.outerHTML,
          iconSize: [0, 0]
        });
        L.marker([${destCoord.latitude}, ${destCoord.longitude}], { icon: destIcon }).addTo(map);

        // Route Polyline
        var routePoints = [
          [${riderCoord.latitude}, ${riderCoord.longitude}],
          [${(riderCoord.latitude * 2 + destCoord.latitude) / 3}, ${(riderCoord.longitude * 2 + destCoord.longitude) / 3}],
          [${(riderCoord.latitude + destCoord.latitude * 2) / 3}, ${(riderCoord.longitude + destCoord.longitude * 2) / 3}],
          [${destCoord.latitude}, ${destCoord.longitude}]
        ];

        // Background shadow line
        L.polyline(routePoints, {
          color: '#1E40AF',
          weight: 7,
          opacity: 0.35,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);

        // Main blue route line
        var polyline = L.polyline(routePoints, {
          color: '#2563EB',
          weight: 5,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);

        map.fitBounds(polyline.getBounds(), { padding: [35, 35], maxZoom: 16 });
        ` : ''}

        ${showActiveDriver ? `
        // Moving Active Driver
        var driverEl = document.createElement('div');
        driverEl.className = 'driver-pin';
        driverEl.innerText = '${vehicleIcon}';
        var driverIcon = L.divIcon({
          className: '',
          html: driverEl.outerHTML,
          iconSize: [0, 0]
        });
        L.marker([${driverPos.latitude}, ${driverPos.longitude}], { icon: driverIcon }).addTo(map);
        ` : ''}

        ${routeStatus === 'idle' && !isDriverView ? `
        // Nearby Idle vehicles
        var nearby = [
          { lat: ${riderCoord.latitude + 0.0022}, lng: ${riderCoord.longitude + 0.0025}, icon: '🚗' },
          { lat: ${riderCoord.latitude - 0.0024}, lng: ${riderCoord.longitude - 0.0022}, icon: '🏍️' },
          { lat: ${riderCoord.latitude + 0.0018}, lng: ${riderCoord.longitude - 0.0028}, icon: '🚙' }
        ];
        nearby.forEach(function(item) {
          var iconEl = document.createElement('div');
          iconEl.className = 'idle-car';
          iconEl.innerText = item.icon;
          var customCar = L.divIcon({
            className: '',
            html: iconEl.outerHTML,
            iconSize: [0, 0]
          });
          L.marker([item.lat, item.lng], { icon: customCar }).addTo(map);
        });
        ` : ''}
      }
    } catch(err) {
      console.error(err);
      showFallback();
    }
  </script>
</body>
</html>`;
  }, [riderCoord, destCoord, showActiveDriver, vehicleIcon, driverPos, routeStatus, isDriverView]);

  return (
    <View style={[styles.container, { height }]}>
      {Platform.OS === 'web' ? (
        <iframe
          srcDoc={mapHtml}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Magic Ride Live Map"
        />
      ) : (
        <WebViewComp
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: mapHtml, baseUrl: 'https://magicride.app' }}
          style={styles.webView}
          onLoadEnd={() => setLoading(false)}
          onError={() => setLoading(false)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scrollEnabled={false}
          bounces={false}
          androidHardwareAccelerationDisabled={false}
          androidLayerType="hardware"
          mixedContentMode="always"
        />
      )}

      {/* Loading placeholder */}
      {loading && Platform.OS !== 'web' && (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color="#2563EB" />
          <Text style={styles.loaderText}>Loading Live Map...</Text>
        </View>
      )}

      {/* Floating map badge */}
      <View style={styles.floatingBadge}>
        <Text style={styles.floatingBadgeDot}>📍</Text>
        <Text style={styles.floatingBadgeText}>Kathmandu Live</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#E8ECEF',
    overflow: 'hidden',
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: '#E8ECEF',
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#E8ECEF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 5,
  },
  loaderText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  floatingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    elevation: 4,
    zIndex: 30,
  },
  floatingBadgeDot: {
    fontSize: 12,
  },
  floatingBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1A1A2E',
  },
});
