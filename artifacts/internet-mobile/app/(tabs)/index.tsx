import React, { useRef } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { ISP_PLANS, formatGift, type IspPlan } from '@/constants/ispData';

function CarrierCard({ isp, onPress }: { isp: IspPlan; onPress: () => void }) {
  const colors = useColors();
  const scale = useRef(new Animated.Value(1)).current;
  const maxGift = Math.max(...isp.plans.map((p) => p.gift));

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[styles.carrierCard, { backgroundColor: colors.card, borderColor: colors.border, transform: [{ scale }] }]}>
        {/* Color accent bar */}
        <View style={[styles.cardAccent, { backgroundColor: isp.color }]} />
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <View style={[styles.ispBadge, { backgroundColor: isp.color + '15' }]}>
              <Text style={[styles.ispBadgeText, { color: isp.color }]}>{isp.shortName}</Text>
            </View>
            {isp.popular && (
              <View style={[styles.popularTag, { backgroundColor: '#F97316' }]}>
                <Text style={styles.popularTagText}>인기</Text>
              </View>
            )}
          </View>
          <Text style={[styles.ispName, { color: colors.foreground }]}>{isp.name}</Text>
          <Text style={[styles.planCount, { color: colors.mutedForeground }]}>
            {isp.plans.length}가지 요금제
          </Text>
          <View style={styles.giftRow}>
            <Ionicons name="gift-outline" size={14} color={isp.color} />
            <Text style={[styles.giftAmount, { color: isp.color }]}>최대 {formatGift(maxGift)} 사은품</Text>
          </View>
        </View>
        <View style={styles.cardArrow}>
          <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Hero */}
      <LinearGradient
        colors={['#F97316', '#fb923c', '#fdba74']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { paddingTop: topPad + 20 }]}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroEyebrow}>AI인터넷.COM</Text>
          <Text style={styles.heroTitle}>인터넷 사은품{'\n'}최대 비교</Text>
          <Text style={styles.heroSubtitle}>가입 시 최대 27만원 사은품 지급</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5개</Text>
            <Text style={styles.statLabel}>통신사</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>20+</Text>
            <Text style={styles.statLabel}>요금제</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>무료</Text>
            <Text style={styles.statLabel}>상담 신청</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Carrier List */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: (isWeb ? 34 : insets.bottom) + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>통신사 선택</Text>
        <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>
          원하는 통신사를 선택하여 요금제를 확인하세요
        </Text>
        {ISP_PLANS.map((isp) => (
          <CarrierCard
            key={isp.key}
            isp={isp}
            onPress={() => router.push({ pathname: '/(tabs)/compare', params: { carrier: isp.key } })}
          />
        ))}

        {/* CTA Banner */}
        <Pressable
          onPress={() => router.push('/(tabs)/apply')}
          style={({ pressed }) => [styles.ctaBanner, { opacity: pressed ? 0.85 : 1 }]}
        >
          <LinearGradient
            colors={['#F97316', '#F59E0B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <View>
              <Text style={styles.ctaTitle}>지금 바로 상담 신청</Text>
              <Text style={styles.ctaSub}>전문 상담사가 최적 요금제를 찾아드립니다</Text>
            </View>
            <Ionicons name="arrow-forward-circle" size={32} color="#FFFFFF" />
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { paddingHorizontal: 20, paddingBottom: 28 },
  heroContent: { marginBottom: 20 },
  heroEyebrow: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: 'rgba(255,255,255,0.85)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 },
  heroTitle: { fontSize: 30, fontFamily: 'Inter_700Bold', color: '#FFFFFF', lineHeight: 36, marginBottom: 6 },
  heroSubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.9)' },
  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 8 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#FFFFFF', marginBottom: 2 },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.85)' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginVertical: 4 },
  scroll: { flex: 1, marginTop: -12 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20 },
  sectionTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  sectionSub: { fontSize: 13, fontFamily: 'Inter_400Regular', marginBottom: 16 },
  carrierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
  },
  cardAccent: { width: 5, alignSelf: 'stretch' },
  cardBody: { flex: 1, paddingVertical: 14, paddingHorizontal: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  ispBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  ispBadgeText: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  popularTag: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  popularTagText: { fontSize: 10, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
  ispName: { fontSize: 15, fontFamily: 'Inter_600SemiBold', marginBottom: 2 },
  planCount: { fontSize: 12, fontFamily: 'Inter_400Regular', marginBottom: 6 },
  giftRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  giftAmount: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  cardArrow: { paddingRight: 14 },
  ctaBanner: { marginTop: 8, borderRadius: 16, overflow: 'hidden' },
  ctaGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18, paddingHorizontal: 20 },
  ctaTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#FFFFFF', marginBottom: 3 },
  ctaSub: { fontSize: 12, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.9)' },
});
