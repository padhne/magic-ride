import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BLUE = "#2563EB";

const SLIDES = [
  {
    key: "ride",
    image: require("../../../assets/images/onboarding-ride-phone.png"),
    badge: "🚗 Smart Ride Hailing",
    headline: "Ride Your Way",
    sub: "Request a car or motorcycle in seconds.\nFast pickups anywhere across Nepal.",
  },
  {
    key: "safe",
    image: require("../../../assets/images/onboarding-ride-front.png"),
    badge: "🛡️ Safe & Verified Drivers",
    headline: "Comfortable & Reliable",
    sub: "Enjoy upfront fair pricing and trusted\nNepal drivers for your daily journeys.",
  },
  {
    key: "bike",
    image: require("../../../assets/images/onboarding-ride-bike.png"),
    badge: "⚡ Beat The City Traffic",
    headline: "Instant Moto Rides",
    sub: "Quick and affordable bike rides\nto zip through Kathmandu streets in minutes.",
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  // Responsive illustration size
  const illustHeight = Math.min(
    270,
    Math.max(180, Math.round(SCREEN_HEIGHT * 0.32)),
  );

  const goTo = (idx: number) => {
    scrollRef.current?.scrollTo({ x: idx * SCREEN_WIDTH, animated: true });
    setPage(idx);
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newPage = Math.round(offsetX / SCREEN_WIDTH);
    if (newPage >= 0 && newPage < SLIDES.length) {
      setPage(newPage);
    }
  };

  const handleNext = () => {
    if (page < SLIDES.length - 1) {
      goTo(page + 1);
    } else {
      router.replace("/(auth)/role");
    }
  };

  const handleSkip = () => router.replace("/(auth)/role");

  const isLast = page === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── TOP HEADER BAR (Logo left, Skip button right) ──────────────── */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <Image
            source={require("../../../assets/images/magic-ride-logo.png")}
            style={styles.logoMini}
            resizeMode="cover"
          />
          <Text style={styles.brandName}>Magic Ride</Text>
        </View>

        <Pressable
          style={styles.skipPill}
          onPress={handleSkip}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.skipText}>Skip</Text>
          <Ionicons name="chevron-forward" size={14} color="#6B7280" />
        </Pressable>
      </View>

      {/* ── SWIPABLE SLIDES ────────────────────────────────────────────── */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        style={styles.slideScroll}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {SLIDES.map((slide) => (
          <View key={slide.key} style={styles.slide}>
            {/* Illustration area */}
            <View style={[styles.illustWrap, { height: illustHeight }]}>
              <View style={styles.ambientGlow} />
              <Image
                source={slide.image}
                style={[styles.illustImage, { height: illustHeight }]}
                resizeMode="contain"
              />
            </View>

            {/* Badge */}
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>{slide.badge}</Text>
            </View>

            {/* Headline & Subtitle */}
            <View style={styles.textContainer}>
              <Text style={styles.headline} numberOfLines={2}>
                {slide.headline}
              </Text>
              <Text style={styles.sub} numberOfLines={2}>
                {slide.sub}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ── GUARANTEED BOTTOM BAR ──────────────────────────────────────── */}
      <View
        style={[
          styles.bottomArea,
          { paddingBottom: Math.max(18, insets.bottom + 8) },
        ]}
      >
        {/* Page indicator dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <Pressable key={i} onPress={() => goTo(i)} hitSlop={8}>
              <View style={[styles.dot, i === page && styles.dotActive]} />
            </Pressable>
          ))}
        </View>

        {/* Primary Action Button */}
        <Button
          title={isLast ? "Get Started →" : "Next →"}
          variant="primary"
          size="lg"
          onPress={handleNext}
          style={{ width: "100%", marginBottom: 12 }}
        />

        {/* Login text link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginHint}>Already have an account? </Text>
          <Pressable onPress={() => router.push("/(auth)/phone")} hitSlop={6}>
            <Text style={styles.loginLink}>Log in</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
    zIndex: 10,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoMini: {
    width: 34,
    height: 34,
  },
  brandName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A2E",
    letterSpacing: -0.3,
  },
  skipPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 3,
  },
  skipText: {
    fontSize: 13,
    color: "#4B5563",
    fontWeight: "700",
  },

  slideScroll: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  illustWrap: {
    width: SCREEN_WIDTH - 48,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 16,
  },
  ambientGlow: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#EFF6FF",
    opacity: 0.8,
  },
  illustImage: {
    width: "100%",
  },

  badgePill: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  badgeText: {
    color: BLUE,
    fontSize: 12,
    fontWeight: "700",
  },

  textContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headline: {
    fontSize: 25,
    fontWeight: "800",
    color: "#1A1A2E",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  sub: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 21,
  },

  bottomArea: {
    paddingHorizontal: 24,
    paddingTop: 8,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  dotsRow: {
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
  },
  dotActive: {
    width: 26,
    height: 8,
    backgroundColor: BLUE,
    borderRadius: 4,
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  loginHint: {
    fontSize: 13,
    color: "#6B7280",
  },
  loginLink: {
    fontSize: 13,
    color: BLUE,
    fontWeight: "700",
  },
});
