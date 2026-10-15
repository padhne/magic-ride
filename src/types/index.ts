// ─── Central types for the entire MagicRide app ──────────────────────────────

export type UserRole = 'rider' | 'driver';

export interface User {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  role: UserRole;
  rating: number;
  totalTrips: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  rating: number;
  totalTrips: number;
  vehicleType: VehicleType;
  vehicleName: string;
  vehicleColor: string;
  plate: string;
  isOnline: boolean;
}

export type VehicleType = 'bike' | 'car' | 'premium';

export interface Place {
  id: string;
  name: string;
  address: string;
  shortAddress: string;
  coordinate: Coordinate;
  category?: 'home' | 'work' | 'recent' | 'popular';
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export type RideStatus =
  | 'idle'
  | 'searching'
  | 'requested'
  | 'accepted'
  | 'driver_arriving'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface RideRequest {
  id: string;
  riderId: string;
  riderName?: string;
  riderRating?: number;
  pickup: Place;
  destination: Place;
  vehicleType: VehicleType;
  paymentMethod: PaymentMethod;
  fare: number;
  distance: number; // km
  estimatedDuration: number; // minutes
  status: RideStatus;
  otp: string; // 4-digit OTP shown to rider
  createdAt: number;
}

export type PaymentMethod = 'cash' | 'wallet' | 'esewa' | 'khalti';

export interface VehicleOption {
  type: VehicleType;
  label: string;
  icon: string; // emoji icon
  fare: number;
  eta: number; // minutes
  description: string;
}

export interface RideHistoryItem {
  id: string;
  date: string;
  pickup: string;
  destination: string;
  fare: number;
  duration: number;
  vehicleType: VehicleType;
  driverName: string;
  rating: number;
  status: 'completed' | 'cancelled';
}

export interface Earnings {
  today: number;
  week: number;
  month: number;
  tripsToday: number;
  tripsWeek: number;
}

export interface EarningsEntry {
  id: string;
  date: string;
  trips: number;
  amount: number;
}

export type DemoMode = 'solo' | 'manual';
