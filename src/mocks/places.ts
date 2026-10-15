import type { Place } from '../types';

// ─── Realistic Nepal & Kathmandu Valley Locations ────────────────────────────
export const MOCK_PLACES: Place[] = [
  // ─── Kathmandu Hubs & Landmarks ───────────────────────────
  {
    id: 'place-001',
    name: 'Tribhuvan International Airport (TIA)',
    address: 'Ring Road, Airport Gate, Kathmandu',
    shortAddress: 'TIA, Kathmandu',
    coordinate: { latitude: 27.6966, longitude: 85.3591 },
    category: 'popular',
  },
  {
    id: 'place-002',
    name: 'Thamel Tourist Hub',
    address: 'Thamel Marg, Ward 26, Kathmandu',
    shortAddress: 'Thamel, Kathmandu',
    coordinate: { latitude: 27.7154, longitude: 85.3123 },
    category: 'popular',
  },
  {
    id: 'place-003',
    name: 'Kathmandu Durbar Square',
    address: 'Basantapur, Freak Street, Kathmandu',
    shortAddress: 'Basantapur, KTM',
    coordinate: { latitude: 27.7042, longitude: 85.3072 },
    category: 'popular',
  },
  {
    id: 'place-004',
    name: 'Pashupatinath Temple',
    address: 'Pashupati Marg, Gaushala, Kathmandu',
    shortAddress: 'Gaushala, KTM',
    coordinate: { latitude: 27.7104, longitude: 85.3487 },
    category: 'popular',
  },
  {
    id: 'place-005',
    name: 'Boudhanath Stupa',
    address: 'Boudha Sadak, Ward 6, Kathmandu',
    shortAddress: 'Boudha, KTM',
    coordinate: { latitude: 27.7215, longitude: 85.3620 },
    category: 'popular',
  },
  {
    id: 'place-006',
    name: 'Swayambhunath Stupa (Monkey Temple)',
    address: 'Swayambhu, Ring Road, Kathmandu',
    shortAddress: 'Swayambhu, KTM',
    coordinate: { latitude: 27.7149, longitude: 85.2904 },
    category: 'popular',
  },
  {
    id: 'place-007',
    name: 'New Baneshwor (Parliament Square)',
    address: 'Baneshwor Chowk, Kathmandu',
    shortAddress: 'New Baneshwor, KTM',
    coordinate: { latitude: 27.6915, longitude: 85.3420 },
  },
  {
    id: 'place-008',
    name: 'Durbarmarg (Kingsway)',
    address: 'Durbarmarg, Narayanhiti Gate, Kathmandu',
    shortAddress: 'Durbarmarg, KTM',
    coordinate: { latitude: 27.7120, longitude: 85.3170 },
  },
  {
    id: 'place-009',
    name: 'New Road & Asan Bazar',
    address: 'Khichapokhari, New Road Gate, Kathmandu',
    shortAddress: 'New Road, KTM',
    coordinate: { latitude: 27.7032, longitude: 85.3125 },
  },
  {
    id: 'place-010',
    name: 'Kalanki Chowk Bus Terminal',
    address: 'Prithvi Highway Junction, Kalanki, Kathmandu',
    shortAddress: 'Kalanki, KTM',
    coordinate: { latitude: 27.6938, longitude: 85.2818 },
  },
  {
    id: 'place-011',
    name: 'Koteshwor Chowk',
    address: 'Araniko Highway / Ring Road, Kathmandu',
    shortAddress: 'Koteshwor, KTM',
    coordinate: { latitude: 27.6766, longitude: 85.3496 },
  },
  {
    id: 'place-012',
    name: 'Maharajgunj (Teaching Hospital)',
    address: 'Narayan Gopal Chowk, Ring Road, Kathmandu',
    shortAddress: 'Maharajgunj, KTM',
    coordinate: { latitude: 27.7360, longitude: 85.3308 },
  },
  {
    id: 'place-013',
    name: 'Balaju Bypass & Machhapokhari',
    address: 'Balaju Ring Road, Kathmandu',
    shortAddress: 'Balaju, KTM',
    coordinate: { latitude: 27.7335, longitude: 85.3032 },
  },
  {
    id: 'place-014',
    name: 'Budhanilkantha Temple',
    address: 'Budhanilkantha Sadak, Kathmandu',
    shortAddress: 'Budhanilkantha, KTM',
    coordinate: { latitude: 27.7788, longitude: 85.3614 },
  },
  {
    id: 'place-015',
    name: 'Chabahil Chowk & Stupa',
    address: 'Chabahil, Kathmandu',
    shortAddress: 'Chabahil, KTM',
    coordinate: { latitude: 27.7175, longitude: 85.3480 },
  },

  // ─── Lalitpur (Patan) ─────────────────────────────────────
  {
    id: 'place-016',
    name: 'Patan Durbar Square',
    address: 'Mangalbazar, Lalitpur',
    shortAddress: 'Patan, Lalitpur',
    coordinate: { latitude: 27.6727, longitude: 85.3253 },
    category: 'popular',
  },
  {
    id: 'place-017',
    name: 'Pulchowk & Jhamsikhel',
    address: 'Pulchowk Campus Rd, Jhamsikhel, Lalitpur',
    shortAddress: 'Jhamsikhel, Lalitpur',
    coordinate: { latitude: 27.6780, longitude: 85.3160 },
  },
  {
    id: 'place-018',
    name: 'Jawalakhel (Central Zoo)',
    address: 'Jawalakhel Roundabout, Lalitpur',
    shortAddress: 'Jawalakhel, Lalitpur',
    coordinate: { latitude: 27.6706, longitude: 85.3134 },
  },
  {
    id: 'place-019',
    name: 'Kupondole & Sanepa Heights',
    address: 'Kupondole Bridge, Lalitpur',
    shortAddress: 'Kupondole, Lalitpur',
    coordinate: { latitude: 27.6881, longitude: 85.3168 },
  },
  {
    id: 'place-020',
    name: 'Lagankhel Bus Park',
    address: 'Batuk Bhairab, Lagankhel, Lalitpur',
    shortAddress: 'Lagankhel, Lalitpur',
    coordinate: { latitude: 27.6660, longitude: 85.3228 },
  },

  // ─── Bhaktapur ────────────────────────────────────────────
  {
    id: 'place-021',
    name: 'Bhaktapur Durbar Square',
    address: 'Durbar Square, Bhaktapur',
    shortAddress: 'Durbar Sq, Bhaktapur',
    coordinate: { latitude: 27.6722, longitude: 85.4281 },
    category: 'popular',
  },
  {
    id: 'place-022',
    name: 'Sallaghari Chowk',
    address: 'Araniko Highway, Bhaktapur',
    shortAddress: 'Sallaghari, Bhaktapur',
    coordinate: { latitude: 27.6740, longitude: 85.4050 },
  },
  {
    id: 'place-023',
    name: 'Suryabinayak Temple',
    address: 'Suryabinayak Sadak, Bhaktapur',
    shortAddress: 'Suryabinayak, Bhaktapur',
    coordinate: { latitude: 27.6620, longitude: 85.4240 },
  },
  {
    id: 'place-024',
    name: 'Nagarkot View Tower',
    address: 'Nagarkot Hilltop, Bhaktapur',
    shortAddress: 'Nagarkot, Bhaktapur',
    coordinate: { latitude: 27.7175, longitude: 85.5200 },
  },

  // ─── Major Nepal Cities / Outstation Hubs ────────────────
  {
    id: 'place-025',
    name: 'Pokhara Lakeside (Phewa Lake)',
    address: 'Baidam, Lakeside Marg, Pokhara, Gandaki',
    shortAddress: 'Lakeside, Pokhara',
    coordinate: { latitude: 28.2096, longitude: 83.9595 },
    category: 'popular',
  },
  {
    id: 'place-026',
    name: 'Sauraha (Chitwan National Park)',
    address: 'Rapti Riverbank, Sauraha, Chitwan',
    shortAddress: 'Sauraha, Chitwan',
    coordinate: { latitude: 27.5816, longitude: 84.4984 },
  },
  {
    id: 'place-027',
    name: 'Bharatpur Central Hospital Chowk',
    address: 'East-West Highway, Bharatpur, Chitwan',
    shortAddress: 'Bharatpur, Chitwan',
    coordinate: { latitude: 27.6833, longitude: 84.4333 },
  },
  {
    id: 'place-028',
    name: 'Janakpurdham (Janaki Mandir)',
    address: 'Janakpur Temple Complex, Dhanusha, Madhesh',
    shortAddress: 'Janakpurdham, Madhesh',
    coordinate: { latitude: 26.7303, longitude: 85.9261 },
  },
  {
    id: 'place-029',
    name: 'Butwal Traffic Chowk',
    address: 'Siddhartha Highway, Butwal, Lumbini',
    shortAddress: 'Traffic Chowk, Butwal',
    coordinate: { latitude: 27.7006, longitude: 83.4655 },
  },
  {
    id: 'place-030',
    name: 'Lumbini (Birthplace of Buddha)',
    address: 'Mayadevi Temple Complex, Lumbini, Rupandehi',
    shortAddress: 'Mayadevi, Lumbini',
    coordinate: { latitude: 27.4839, longitude: 83.2759 },
  },
  {
    id: 'place-031',
    name: 'Dharan Clock Tower',
    address: 'Bhanu Chowk, Dharan, Sunsari, Koshi',
    shortAddress: 'Bhanu Chowk, Dharan',
    coordinate: { latitude: 26.8124, longitude: 87.2835 },
  },
  {
    id: 'place-032',
    name: 'Biratnagar Main Road',
    address: 'Traffic Chowk, Biratnagar, Koshi',
    shortAddress: 'Main Rd, Biratnagar',
    coordinate: { latitude: 26.4525, longitude: 87.2718 },
  },
  {
    id: 'place-033',
    name: 'Birgunj Ghantaghar',
    address: 'Clock Tower Square, Birgunj, Parsa',
    shortAddress: 'Ghantaghar, Birgunj',
    coordinate: { latitude: 27.0139, longitude: 84.8773 },
  },
  {
    id: 'place-034',
    name: 'Hetauda Buddha Chowk',
    address: 'Kantirajpath, Hetauda, Makwanpur',
    shortAddress: 'Buddha Chowk, Hetauda',
    coordinate: { latitude: 27.4282, longitude: 85.0322 },
  },
  {
    id: 'place-035',
    name: 'Nepalgunj BP Chowk',
    address: 'Surkhet Road, Nepalgunj, Banke',
    shortAddress: 'BP Chowk, Nepalgunj',
    coordinate: { latitude: 28.0538, longitude: 81.6190 },
  },
];

// ─── Saved places (for Rider's home screen shortcuts) ─────────────────────────
export const SAVED_PLACES: Place[] = [
  {
    id: 'saved-home',
    name: 'Home',
    address: 'Baneshwor Sadak, Kathmandu',
    shortAddress: 'New Baneshwor, KTM',
    coordinate: { latitude: 27.6915, longitude: 85.3420 },
    category: 'home',
  },
  {
    id: 'saved-work',
    name: 'Work',
    address: 'Durbarmarg, Narayanhiti Way, Kathmandu',
    shortAddress: 'Durbarmarg, KTM',
    coordinate: { latitude: 27.7120, longitude: 85.3170 },
    category: 'work',
  },
];

// ─── Recent searches (shown below saved places) ────────────────────────────────
export const RECENT_SEARCHES: Place[] = [
  MOCK_PLACES[0], // TIA Airport
  MOCK_PLACES[1], // Thamel
  MOCK_PLACES[15], // Patan Durbar Sq
];

// ─── Fixed dummy current location (Central Kathmandu) ─────────────────────────
export const DUMMY_CURRENT_LOCATION = {
  latitude: 27.7172,
  longitude: 85.3240,
};

// ─── Dummy route coordinates (Route through Central Kathmandu) ────────────────
export const DUMMY_ROUTE_COORDS = [
  { latitude: 27.7154, longitude: 85.3123 }, // Driver start (Thamel)
  { latitude: 27.7135, longitude: 85.3148 },
  { latitude: 27.7120, longitude: 85.3170 }, // Durbarmarg
  { latitude: 27.7060, longitude: 85.3210 }, // Putalisadak
  { latitude: 27.6980, longitude: 85.3310 }, // Maitighar
  { latitude: 27.6915, longitude: 85.3420 }, // New Baneshwor Pickup Point
];

