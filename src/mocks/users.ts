import type { User, Driver } from '../types';

// ─── Dummy Rider (Nepal) ──────────────────────────────────────────────────────
export const MOCK_RIDER: User = {
  id: 'rider-001',
  name: 'Aarav Sharma',
  phone: '+977 9812345678',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  role: 'rider',
  rating: 4.9,
  totalTrips: 48,
};

// ─── Dummy Drivers Pool (Nepal Vehicles & Plates) ──────────────────────────────
export const MOCK_DRIVERS: Driver[] = [
  {
    id: 'driver-001',
    name: 'Ram Bahadur Gurung',
    phone: '+977 9801234568',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    rating: 4.85,
    totalTrips: 420,
    vehicleType: 'car',
    vehicleName: 'Maruti Suzuki Alto 800 (Taxi)',
    vehicleColor: 'White & Black',
    plate: 'BA 2 JA 3921',
    isOnline: true,
  },
  {
    id: 'driver-002',
    name: 'Suresh Shrestha',
    phone: '+977 9841234567',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 4.92,
    totalTrips: 630,
    vehicleType: 'bike',
    vehicleName: 'Bajaj Pulsar 220F',
    vehicleColor: 'Matte Blue',
    plate: 'BA 25 PA 7842',
    isOnline: true,
  },
  {
    id: 'driver-003',
    name: 'Dipak Adhikari',
    phone: '+977 9851234569',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    rating: 5.0,
    totalTrips: 310,
    vehicleType: 'premium',
    vehicleName: 'BYD Atto 3 EV',
    vehicleColor: 'Pearl White',
    plate: 'BA PRA 01-025 CHA 5512',
    isOnline: true,
  },
];

export const getDriverByType = (type: string): Driver =>
  MOCK_DRIVERS.find((d) => d.vehicleType === type) ?? MOCK_DRIVERS[0];
