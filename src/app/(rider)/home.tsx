import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MapSimulation } from '../../components/MapSimulation';
import { useRideStore } from '../../store/rideStore';
import { useAuthStore } from '../../store/authStore';
import { useDriverStore } from '../../store/driverStore';
import {
  searchPlaces,
  getVehicleOptions,
} from '../../services/mockService';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { MOCK_DRIVERS, getDriverByType } from '../../mocks/users';
import { MOCK_PLACES, DUMMY_CURRENT_LOCATION } from '../../mocks/places';
import { calculateFare } from '../../utils/fare';
import { formatFare } from '../../utils/formatters';
import type { Place, VehicleOption, VehicleType, PaymentMethod } from '../../types';

// ── Design tokens ──────────────────────────────────────────────────
const BLUE = '#2563EB';
const BLUE_LIGHT = '#EFF6FF';
const GRAY_BG = '#F5F7FA';
const TEXT_PRIMARY = '#1A1A2E';
const TEXT_MUTED = '#6B7280';
const BORDER = '#E5E7EB';
const WHITE = '#FFFFFF';
const RED = '#EF4444';

const REVIEW_TAGS = [
  'Smooth ride 🚗',
  'Polite driver 🤝',
  'Clean car ✨',
  'Safe driving 🛡️',
  'Quick pickup ⚡',
];

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: string; desc: string; badge?: string }[] = [
  { id: 'cash', label: 'Cash on Arrival', icon: '💵', desc: 'Pay physical cash to driver after ride', badge: 'Default' },
  { id: 'esewa', label: 'eSewa Mobile Wallet', icon: '🟢', desc: 'Nepal’s #1 digital wallet', badge: 'Popular' },
  { id: 'khalti', label: 'Khalti Digital Wallet', icon: '🟣', desc: 'Instant cashless wallet payment', badge: 'Fast' },
  { id: 'wallet', label: 'Magic Pay / Card', icon: '💳', desc: 'Pay with debit card or app wallet' },
];

export default function RiderHome() {
  const { user, demoMode, setRole } = useAuthStore();
  const {
    status,
    pickupPlace,
    destinationPlace,
    selectedVehicleType,
    selectedPayment,
    assignedDriver,
    currentRide,
    setPickup,
    setDestination,
    setVehicleType,
    setPayment,
    setAssignedDriver,
    setCurrentRide,
    transition,
    reset,
  } = useRideStore();

  const { setPendingRequest } = useDriverStore();

  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [vehicleOptions, setVehicleOptions] = useState<VehicleOption[]>([]);
  const [rating, setRating] = useState(5);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [selectedReviewTags, setSelectedReviewTags] = useState<string[]>([]);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const toggleReviewTag = (tag: string) => {
    setSelectedReviewTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitFeedback = () => {
    setFeedbackSubmitted(true);
    setTimeout(() => {
      reset();
      setFeedbackSubmitted(false);
      setComment('');
      setSelectedReviewTags([]);
    }, 1200);
  };

  // Set default pickup
  useEffect(() => {
    if (!pickupPlace) {
      setPickup({
        id: 'current-loc',
        name: 'Janakpur Railway Station',
        address: 'Janakpur Railway Station, Janakpur',
        shortAddress: 'Janakpur',
        coordinate: DUMMY_CURRENT_LOCATION,
      });
    }
  }, []);

  // Fetch vehicle options when destination chosen
  useEffect(() => {
    if (destinationPlace) {
      getVehicleOptions(4.5).then(setVehicleOptions);
    }
  }, [destinationPlace]);

  // Search handler
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      setIsSearching(true);
      searchPlaces(searchQuery).then((res) => {
        setSearchResults(res);
        setIsSearching(false);
      });
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Ride simulation timer
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (status === 'requested') {
      const fare = calculateFare(selectedVehicleType, 4.5);
      const payload = {
        id: `ride-${Date.now()}`,
        riderId: user?.id || 'rider-001',
        riderName: user?.name || 'Aarav Sharma',
        riderRating: user?.rating || 4.9,
        pickup: pickupPlace || MOCK_PLACES[0],
        destination: destinationPlace || MOCK_PLACES[1],
        vehicleType: selectedVehicleType,
        fare,
        distance: 4.5,
        estimatedDuration: 15,
        paymentMethod: selectedPayment,
        status: 'requested' as const,
        otp: '4821',
        createdAt: Date.now(),
      };
      setCurrentRide(payload);
      setPendingRequest(payload);
      if (demoMode === 'solo') {
        timer = setTimeout(() => {
          setAssignedDriver(getDriverByType(selectedVehicleType));
          transition('accepted');
        }, 3500);
      }
    } else if (status === 'accepted') {
      timer = setTimeout(() => transition('driver_arriving'), 2500);
    } else if (status === 'driver_arriving') {
      timer = setTimeout(() => transition('arrived'), 5000);
    } else if (status === 'arrived') {
      timer = setTimeout(() => transition('in_progress'), 4000);
    } else if (status === 'in_progress') {
      timer = setTimeout(() => transition('completed'), 8000);
    }
    return () => clearTimeout(timer);
  }, [status, demoMode]);

  const handleSelectDest = (place: Place) => {
    setDestination(place);
    setSearchVisible(false);
    setSearchQuery('');
    transition('searching');
  };

  const handleConfirmRide = () => transition('requested');
  const handleCancel = () => reset();

  const currentFare = selectedVehicleType === 'bike' ? 5.5 : selectedVehicleType === 'premium' ? 22.0 : 12.0;

  return (
    <View style={{ flex: 1, backgroundColor: GRAY_BG }}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* ── TOP HEADER ─────────────────────────────────────────────── */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: WHITE }}>
        <View style={styles.header}>
          {/* Logo */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
            <Image
              source={require('../../../assets/images/magic-ride-logo.png')}
              style={styles.logoMiniImg}
              resizeMode="cover"
            />
            <Text style={styles.brandName}>Magic Ride</Text>
          </View>

          {/* Right actions */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {/* Switch to driver */}
            <Pressable
              style={styles.switchPill}
              onPress={() => { setRole('driver'); router.replace('/(driver)/home'); }}
            >
              <Text style={styles.switchText}>🚗 Drive</Text>
            </Pressable>
            {/* Profile avatar */}
            <Pressable
              style={styles.avatar}
              onPress={() => router.push('/(rider)/profile' as any)}
            >
              <Text style={{ fontSize: 18 }}>👤</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      {/* ── MAP (Hidden on Completed to give full screen to Review) ── */}
      {status !== 'completed' && (
        <MapSimulation
          riderLocation={pickupPlace?.coordinate}
          destinationLocation={destinationPlace?.coordinate}
          routeStatus={status}
          vehicleType={selectedVehicleType}
          height={status === 'idle' ? 210 : 140}
        />
      )}

      {/* ── BOTTOM SHEET ───────────────────────────────────────────── */}
      <View style={[styles.sheet, status === 'completed' && { marginTop: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: status === 'searching' || status === 'completed' ? 140 : 64 }}
          >
          {/* ── IDLE: Home screen ─────────────────────────────────── */}
          {status === 'idle' && (
            <View>
              <Text style={styles.greeting}>Good morning, {user?.name?.split(' ')[0] || 'Samir'}</Text>
              <Text style={styles.greetingSub}>Where are you going?</Text>

              {/* Search bar */}
              <Pressable style={styles.searchBar} onPress={() => setSearchVisible(true)}>
                <View style={styles.searchDot} />
                <Text style={styles.searchPlaceholder}>Search destination</Text>
              </Pressable>

              {/* Prominent Book a Ride Button */}
              <Button
                title="Book a Ride Now 🚗"
                variant="primary"
                size="lg"
                onPress={() => setSearchVisible(true)}
                style={{ marginBottom: 20 }}
              />

              {/* Quick shortcuts */}
              <View style={styles.shortcuts}>
                <Pressable style={styles.shortcutItem} onPress={() => handleSelectDest(MOCK_PLACES[1])}>
                  <View style={[styles.shortcutIcon, { backgroundColor: '#EFF6FF' }]}>
                    <Text style={{ fontSize: 18 }}>🏠</Text>
                  </View>
                  <Text style={styles.shortcutLabel}>Home</Text>
                </Pressable>
                <Pressable style={styles.shortcutItem} onPress={() => handleSelectDest(MOCK_PLACES[4])}>
                  <View style={[styles.shortcutIcon, { backgroundColor: '#F0FDF4' }]}>
                    <Text style={{ fontSize: 18 }}>💼</Text>
                  </View>
                  <Text style={styles.shortcutLabel}>Work</Text>
                </Pressable>
                <Pressable style={styles.shortcutItem} onPress={() => setSearchVisible(true)}>
                  <View style={[styles.shortcutIcon, { backgroundColor: '#FFF7ED' }]}>
                    <Text style={{ fontSize: 18 }}>＋</Text>
                  </View>
                  <Text style={styles.shortcutLabel}>Add</Text>
                </Pressable>
              </View>

              {/* Safety promo banner */}
              <View style={styles.promoBanner}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.promoTitle}>Safe Rides{'\n'}Every Time</Text>
                  <Text style={styles.promoSub}>Your safety is our priority.</Text>
                </View>
                <Text style={{ fontSize: 36 }}>🛡️</Text>
              </View>
            </View>
          )}

          {/* ── SEARCHING: Pick vehicle ───────────────────────────── */}
          {status === 'searching' && (
            <View>
              {/* Location row */}
              <View style={styles.locationCard}>
                <View style={{ gap: 8 }}>
                  <View style={styles.locRow}>
                    <View style={[styles.locDot, { backgroundColor: BLUE }]} />
                    <Text style={styles.locText} numberOfLines={1}>{pickupPlace?.name || 'Current Location'}</Text>
                  </View>
                  <View style={styles.locDivider} />
                  <Pressable style={styles.locRow} onPress={() => setSearchVisible(true)}>
                    <View style={[styles.locDot, { backgroundColor: RED }]} />
                    <Text style={[styles.locText, { flex: 1 }]} numberOfLines={1}>{destinationPlace?.name}</Text>
                    <Text style={{ color: BLUE, fontSize: 12, fontWeight: '700' }}>Change</Text>
                  </Pressable>
                </View>
              </View>

              {/* Vehicle options */}
              {[
                { type: 'bike' as VehicleType, label: 'Magic Ride Go (Bike)', icon: '🏍️', fare: 'NPR 90', eta: '3 min', dist: '1.2 km' },
                { type: 'car' as VehicleType, label: 'Magic Ride Go (Car)', icon: '🚗', fare: 'NPR 180', eta: '4 min', dist: '1.2 km' },
                { type: 'premium' as VehicleType, label: 'Magic Premium', icon: '🚙', fare: 'NPR 350', eta: '5 min', dist: '1.2 km' },
              ].map((item) => {
                const sel = selectedVehicleType === item.type;
                return (
                  <Pressable
                    key={item.type}
                    style={[styles.vehicleCard, sel && styles.vehicleCardSel]}
                    onPress={() => {
                      if (sel) {
                        handleConfirmRide();
                      } else {
                        setVehicleType(item.type);
                      }
                    }}
                  >
                    <Text style={{ fontSize: 28 }}>{item.icon}</Text>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.vehicleName}>{item.label}</Text>
                      <Text style={styles.vehicleMeta}>{item.eta} · {item.dist}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 4 }}>
                      <Text style={styles.vehicleFare}>{item.fare}</Text>
                      {sel && (
                        <TouchableOpacity
                          style={styles.bookNowChip}
                          onPress={handleConfirmRide}
                        >
                          <Text style={styles.bookNowChipText}>Start Ride ➔</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </Pressable>
                );
              })}

              {/* Payment selector - Interactive button */}
              <Pressable
                style={styles.payRow}
                onPress={() => setPaymentModalVisible(true)}
              >
                <Text style={{ fontSize: 22 }}>
                  {selectedPayment === 'esewa'
                    ? '🟢'
                    : selectedPayment === 'khalti'
                    ? '🟣'
                    : selectedPayment === 'wallet'
                    ? '💳'
                    : '💵'}
                </Text>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.payLabel}>
                    {selectedPayment === 'esewa'
                      ? 'eSewa Mobile Wallet'
                      : selectedPayment === 'khalti'
                      ? 'Khalti Digital Wallet'
                      : selectedPayment === 'wallet'
                      ? 'Magic Pay / Card'
                      : 'Cash on Arrival'}
                  </Text>
                  <Text style={styles.paySub}>
                    {selectedPayment === 'cash' ? 'Pay cash to driver' : 'Instant digital payment'}
                  </Text>
                </View>
                <View style={styles.changeBadge}>
                  <Text style={styles.changeText}>Change ›</Text>
                </View>
              </Pressable>

              {/* Prominent Request Ride Button */}
              <Button
                title={`Request ${
                  selectedVehicleType === 'bike'
                    ? 'Moto (NPR 90)'
                    : selectedVehicleType === 'premium'
                    ? 'Premium (NPR 350)'
                    : 'Car (NPR 180)'
                } ➔`}
                variant="primary"
                size="lg"
                onPress={handleConfirmRide}
                style={{ marginTop: 4, marginBottom: 8 }}
              />
            </View>
          )}

          {/* ── REQUESTED: Finding driver ─────────────────────────── */}
          {status === 'requested' && (
            <View style={styles.centeredCard}>
              <ActivityIndicator size="large" color={BLUE} style={{ marginBottom: 16 }} />
              <Text style={styles.cardTitle}>Looking for a driver...</Text>
              <Text style={styles.cardSub}>
                {demoMode === 'solo' ? 'Nearby drivers are checking your request.' : 'Switch to Driver tab to accept!'}
              </Text>
              <Button
                title="Cancel Request"
                variant="outline"
                size="md"
                onPress={handleCancel}
              />
            </View>
          )}

          {/* ── ACCEPTED / ARRIVING / ARRIVED: Driver details ─────── */}
          {(status === 'accepted' || status === 'driver_arriving' || status === 'arrived') && (
            <View>
              {/* ETA tag */}
              <View style={styles.etaBar}>
                <Text style={styles.etaText}>
                  {status === 'arrived' ? '🚗 Driver Arrived!' : 'Driver found'}
                </Text>
                <Text style={styles.etaSub}>
                  {status === 'arrived' ? 'Waiting for you' : '3 min · 0.6 km'}
                </Text>
              </View>

              {/* Driver card */}
              <View style={styles.driverCard}>
                <View style={styles.driverAvatar}>
                  <Text style={{ fontSize: 28 }}>👨</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.driverName}>{assignedDriver?.name || 'Ram Bahadur Gurung'}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={{ color: '#F59E0B', fontSize: 12 }}>⭐</Text>
                    <Text style={styles.driverMeta}>{assignedDriver?.rating || 4.9} ({assignedDriver?.totalTrips || 420} rides)</Text>
                  </View>
                  <Text style={styles.driverPlate}>{assignedDriver?.vehicleName || 'Maruti Suzuki Alto 800 (Taxi)'} · {assignedDriver?.plate || 'BA 2 JA 3921'}</Text>
                </View>
                <Text style={styles.fareTag}>{formatFare(currentRide?.fare || 250)}</Text>
              </View>

              {/* Action buttons */}
              <View style={styles.actionRow}>
                <Pressable style={styles.actionBtn} onPress={() => Alert.alert('Call', `Calling ${assignedDriver?.name}...`)}>
                  <Text style={{ fontSize: 18 }}>📞</Text>
                  <Text style={styles.actionLabel}>Call</Text>
                </Pressable>
                <Pressable style={styles.actionBtn} onPress={() => Alert.alert('Message', 'Chat demo')}>
                  <Text style={{ fontSize: 18 }}>💬</Text>
                  <Text style={styles.actionLabel}>Message</Text>
                </Pressable>
              </View>

              <Button
                title="Cancel Ride"
                variant="outline"
                size="md"
                onPress={handleCancel}
                style={{ marginTop: 8 }}
              />
            </View>
          )}

          {/* ── IN PROGRESS ───────────────────────────────────────── */}
          {status === 'in_progress' && (
            <View>
              <View style={styles.etaBar}>
                <Text style={styles.etaText}>On Trip</Text>
                <Text style={styles.etaSub}>3 min · 1.1 km remaining</Text>
              </View>

              <View style={styles.driverCard}>
                <View style={styles.driverAvatar}>
                  <Text style={{ fontSize: 28 }}>👨</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.driverName}>{assignedDriver?.name || 'Ram Bahadur Gurung'}</Text>
                  <Text style={styles.driverMeta}>{assignedDriver?.vehicleName || 'Maruti Suzuki Alto 800 (Taxi)'}</Text>
                  <Text style={styles.driverPlate}>{assignedDriver?.plate || 'BA 2 JA 3921'}</Text>
                </View>
                <Text style={styles.fareTag}>{formatFare(currentRide?.fare || 250)}</Text>
              </View>

              <View style={styles.tripInfoCard}>
                <View style={styles.tripRow}>
                  <Text style={{ color: BLUE, fontSize: 16, marginRight: 8 }}>📍</Text>
                  <View>
                    <Text style={styles.tripRowLabel}>From</Text>
                    <Text style={styles.tripRowValue}>{pickupPlace?.name}</Text>
                  </View>
                </View>
                <View style={[styles.tripRow, { marginTop: 12 }]}>
                  <Text style={{ color: RED, fontSize: 16, marginRight: 8 }}>📍</Text>
                  <View>
                    <Text style={styles.tripRowLabel}>To</Text>
                    <Text style={styles.tripRowValue}>{destinationPlace?.name}</Text>
                  </View>
                </View>
                <View style={styles.fareRow}>
                  <Text style={styles.fareLabel}>NPR Fare</Text>
                  <Text style={styles.fareAmount}>NPR 180</Text>
                </View>
              </View>

              <Button
                title="End Trip"
                variant="danger"
                size="lg"
                onPress={() => transition('completed')}
              />
            </View>
          )}

          {/* ── COMPLETED ─────────────────────────────────────────── */}
          {status === 'completed' && (
            <View style={styles.completedCard}>
              <View style={styles.completedCheck}>
                <Text style={{ fontSize: 32, color: WHITE }}>✓</Text>
              </View>
              <Text style={styles.completedTitle}>Trip Completed!</Text>
              <Text style={styles.completedSub}>Thank you for riding with us</Text>

              <View style={styles.driverCard}>
                <View style={styles.driverAvatar}>
                  <Text style={{ fontSize: 28 }}>👨</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.driverName}>{assignedDriver?.name || 'Ramesh Thapa'}</Text>
                  <View style={{ flexDirection: 'row', gap: 4 }}>
                    <Text style={{ color: '#F59E0B', fontSize: 12 }}>⭐</Text>
                    <Text style={styles.driverMeta}>{assignedDriver?.rating || 4.8}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <Pressable style={styles.smallBtn} onPress={() => Alert.alert('Call', '')}>
                    <Text style={styles.smallBtnText}>Call</Text>
                  </Pressable>
                  <Pressable style={styles.smallBtn} onPress={() => Alert.alert('Message', '')}>
                    <Text style={styles.smallBtnText}>Message</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.tripInfoCard}>
                <View style={styles.tripRow}>
                  <Text style={{ color: BLUE, fontSize: 16, marginRight: 8 }}>📍</Text>
                  <View>
                    <Text style={styles.tripRowLabel}>Going to</Text>
                    <Text style={styles.tripRowValue}>{destinationPlace?.name}</Text>
                  </View>
                </View>
                <View style={[styles.tripRow, { marginTop: 12 }]}>
                  <Text style={{ color: RED, fontSize: 16, marginRight: 8 }}>📍</Text>
                  <View>
                    <Text style={styles.tripRowLabel}>To</Text>
                    <Text style={styles.tripRowValue}>{destinationPlace?.name}</Text>
                  </View>
                </View>
                <View style={styles.fareRow}>
                  <Text style={styles.fareLabel}>Total Fare</Text>
                  <Text style={styles.fareAmount}>{formatFare(currentRide?.fare || 250)}</Text>
                </View>
              </View>

              {/* Rating Section */}
              <Text style={styles.ratingSectionTitle}>Rate your driver</Text>
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Pressable key={s} onPress={() => setRating(s)} style={styles.starBtn}>
                    <Text style={{ fontSize: 32 }}>{s <= rating ? '⭐' : '☆'}</Text>
                  </Pressable>
                ))}
              </View>

              {/* Quick Feedback Chips */}
              <Text style={styles.commentLabel}>What went well?</Text>
              <View style={styles.tagWrap}>
                {REVIEW_TAGS.map((tag) => {
                  const sel = selectedReviewTags.includes(tag);
                  return (
                    <Pressable
                      key={tag}
                      style={[styles.tagChip, sel && styles.tagChipSel]}
                      onPress={() => toggleReviewTag(tag)}
                    >
                      <Text style={[styles.tagText, sel && styles.tagTextSel]}>{tag}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Comment Input */}
              <View style={styles.commentBox}>
                <TextInput
                  style={styles.commentInput}
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Write a comment or feedback for your driver..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  maxLength={150}
                />
                <Text style={styles.charCount}>{comment.length}/150</Text>
              </View>

              {/* Submit Feedback Button */}
              <Button
                title={feedbackSubmitted ? 'Thank You! Feedback Saved ✓' : 'Submit Feedback & Done'}
                variant={feedbackSubmitted ? 'success' : 'primary'}
                size="lg"
                onPress={handleSubmitFeedback}
              />
            </View>
          )}
        </ScrollView>
        </KeyboardAvoidingView>
      </View>

      {/* ── DOCKED BOTTOM BAR (Always visible above device nav bar) ── */}
      {status === 'searching' && (
        <SafeAreaView edges={['bottom']} style={styles.dockedBottomBar}>
          <TouchableOpacity
            style={styles.dockedBtn}
            onPress={handleConfirmRide}
            activeOpacity={0.88}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.dockedBtnSub}>CONFIRM & START RIDE</Text>
              <Text style={styles.dockedBtnTitle}>
                {selectedVehicleType === 'bike'
                  ? 'Request Magic Ride Go · NPR 90'
                  : selectedVehicleType === 'premium'
                  ? 'Request Magic Premium · NPR 350'
                  : 'Request Magic Ride Go · NPR 180'}
              </Text>
            </View>
            <Ionicons name="arrow-forward-circle" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        </SafeAreaView>
      )}

      {/* ── DOCKED BOTTOM BAR (Feedback Submit — Guaranteed 100% visible) ── */}
      {status === 'completed' && (
        <SafeAreaView edges={['bottom']} style={styles.dockedBottomBar}>
          <TouchableOpacity
            style={[styles.dockedBtn, feedbackSubmitted && { backgroundColor: '#22C55E' }]}
            onPress={handleSubmitFeedback}
            activeOpacity={0.88}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.dockedBtnSub}>
                {feedbackSubmitted ? 'FEEDBACK RECORDED' : 'SUBMIT DRIVER REVIEW'}
              </Text>
              <Text style={styles.dockedBtnTitle}>
                {feedbackSubmitted ? 'Thank You! Returning to Home ✓' : 'Submit Feedback & Done ➔'}
              </Text>
            </View>
            <Ionicons
              name={feedbackSubmitted ? 'checkmark-circle' : 'arrow-forward-circle'}
              size={30}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </SafeAreaView>
      )}

      {/* ── SEARCH MODAL ───────────────────────────────────────────── */}
      <Modal visible={searchVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSearchVisible(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: WHITE }}>
          <View style={styles.modalHeader}>
            <Pressable style={styles.back} onPress={() => setSearchVisible(false)}>
              <Text style={styles.backArrow}>‹</Text>
            </Pressable>
            <Text style={styles.modalTitle}>Choose Destination</Text>
          </View>

          <View style={styles.modalSearchBar}>
            <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
            <TextInput
              style={styles.modalInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search places..."
              placeholderTextColor="#9CA3AF"
              autoFocus
            />
          </View>

          <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
            {isSearching ? (
              <ActivityIndicator color={BLUE} style={{ marginTop: 24 }} />
            ) : (searchResults.length > 0 ? searchResults : MOCK_PLACES).map((place) => (
              <Pressable
                key={place.id}
                style={styles.placeRow}
                onPress={() => handleSelectDest(place)}
              >
                <View style={styles.placeIcon}>
                  <Text style={{ fontSize: 14 }}>📍</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.placeName}>{place.name}</Text>
                  <Text style={styles.placeAddr} numberOfLines={1}>{place.address}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ── PAYMENT METHOD MODAL ────────────────────────────────────── */}
      <Modal
        visible={paymentModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setPaymentModalVisible(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHandle} />
            <View style={styles.payModalHeader}>
              <View>
                <Text style={styles.payModalTitle}>Payment Method</Text>
                <Text style={styles.payModalSub}>Select how you would like to pay</Text>
              </View>
              <Pressable
                style={styles.closeBtn}
                onPress={() => setPaymentModalVisible(false)}
              >
                <Ionicons name="close" size={20} color={TEXT_PRIMARY} />
              </Pressable>
            </View>

            <View style={{ gap: 10, marginTop: 16 }}>
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedPayment === method.id;
                return (
                  <Pressable
                    key={method.id}
                    style={[styles.payOptionCard, isSelected && styles.payOptionCardSel]}
                    onPress={() => {
                      setPayment(method.id);
                      setPaymentModalVisible(false);
                    }}
                  >
                    <View style={styles.payOptionIcon}>
                      <Text style={{ fontSize: 24 }}>{method.icon}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={[styles.payOptionLabel, isSelected && { color: BLUE }]}>
                          {method.label}
                        </Text>
                        {method.badge && (
                          <View style={styles.methodBadge}>
                            <Text style={styles.methodBadgeText}>{method.badge}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.payOptionDesc}>{method.desc}</Text>
                    </View>
                    <Ionicons
                      name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                      size={22}
                      color={isSelected ? BLUE : '#D1D5DB'}
                    />
                  </Pressable>
                );
              })}
            </View>

            <Button
              title="Confirm Payment Method"
              variant="primary"
              size="lg"
              onPress={() => setPaymentModalVisible(false)}
              style={{ marginTop: 20 }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // Header
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  logoMiniImg:    { width: 34, height: 34, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  logoMini:       { width: 30, height: 30, borderRadius: 8, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center' },
  logoLetter:     { color: WHITE, fontWeight: '900', fontSize: 16 },
  brandName:      { fontSize: 16, fontWeight: '800', color: TEXT_PRIMARY },
  switchPill:     { backgroundColor: BLUE_LIGHT, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: BLUE + '30' },
  switchText:     { fontSize: 12, fontWeight: '700', color: BLUE },
  avatar:         { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },

  // Sheet
  sheet:          { flex: 1, backgroundColor: WHITE, borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -16, paddingHorizontal: 20, paddingTop: 16 },

  // Idle
  greeting:       { fontSize: 20, fontWeight: '800', color: TEXT_PRIMARY, marginBottom: 2 },
  greetingSub:    { fontSize: 13, color: TEXT_MUTED, marginBottom: 16 },
  searchBar:      { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20, borderWidth: 1, borderColor: BORDER },
  searchDot:      { width: 10, height: 10, borderRadius: 5, backgroundColor: BLUE, marginRight: 12 },
  searchPlaceholder: { fontSize: 15, color: TEXT_MUTED },
  shortcuts:      { flexDirection: 'row', gap: 12, marginBottom: 20 },
  shortcutItem:   { flex: 1, alignItems: 'center', gap: 6 },
  shortcutIcon:   { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  shortcutLabel:  { fontSize: 12, fontWeight: '600', color: TEXT_PRIMARY },
  promoBanner:    { backgroundColor: BLUE_LIGHT, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: BLUE + '20' },
  promoTitle:     { fontSize: 15, fontWeight: '800', color: TEXT_PRIMARY, marginBottom: 4 },
  promoSub:       { fontSize: 12, color: TEXT_MUTED },

  // Location card
  locationCard:   { backgroundColor: WHITE, borderRadius: 14, padding: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2, borderWidth: 1, borderColor: BORDER },
  locRow:         { flexDirection: 'row', alignItems: 'center', gap: 10 },
  locDot:         { width: 10, height: 10, borderRadius: 5 },
  locText:        { fontSize: 14, fontWeight: '600', color: TEXT_PRIMARY },
  locDivider:     { height: 1, backgroundColor: BORDER, marginLeft: 20 },

  // Vehicle cards
  vehicleCard:    { flexDirection: 'row', alignItems: 'center', backgroundColor: WHITE, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8, borderWidth: 1.5, borderColor: BORDER },
  vehicleCardSel: { borderColor: BLUE, backgroundColor: BLUE_LIGHT },
  vehicleName:    { fontSize: 15, fontWeight: '700', color: TEXT_PRIMARY },
  vehicleMeta:    { fontSize: 12, color: TEXT_MUTED, marginTop: 2 },
  vehicleFare:    { fontSize: 15, fontWeight: '800', color: TEXT_PRIMARY },
  bookNowChip:    { backgroundColor: BLUE, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  bookNowChipText: { color: WHITE, fontSize: 11, fontWeight: '800' },

  // Payment
  payRow:         { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12, borderWidth: 1, borderColor: BORDER },
  payLabel:       { fontSize: 14, fontWeight: '700', color: TEXT_PRIMARY },
  paySub:         { fontSize: 11, color: TEXT_MUTED, marginTop: 1 },
  changeBadge:    { backgroundColor: BLUE_LIGHT, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  changeText:     { color: BLUE, fontSize: 12, fontWeight: '700' },

  // Docked Bottom Bar
  dockedBottomBar: { backgroundColor: WHITE, borderTopWidth: 1, borderTopColor: BORDER, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 10 },
  dockedBtn:      { backgroundColor: BLUE, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dockedBtnSub:   { color: 'rgba(255, 255, 255, 0.75)', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  dockedBtnTitle: { color: WHITE, fontSize: 15, fontWeight: '800', marginTop: 2 },

  // Payment Modal
  modalOverlay:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent:   { backgroundColor: WHITE, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 34 },
  sheetHandle:    { width: 38, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', alignSelf: 'center', marginBottom: 14 },
  payModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  payModalTitle:  { fontSize: 18, fontWeight: '800', color: TEXT_PRIMARY },
  payModalSub:    { fontSize: 13, color: TEXT_MUTED, marginTop: 2 },
  closeBtn:       { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  payOptionCard:  { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 14, padding: 12, borderWidth: 1.5, borderColor: BORDER },
  payOptionCardSel: { backgroundColor: BLUE_LIGHT, borderColor: BLUE },
  payOptionIcon:  { width: 42, height: 42, borderRadius: 12, backgroundColor: WHITE, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: BORDER },
  payOptionLabel: { fontSize: 14, fontWeight: '700', color: TEXT_PRIMARY },
  payOptionDesc:  { fontSize: 11, color: TEXT_MUTED, marginTop: 2 },
  methodBadge:    { backgroundColor: '#DBEAFE', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  methodBadgeText: { fontSize: 10, fontWeight: '700', color: BLUE },

  // CTA
  cta:            { backgroundColor: BLUE, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  ctaText:        { color: WHITE, fontWeight: '700', fontSize: 16 },

  // Centered card (searching)
  centeredCard:   { backgroundColor: WHITE, borderRadius: 20, padding: 28, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  cardTitle:      { fontSize: 18, fontWeight: '800', color: TEXT_PRIMARY, marginBottom: 8, textAlign: 'center' },
  cardSub:        { fontSize: 13, color: TEXT_MUTED, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  cancelBtn:      { borderWidth: 1, borderColor: BORDER, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 10 },
  cancelText:     { fontSize: 14, color: TEXT_MUTED, fontWeight: '600' },

  // ETA bar
  etaBar:         { backgroundColor: BLUE_LIGHT, borderRadius: 14, padding: 14, marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: BLUE + '25' },
  etaText:        { fontSize: 15, fontWeight: '800', color: TEXT_PRIMARY },
  etaSub:         { fontSize: 12, color: TEXT_MUTED },

  // Driver card
  driverCard:     { backgroundColor: WHITE, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 14, borderWidth: 1, borderColor: BORDER },
  driverAvatar:   { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  driverName:     { fontSize: 15, fontWeight: '700', color: TEXT_PRIMARY, marginBottom: 2 },
  driverMeta:     { fontSize: 12, color: TEXT_MUTED },
  driverPlate:    { fontSize: 11, color: TEXT_MUTED, marginTop: 2 },
  fareTag:        { fontSize: 15, fontWeight: '800', color: TEXT_PRIMARY },

  // Action row
  actionRow:      { flexDirection: 'row', gap: 10, marginBottom: 14 },
  actionBtn:      { flex: 1, alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingVertical: 12, gap: 4, borderWidth: 1, borderColor: BORDER },
  actionLabel:    { fontSize: 12, fontWeight: '600', color: TEXT_PRIMARY },

  // Trip info
  tripInfoCard:   { backgroundColor: WHITE, borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: BORDER },
  tripRow:        { flexDirection: 'row', alignItems: 'flex-start' },
  tripRowLabel:   { fontSize: 11, color: TEXT_MUTED, marginBottom: 2 },
  tripRowValue:   { fontSize: 13, fontWeight: '700', color: TEXT_PRIMARY },
  fareRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: BORDER },
  fareLabel:      { fontSize: 13, color: TEXT_MUTED },
  fareAmount:     { fontSize: 16, fontWeight: '800', color: TEXT_PRIMARY },

  // Completed
  completedCard:  { alignItems: 'center' },
  completedCheck: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#22C55E', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  completedTitle: { fontSize: 22, fontWeight: '800', color: TEXT_PRIMARY, marginBottom: 6 },
  completedSub:   { fontSize: 13, color: TEXT_MUTED, marginBottom: 18 },
  ratingSectionTitle: { fontSize: 15, fontWeight: '700', color: TEXT_PRIMARY, marginBottom: 8 },
  ratingRow:      { flexDirection: 'row', gap: 6, marginBottom: 16 },
  starBtn:        { padding: 4 },
  commentLabel:   { fontSize: 13, fontWeight: '700', color: TEXT_PRIMARY, marginBottom: 8, alignSelf: 'flex-start' },
  tagWrap:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16, width: '100%' },
  tagChip:        { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: BORDER },
  tagChipSel:     { backgroundColor: BLUE_LIGHT, borderColor: BLUE },
  tagText:        { fontSize: 12, color: TEXT_MUTED, fontWeight: '600' },
  tagTextSel:     { color: BLUE, fontWeight: '700' },
  commentBox:     { width: '100%', backgroundColor: '#F9FAFB', borderRadius: 14, borderWidth: 1, borderColor: BORDER, padding: 12, marginBottom: 18 },
  commentInput:   { fontSize: 14, color: TEXT_PRIMARY, minHeight: 64, textAlignVertical: 'top' },
  charCount:      { fontSize: 11, color: TEXT_MUTED, alignSelf: 'flex-end', marginTop: 4 },
  smallBtn:       { borderWidth: 1, borderColor: BORDER, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10 },
  smallBtnText:   { fontSize: 12, color: TEXT_PRIMARY, fontWeight: '600' },

  // Modal
  modalHeader:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: BORDER },
  back:           { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  backArrow:      { fontSize: 22, color: TEXT_PRIMARY, marginTop: -2 },
  modalTitle:     { fontSize: 18, fontWeight: '800', color: TEXT_PRIMARY },
  modalSearchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, marginHorizontal: 20, marginVertical: 14, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: BORDER },
  modalInput:     { flex: 1, fontSize: 15, color: TEXT_PRIMARY },
  placeRow:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: BORDER + '80', gap: 12 },
  placeIcon:      { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  placeName:      { fontSize: 14, fontWeight: '700', color: TEXT_PRIMARY, marginBottom: 2 },
  placeAddr:      { fontSize: 12, color: TEXT_MUTED },

  // Demo mode fallback
  BLUE_LIGHT,
  BLUE,
} as any);
