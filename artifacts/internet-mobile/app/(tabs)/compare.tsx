import React, { useState, useRef } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { ISP_PLANS, formatGift, formatPrice, type IspPlan, type Plan } from '@/constants/ispData';

const ALL_KEY = 'all';

function PlanCard({ plan, isp }: { plan: Plan; isp: IspPlan }) {
  const colors = useColors();
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Pressable
      onPress={() => router.push('/(tabs)/apply')}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View
        style={[
          styles.planCard,
          {
            backgroundColor: colors.card,
            borderColor: plan.popular ? isp.color : colors.border,
            borderWidth: plan.popular ? 2 : 1,
            transform: [{ scale }],
          },
        ]}
      >
        {plan.popular && (
          <View style={[styles.popularBadge, { backgroundColor: isp.color }]}>
            <Text style={styles.popularBadgeText}>추천</Text>
          </View>
        )}
        <View style={styles.planHeader}>
          <View style={styles.planHeaderLeft}>
            <View style={[styles.ispDot, { backgroundColor: isp.color }]} />
            <Text style={[styles.planIspName, { color: colors.foreground }]}>{isp.shortName}</Text>
          </View>
          <View style={[styles.giftTag, { backgroundColor: isp.color + '18' }]}>
            <Ionicons name="gift" size={12} color={isp.color} />
            <Text style={[styles.giftTagText, { color: isp.color }]}>{formatGift(plan.gift)}</Text>
          </View>
        </View>

        <Text style={[styles.planSpeed, { color: colors.foreground }]}>{plan.internet} 인터넷</Text>
        {plan.tv ? (
          <Text style={[styles.planTv, { color: colors.mutedForeground }]}>TV {plan.tv} 포함</Text>
        ) : (
          <Text style={[styles.planTv, { color: colors.mutedForeground }]}>인터넷 단독</Text>
        )}

        <View style={[styles.planFooter, { borderTopColor: colors.border }]}>
          <Text style={[styles.priceText, { color: colors.foreground }]}>{formatPrice(plan.price)}</Text>
          <View style={[styles.applyBtn, { backgroundColor: isp.color }]}>
            <Text style={styles.applyBtnText}>신청</Text>
            <Ionicons name="arrow-forward" size={12} color="#FFFFFF" />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default function CompareScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? 67 : insets.top;
  const { carrier } = useLocalSearchParams<{ carrier?: string }>();
  const [selectedKey, setSelectedKey] = useState<string>(carrier ?? ALL_KEY);

  const filters = [
    { key: ALL_KEY, label: '전체' },
    ...ISP_PLANS.map((isp) => ({ key: isp.key, label: isp.shortName })),
  ];

  const displayPlans: { plan: Plan; isp: IspPlan }[] =
    selectedKey === ALL_KEY
      ? ISP_PLANS.flatMap((isp) => isp.plans.map((plan) => ({ plan, isp })))
      : (ISP_PLANS.find((i) => i.key === selectedKey)?.plans ?? []).map((plan) => ({
          plan,
          isp: ISP_PLANS.find((i) => i.key === selectedKey)!,
        }));

  const selectedIsp = ISP_PLANS.find((i) => i.key === selectedKey);
  const activeColor = selectedIsp?.color ?? colors.primary;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>요금제 비교</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          {displayPlans.length}개 요금제
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={[styles.filterWrap, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {filters.map((f) => {
            const isp = ISP_PLANS.find((i) => i.key === f.key);
            const tabColor = isp?.color ?? colors.primary;
            const isActive = selectedKey === f.key;
            return (
              <Pressable
                key={f.key}
                onPress={() => setSelectedKey(f.key)}
                style={[
                  styles.filterTab,
                  {
                    backgroundColor: isActive ? tabColor : colors.muted,
                    borderColor: isActive ? tabColor : 'transparent',
                  },
                ]}
              >
                <Text style={[styles.filterTabText, { color: isActive ? '#FFFFFF' : colors.mutedForeground }]}>
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Plans */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: (isWeb ? 34 : insets.bottom) + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {selectedIsp && (
          <View style={[styles.ispBanner, { backgroundColor: selectedIsp.color + '12', borderColor: selectedIsp.color + '30' }]}>
            <View style={[styles.ispBannerDot, { backgroundColor: selectedIsp.color }]} />
            <View>
              <Text style={[styles.ispBannerName, { color: selectedIsp.color }]}>{selectedIsp.name}</Text>
              <Text style={[styles.ispBannerSub, { color: colors.mutedForeground }]}>
                최대 {formatGift(Math.max(...selectedIsp.plans.map((p) => p.gift)))} 사은품
              </Text>
            </View>
          </View>
        )}
        {displayPlans.map(({ plan, isp }) => (
          <PlanCard key={plan.id} plan={plan} isp={isp} />
        ))}

        {/* Bottom CTA */}
        <Pressable
          onPress={() => router.push('/(tabs)/apply')}
          style={({ pressed }) => [styles.bottomCta, { backgroundColor: activeColor, opacity: pressed ? 0.85 : 1 }]}
        >
          <Ionicons name="call-outline" size={18} color="#FFFFFF" />
          <Text style={styles.bottomCtaText}>무료 상담 신청하기</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', marginBottom: 2 },
  headerSub: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  filterWrap: { borderBottomWidth: 1 },
  filterScroll: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  filterTabText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 12 },
  ispBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  ispBannerDot: { width: 10, height: 10, borderRadius: 5 },
  ispBannerName: { fontSize: 15, fontFamily: 'Inter_700Bold', marginBottom: 2 },
  ispBannerSub: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  planCard: {
    borderRadius: 14,
    marginBottom: 10,
    padding: 16,
    overflow: 'hidden',
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 10,
  },
  popularBadgeText: { fontSize: 11, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  planHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ispDot: { width: 8, height: 8, borderRadius: 4 },
  planIspName: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  giftTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  giftTagText: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  planSpeed: { fontSize: 20, fontFamily: 'Inter_700Bold', marginBottom: 3 },
  planTv: { fontSize: 13, fontFamily: 'Inter_400Regular', marginBottom: 12 },
  planFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, paddingTop: 12 },
  priceText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  applyBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  applyBtnText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
  bottomCta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 14, marginTop: 4 },
  bottomCtaText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
});
