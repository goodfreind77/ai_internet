import React, { useState, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useColors } from '@/hooks/useColors';
import { useCreateConsultation } from '@workspace/api-client-react';

const CARRIERS = ['SK브로드밴드', 'KT 올레', 'LG U+', 'KT Skylife', 'LG헬로비전'];
const CARRIER_COLORS: Record<string, string> = {
  'SK브로드밴드': '#F97316',
  'KT 올레': '#1A1A1A',
  'LG U+': '#E5005A',
  'KT Skylife': '#16A34A',
  'LG헬로비전': '#0055B3',
};

function SuccessView({ onReset }: { onReset: () => void }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={[styles.successContainer, { backgroundColor: colors.background, paddingBottom: isWeb ? 34 : insets.bottom }]}>
      <Animated.View style={[styles.successCard, { backgroundColor: colors.card, borderColor: colors.border, transform: [{ scale }], opacity }]}>
        <View style={styles.successIconWrap}>
          <LinearGradient colors={['#F97316', '#F59E0B']} style={styles.successIcon}>
            <Ionicons name="checkmark" size={32} color="#FFFFFF" />
          </LinearGradient>
        </View>
        <Text style={[styles.successTitle, { color: colors.foreground }]}>상담 신청 완료!</Text>
        <Text style={[styles.successMsg, { color: colors.mutedForeground }]}>
          전문 상담사가 빠른 시일 내에{'\n'}연락드리겠습니다.
        </Text>
        <View style={[styles.successNote, { backgroundColor: '#F97316' + '12', borderColor: '#F97316' + '30' }]}>
          <Ionicons name="time-outline" size={14} color="#F97316" />
          <Text style={[styles.successNoteText, { color: '#F97316' }]}>영업일 기준 1~2일 이내 연락</Text>
        </View>
        <Pressable
          onPress={onReset}
          style={({ pressed }) => [styles.resetBtn, { backgroundColor: colors.muted, opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={[styles.resetBtnText, { color: colors.foreground }]}>새 상담 신청</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

export default function ApplyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? 67 : insets.top;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const { mutate: createConsultation, isPending } = useCreateConsultation();

  const formatPhone = (text: string) => {
    const digits = text.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  };

  const handlePhoneChange = (text: string) => {
    setPhone(formatPhone(text));
  };

  const isValid = name.trim().length >= 2 && phone.replace(/\D/g, '').length >= 10;

  const handleSubmit = () => {
    if (!isValid) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    createConsultation(
      { data: { name: name.trim(), phone } },
      {
        onSuccess: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setSubmitted(true);
        },
        onError: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Alert.alert('오류', '상담 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
        },
      }
    );
  };

  if (submitted) {
    return (
      <SuccessView
        onReset={() => {
          setName('');
          setPhone('');
          setSelectedCarrier(null);
          setSubmitted(false);
        }}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>상담 신청</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>무료로 최적 요금제를 추천해드립니다</Text>
      </View>

      <KeyboardAwareScrollViewCompat
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: (isWeb ? 34 : insets.bottom) + 100 },
        ]}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}
      >
        {/* Info Banner */}
        <LinearGradient
          colors={['#FFF7ED', '#FEF3C7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.infoBanner, { borderColor: '#F97316' + '40' }]}
        >
          <Ionicons name="information-circle" size={18} color="#F97316" />
          <Text style={[styles.infoBannerText, { color: '#92400E' }]}>
            연락처만 남겨주시면 전문 상담사가 직접 연락드립니다
          </Text>
        </LinearGradient>

        {/* Form */}
        <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
              이름 <Text style={{ color: '#EF4444' }}>*</Text>
            </Text>
            <View style={[styles.inputWrap, { borderColor: name.trim().length > 0 ? '#F97316' : colors.input, backgroundColor: colors.background }]}>
              <Ionicons name="person-outline" size={16} color={colors.mutedForeground} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
                placeholder="홍길동"
                placeholderTextColor={colors.mutedForeground}
                value={name}
                onChangeText={setName}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                testID="name-input"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
              연락처 <Text style={{ color: '#EF4444' }}>*</Text>
            </Text>
            <View style={[styles.inputWrap, { borderColor: phone.replace(/\D/g, '').length >= 10 ? '#F97316' : colors.input, backgroundColor: colors.background }]}>
              <Ionicons name="call-outline" size={16} color={colors.mutedForeground} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
                placeholder="010-0000-0000"
                placeholderTextColor={colors.mutedForeground}
                value={phone}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                maxLength={13}
                returnKeyType="done"
                testID="phone-input"
              />
            </View>
          </View>
        </View>

        {/* Carrier Selection */}
        <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.fieldLabel, { color: colors.foreground, marginBottom: 12 }]}>
            희망 통신사 <Text style={[styles.optionalTag, { color: colors.mutedForeground }]}>(선택)</Text>
          </Text>
          <View style={styles.carrierGrid}>
            {CARRIERS.map((carrier) => {
              const isSelected = selectedCarrier === carrier;
              const color = CARRIER_COLORS[carrier] ?? '#F97316';
              return (
                <Pressable
                  key={carrier}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedCarrier(isSelected ? null : carrier);
                  }}
                  style={[
                    styles.carrierChip,
                    {
                      backgroundColor: isSelected ? color + '15' : colors.muted,
                      borderColor: isSelected ? color : 'transparent',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.carrierChipText,
                      { color: isSelected ? color : colors.mutedForeground },
                    ]}
                  >
                    {carrier}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Benefits */}
        <View style={[styles.benefitsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.benefitsTitle, { color: colors.foreground }]}>상담 혜택</Text>
          {[
            { icon: 'gift-outline' as const, text: '최대 27만원 사은품 제공' },
            { icon: 'call-outline' as const, text: '전담 상담사 1:1 맞춤 안내' },
            { icon: 'checkmark-circle-outline' as const, text: '가입 후 사은품 즉시 지급' },
          ].map((b) => (
            <View key={b.text} style={styles.benefitRow}>
              <View style={[styles.benefitIconWrap, { backgroundColor: '#F97316' + '15' }]}>
                <Ionicons name={b.icon} size={14} color="#F97316" />
              </View>
              <Text style={[styles.benefitText, { color: colors.foreground }]}>{b.text}</Text>
            </View>
          ))}
        </View>

        {/* Submit */}
        <Pressable
          onPress={handleSubmit}
          disabled={!isValid || isPending}
          style={({ pressed }) => [
            styles.submitBtn,
            { opacity: !isValid || isPending ? 0.5 : pressed ? 0.85 : 1 },
          ]}
          testID="submit-button"
        >
          <LinearGradient
            colors={['#F97316', '#F59E0B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitGradient}
          >
            {isPending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="call" size={18} color="#FFFFFF" />
                <Text style={styles.submitBtnText}>무료 상담 신청하기</Text>
              </>
            )}
          </LinearGradient>
        </Pressable>

        <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>
          개인정보는 상담 목적으로만 사용되며 안전하게 보호됩니다
        </Text>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1 },
  headerTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', marginBottom: 2 },
  headerSub: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  infoBannerText: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular' },
  formCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { fontSize: 14, fontFamily: 'Inter_600SemiBold', marginBottom: 8 },
  optionalTag: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15 },
  carrierGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  carrierChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  carrierChipText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  benefitsCard: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 16 },
  benefitsTitle: { fontSize: 14, fontFamily: 'Inter_700Bold', marginBottom: 12 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  benefitIconWrap: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  benefitText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  submitBtn: { borderRadius: 14, overflow: 'hidden', marginBottom: 12 },
  submitGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  submitBtnText: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  disclaimer: { fontSize: 11, fontFamily: 'Inter_400Regular', textAlign: 'center', marginBottom: 8 },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  successCard: { width: '100%', maxWidth: 360, borderRadius: 20, borderWidth: 1, padding: 28, alignItems: 'center' },
  successIconWrap: { marginBottom: 20 },
  successIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontSize: 24, fontFamily: 'Inter_700Bold', marginBottom: 10 },
  successMsg: { fontSize: 15, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 22, marginBottom: 16 },
  successNote: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 10, borderRadius: 8, borderWidth: 1, marginBottom: 20 },
  successNoteText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  resetBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
  resetBtnText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
});
