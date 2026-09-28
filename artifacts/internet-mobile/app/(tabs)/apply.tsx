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
import { useCreateApplication } from '@workspace/api-client-react';

/* ─── Static data ─── */
const CURRENT_PROVIDERS = ['SK브로드밴드', 'KT', 'LG유플러스', '지역케이블', '없음', '기타'];
const APPLY_PROVIDERS = ['SK브로드밴드', 'KT', 'LG유플러스', 'KT스카이라이프', 'LG헬로비전'];
const APPLY_PROVIDER_COLORS: Record<string, string> = {
  'SK브로드밴드': '#F97316',
  KT: '#1A1A1A',
  'LG유플러스': '#E5005A',
  'KT스카이라이프': '#16A34A',
  'LG헬로비전': '#0055B3',
};
const INTERNET_OPTIONS = ['100M', '500M', '1G'];
const TV_OPTIONS = ['이코노미(183채널)', '스탠다드(234채널)', 'All(257채널)', '선택안함'];
const CUSTOMER_TYPES = ['개인', '개인사업자', '법인', '미성년자', '외국인'];
const PHONE_CARRIERS = ['KT', 'SKT', 'LG U+', '알뜰폰'];
const PAYMENT_METHODS = ['자동이체', '카드자동이체'];
const BANKS = [
  'KB국민은행', '신한은행', '우리은행', 'NH농협은행', '하나은행',
  'IBK기업은행', 'SC제일은행', '씨티은행', '카카오뱅크', '케이뱅크', '토스뱅크',
  '새마을금고', '신협', '우체국', '대구은행', '부산은행', '경남은행',
  '광주은행', '전북은행', '제주은행', '수협은행', '산업은행',
];
const CARD_COMPANIES = [
  '삼성카드', '현대카드', 'KB국민카드', '신한카드', '롯데카드',
  '우리카드', '하나카드', 'NH농협카드', 'BC카드', '씨티카드',
];

const STEPS = ['가입 정보', '고객 정보', '납부 정보', '사은품 계좌'];
const TOTAL_STEPS = STEPS.length;

/* ─── Reusable sub-components ─── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  const colors = useColors();
  return (
    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{children}</Text>
  );
}

function FieldLabel({ children, required, optional }: { children: React.ReactNode; required?: boolean; optional?: boolean }) {
  const colors = useColors();
  return (
    <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
      {children}
      {required && <Text style={{ color: '#EF4444', fontSize: 12 }}> (필수)</Text>}
      {optional && <Text style={{ color: colors.mutedForeground, fontSize: 12 }}> (선택)</Text>}
    </Text>
  );
}

function ChipRow({
  options,
  selected,
  onSelect,
  colorMap,
}: {
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  colorMap?: Record<string, string>;
}) {
  const colors = useColors();
  return (
    <View style={styles.chipRow}>
      {options.map((opt) => {
        const isSelected = selected === opt;
        const accent = colorMap?.[opt] ?? '#F97316';
        return (
          <Pressable
            key={opt}
            onPress={() => {
              Haptics.selectionAsync();
              onSelect(isSelected ? '' : opt);
            }}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? accent + '18' : colors.muted,
                borderColor: isSelected ? accent : 'transparent',
              },
            ]}
          >
            {isSelected && (
              <Ionicons name="checkmark" size={12} color={accent} style={{ marginRight: 3 }} />
            )}
            <Text style={[styles.chipText, { color: isSelected ? accent : colors.mutedForeground }]}>
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function PickerModal({
  label,
  options,
  value,
  onSelect,
  placeholder,
}: {
  label: string;
  options: string[];
  value: string;
  onSelect: (v: string) => void;
  placeholder: string;
}) {
  const colors = useColors();
  const [open, setOpen] = useState(false);
  const display = value || placeholder;
  const hasValue = !!value;

  return (
    <View>
      <FieldLabel>{label}</FieldLabel>
      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.pickerBtn,
          {
            borderColor: hasValue ? '#F97316' : colors.input,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Text style={[styles.pickerBtnText, { color: hasValue ? colors.foreground : colors.mutedForeground }]}>
          {display}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.mutedForeground} />
      </Pressable>

      {open && (
        <View style={[styles.dropdownList, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ScrollView style={{ maxHeight: 220 }} keyboardShouldPersistTaps="handled">
            {options.map((opt) => (
              <Pressable
                key={opt}
                onPress={() => {
                  Haptics.selectionAsync();
                  onSelect(opt);
                  setOpen(false);
                }}
                style={[
                  styles.dropdownItem,
                  { borderBottomColor: colors.border },
                  opt === value && { backgroundColor: '#F9731610' },
                ]}
              >
                <Text style={[styles.dropdownItemText, { color: opt === value ? '#F97316' : colors.foreground }]}>
                  {opt}
                </Text>
                {opt === value && <Ionicons name="checkmark" size={14} color="#F97316" />}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

function InputField({
  label,
  required,
  optional,
  icon,
  ...props
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
} & React.ComponentProps<typeof TextInput>) {
  const colors = useColors();
  const hasValue = typeof props.value === 'string' && props.value.length > 0;
  return (
    <View style={styles.fieldGroup}>
      <FieldLabel required={required} optional={optional}>{label}</FieldLabel>
      <View
        style={[
          styles.inputWrap,
          { borderColor: hasValue ? '#F97316' : colors.input, backgroundColor: colors.background },
        ]}
      >
        {icon && (
          <Ionicons name={icon} size={15} color={colors.mutedForeground} style={styles.inputIcon} />
        )}
        <TextInput
          style={[styles.input, { color: colors.foreground }]}
          placeholderTextColor={colors.mutedForeground}
          {...props}
        />
      </View>
    </View>
  );
}

/* ─── Step indicator ─── */
function StepIndicator({ current }: { current: number }) {
  const colors = useColors();
  return (
    <View style={styles.stepIndicator}>
      {STEPS.map((label, i) => {
        const idx = i + 1;
        const done = idx < current;
        const active = idx === current;
        return (
          <React.Fragment key={label}>
            {i > 0 && (
              <View
                style={[
                  styles.stepLine,
                  { backgroundColor: done ? '#F97316' : colors.border },
                ]}
              />
            )}
            <View style={styles.stepDotWrap}>
              <View
                style={[
                  styles.stepDot,
                  {
                    backgroundColor: done ? '#F97316' : active ? '#F97316' : colors.muted,
                    borderColor: active ? '#F97316' : done ? '#F97316' : colors.border,
                  },
                ]}
              >
                {done ? (
                  <Ionicons name="checkmark" size={10} color="#fff" />
                ) : (
                  <Text style={[styles.stepDotNum, { color: active ? '#fff' : colors.mutedForeground }]}>
                    {idx}
                  </Text>
                )}
              </View>
              <Text style={[styles.stepLabel, { color: active ? '#F97316' : colors.mutedForeground }]}>
                {label}
              </Text>
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
}

/* ─── Success View ─── */
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
        <Text style={[styles.successTitle, { color: colors.foreground }]}>신청 완료!</Text>
        <Text style={[styles.successMsg, { color: colors.mutedForeground }]}>
          가입 신청서가 접수되었습니다.{'\n'}전문 상담사가 빠른 시일 내에 연락드리겠습니다.
        </Text>
        <View style={[styles.successNote, { backgroundColor: '#F97316' + '12', borderColor: '#F97316' + '30' }]}>
          <Ionicons name="time-outline" size={14} color="#F97316" />
          <Text style={[styles.successNoteText, { color: '#F97316' }]}>영업일 기준 1~2일 이내 연락</Text>
        </View>
        <Pressable
          onPress={onReset}
          style={({ pressed }) => [styles.resetBtn, { backgroundColor: colors.muted, opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={[styles.resetBtnText, { color: colors.foreground }]}>새 신청서 작성</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

/* ─── Main Screen ─── */
export default function ApplyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? 67 : insets.top;

  // Step state
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1 – 가입 정보
  const [currentProvider, setCurrentProvider] = useState('');
  const [applyProvider, setApplyProvider] = useState('');
  const [internet, setInternet] = useState('');
  const [tv, setTv] = useState('');
  const [customerType, setCustomerType] = useState('');

  // Step 2 – 고객 정보
  const [name, setName] = useState('');
  const [phoneCarrier, setPhoneCarrier] = useState('KT');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [memo, setMemo] = useState('');

  // Step 3 – 납부 정보
  const [paymentMethod, setPaymentMethod] = useState('');
  const [payBank, setPayBank] = useState('');
  const [payAccount, setPayAccount] = useState('');
  const [payAccountHolder, setPayAccountHolder] = useState('');
  const [cardCompany, setCardCompany] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');

  // Step 4 – 사은품 계좌
  const [giftBank, setGiftBank] = useState('');
  const [giftAccount, setGiftAccount] = useState('');
  const [giftAccountHolder, setGiftAccountHolder] = useState('');
  const [sameAsPayment, setSameAsPayment] = useState(false);

  const { mutate: createApplication, isPending } = useCreateApplication();

  const formatPhone = (text: string) => {
    const digits = text.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  };

  const formatCardExpiry = (text: string) => {
    let v = text.replace(/[^0-9]/g, '');
    if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2, 4);
    return v;
  };

  /* ─── Validation per step ─── */
  const validateStep = (s: number): string | null => {
    if (s === 1) {
      if (!currentProvider) return '기존 인터넷 통신사를 선택해주세요.';
      if (!applyProvider) return '가입신청 통신사를 선택해주세요.';
      if (!internet) return '인터넷 상품을 선택해주세요.';
      if (!customerType) return '고객유형을 선택해주세요.';
    }
    if (s === 2) {
      if (!name.trim()) return '이름을 입력해주세요.';
      if (phone.replace(/\D/g, '').length < 10) return '올바른 휴대폰 번호를 입력해주세요.';
      if (!email.trim() || !email.includes('@')) return '올바른 이메일을 입력해주세요.';
      if (!address.trim()) return '설치주소를 입력해주세요.';
    }
    if (s === 3) {
      if (!paymentMethod) return '요금 납부방법을 선택해주세요.';
      if (paymentMethod === '자동이체') {
        if (!payBank) return '납부 은행을 선택해주세요.';
        if (!payAccount.trim()) return '납부 계좌번호를 입력해주세요.';
        if (!payAccountHolder.trim()) return '납부 예금주를 입력해주세요.';
      }
      if (paymentMethod === '카드자동이체') {
        if (!cardCompany) return '카드사를 선택해주세요.';
        if (!cardNumber.trim()) return '카드번호를 입력해주세요.';
        if (!cardExpiry.trim()) return '유효기간을 입력해주세요.';
      }
    }
    if (s === 4) {
      if (!giftBank) return '사은품 입금 은행을 선택해주세요.';
      if (!giftAccount.trim()) return '사은품 계좌번호를 입력해주세요.';
      if (!giftAccountHolder.trim()) return '사은품 예금주를 입력해주세요.';
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep(step);
    if (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('입력 확인', err);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep((s) => s - 1);
  };

  const handleSubmit = () => {
    const err = validateStep(4);
    if (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('입력 확인', err);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    createApplication(
      {
        data: {
          currentProvider,
          applyProvider,
          internet,
          tv: tv || undefined,
          customerType,
          paymentMethod,
          payBank: paymentMethod === '자동이체' ? payBank : undefined,
          payAccount: paymentMethod === '자동이체' ? payAccount : undefined,
          payAccountHolder: paymentMethod === '자동이체' ? payAccountHolder : undefined,
          cardCompany: paymentMethod === '카드자동이체' ? cardCompany : undefined,
          cardNumber: paymentMethod === '카드자동이체' ? cardNumber : undefined,
          cardExpiry: paymentMethod === '카드자동이체' ? cardExpiry : undefined,
          giftBank,
          giftAccount,
          giftAccountHolder,
          name: name.trim(),
          phoneCarrier,
          phone,
          email: email.trim(),
          address: address.trim(),
          memo: memo.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setSubmitted(true);
        },
        onError: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Alert.alert('오류', '신청 중 오류가 발생했습니다. 다시 시도해주세요.');
        },
      }
    );
  };

  const handleReset = () => {
    setStep(1);
    setSubmitted(false);
    setCurrentProvider(''); setApplyProvider(''); setInternet(''); setTv(''); setCustomerType('');
    setName(''); setPhoneCarrier('KT'); setPhone(''); setEmail(''); setAddress(''); setMemo('');
    setPaymentMethod(''); setPayBank(''); setPayAccount(''); setPayAccountHolder('');
    setCardCompany(''); setCardNumber(''); setCardExpiry('');
    setGiftBank(''); setGiftAccount(''); setGiftAccountHolder(''); setSameAsPayment(false);
  };

  if (submitted) return <SuccessView onReset={handleReset} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>인터넷 가입 신청</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          {step} / {TOTAL_STEPS}단계 · {STEPS[step - 1]}
        </Text>
      </View>

      {/* Step indicator */}
      <View style={[styles.stepIndicatorWrap, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <StepIndicator current={step} />
      </View>

      <KeyboardAwareScrollViewCompat
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: (isWeb ? 34 : insets.bottom) + 120 },
        ]}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}
      >
        {/* ── STEP 1: 가입 정보 ── */}
        {step === 1 && (
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SectionTitle>가입 정보 입력</SectionTitle>

            <View style={styles.fieldGroup}>
              <FieldLabel required>기존 인터넷 통신사</FieldLabel>
              <ChipRow options={CURRENT_PROVIDERS} selected={currentProvider} onSelect={setCurrentProvider} />
            </View>

            <View style={styles.fieldGroup}>
              <FieldLabel required>가입신청 통신사</FieldLabel>
              <ChipRow options={APPLY_PROVIDERS} selected={applyProvider} onSelect={setApplyProvider} colorMap={APPLY_PROVIDER_COLORS} />
            </View>

            <View style={styles.fieldGroup}>
              <FieldLabel required>인터넷 상품</FieldLabel>
              <ChipRow options={INTERNET_OPTIONS} selected={internet} onSelect={setInternet} />
            </View>

            <View style={styles.fieldGroup}>
              <FieldLabel optional>TV 상품</FieldLabel>
              <ChipRow options={TV_OPTIONS} selected={tv} onSelect={setTv} />
            </View>

            <View style={styles.fieldGroup}>
              <FieldLabel required>고객유형</FieldLabel>
              <ChipRow options={CUSTOMER_TYPES} selected={customerType} onSelect={setCustomerType} />
            </View>
          </View>
        )}

        {/* ── STEP 2: 고객 정보 ── */}
        {step === 2 && (
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SectionTitle>고객 정보 입력</SectionTitle>

            <InputField
              label="이름"
              required
              icon="person-outline"
              placeholder="홍길동"
              value={name}
              onChangeText={setName}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />

            <View style={styles.fieldGroup}>
              <FieldLabel required>휴대폰</FieldLabel>
              <View style={styles.phoneRow}>
                {/* Phone carrier mini-chips */}
                <View style={styles.carrierMiniRow}>
                  {PHONE_CARRIERS.map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => { Haptics.selectionAsync(); setPhoneCarrier(c); }}
                      style={[
                        styles.carrierMiniChip,
                        {
                          backgroundColor: phoneCarrier === c ? '#F9731618' : colors.muted,
                          borderColor: phoneCarrier === c ? '#F97316' : 'transparent',
                        },
                      ]}
                    >
                      <Text style={[styles.carrierMiniText, { color: phoneCarrier === c ? '#F97316' : colors.mutedForeground }]}>
                        {c}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <View
                  style={[
                    styles.inputWrap,
                    { borderColor: phone.replace(/\D/g, '').length >= 10 ? '#F97316' : colors.input, backgroundColor: colors.background, marginTop: 8 },
                  ]}
                >
                  <Ionicons name="call-outline" size={15} color={colors.mutedForeground} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.foreground }]}
                    placeholder="010-0000-0000"
                    placeholderTextColor={colors.mutedForeground}
                    value={phone}
                    onChangeText={(t) => setPhone(formatPhone(t))}
                    keyboardType="phone-pad"
                    maxLength={13}
                    returnKeyType="next"
                  />
                </View>
              </View>
            </View>

            <InputField
              label="이메일"
              required
              icon="mail-outline"
              placeholder="example@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />

            <InputField
              label="설치주소"
              required
              icon="location-outline"
              placeholder="설치 주소를 입력해주세요"
              value={address}
              onChangeText={setAddress}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />

            <View style={styles.fieldGroup}>
              <FieldLabel optional>메모 / 기타문의</FieldLabel>
              <View
                style={[
                  styles.inputWrap,
                  { borderColor: memo ? '#F97316' : colors.input, backgroundColor: colors.background, alignItems: 'flex-start', paddingVertical: 10 },
                ]}
              >
                <TextInput
                  style={[styles.input, { color: colors.foreground, minHeight: 72, textAlignVertical: 'top' }]}
                  placeholder="궁금한 점이나 추가로 전달하실 내용을 입력해주세요."
                  placeholderTextColor={colors.mutedForeground}
                  value={memo}
                  onChangeText={setMemo}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>
          </View>
        )}

        {/* ── STEP 3: 납부 정보 ── */}
        {step === 3 && (
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SectionTitle>납부 정보 입력</SectionTitle>

            <View style={styles.fieldGroup}>
              <FieldLabel required>요금 납부방법</FieldLabel>
              <ChipRow options={PAYMENT_METHODS} selected={paymentMethod} onSelect={setPaymentMethod} />
            </View>

            {/* 자동이체 */}
            {paymentMethod === '자동이체' && (
              <View style={[styles.subSection, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                <Text style={[styles.subSectionTitle, { color: colors.foreground }]}>자동이체 정보 입력</Text>

                <PickerModal
                  label="납부 은행"
                  options={BANKS}
                  value={payBank}
                  onSelect={setPayBank}
                  placeholder="은행 선택"
                />

                <InputField
                  label="납부 계좌번호"
                  required
                  icon="card-outline"
                  placeholder="계좌번호 (숫자만 입력)"
                  value={payAccount}
                  onChangeText={(t) => setPayAccount(t.replace(/\D/g, ''))}
                  keyboardType="number-pad"
                  returnKeyType="next"
                />

                <InputField
                  label="예금주"
                  required
                  icon="person-outline"
                  placeholder="예금주 이름을 입력해주세요"
                  value={payAccountHolder}
                  onChangeText={setPayAccountHolder}
                  autoCapitalize="none"
                  returnKeyType="done"
                />
              </View>
            )}

            {/* 카드자동이체 */}
            {paymentMethod === '카드자동이체' && (
              <View style={[styles.subSection, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                <Text style={[styles.subSectionTitle, { color: colors.foreground }]}>카드자동이체 정보 입력</Text>

                <PickerModal
                  label="카드사"
                  options={CARD_COMPANIES}
                  value={cardCompany}
                  onSelect={setCardCompany}
                  placeholder="카드사 선택"
                />

                <InputField
                  label="카드번호"
                  required
                  icon="card-outline"
                  placeholder="카드번호 (숫자만 입력)"
                  value={cardNumber}
                  onChangeText={(t) => setCardNumber(t.replace(/\D/g, ''))}
                  keyboardType="number-pad"
                  maxLength={16}
                  returnKeyType="next"
                />

                <InputField
                  label="유효기간"
                  required
                  icon="calendar-outline"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChangeText={(t) => setCardExpiry(formatCardExpiry(t))}
                  keyboardType="number-pad"
                  maxLength={5}
                  returnKeyType="done"
                />
              </View>
            )}
          </View>
        )}

        {/* ── STEP 4: 사은품 계좌 ── */}
        {step === 4 && (
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SectionTitle>사은품 입금 계좌</SectionTitle>
            <Text style={[styles.stepDesc, { color: colors.mutedForeground }]}>
              사은품(현금)을 받으실 계좌 정보를 입력해주세요.
            </Text>

            {/* Same as payment shortcut */}
            {paymentMethod === '자동이체' && payBank && payAccount && payAccountHolder && (
              <Pressable
                onPress={() => {
                  const checked = !sameAsPayment;
                  setSameAsPayment(checked);
                  if (checked) {
                    setGiftBank(payBank);
                    setGiftAccount(payAccount);
                    setGiftAccountHolder(payAccountHolder);
                  } else {
                    setGiftBank(''); setGiftAccount(''); setGiftAccountHolder('');
                  }
                  Haptics.selectionAsync();
                }}
                style={[
                  styles.samePayBtn,
                  {
                    backgroundColor: sameAsPayment ? '#F9731618' : colors.muted,
                    borderColor: sameAsPayment ? '#F97316' : colors.border,
                  },
                ]}
              >
                <View style={[styles.checkBox, { borderColor: sameAsPayment ? '#F97316' : colors.mutedForeground, backgroundColor: sameAsPayment ? '#F97316' : 'transparent' }]}>
                  {sameAsPayment && <Ionicons name="checkmark" size={12} color="#fff" />}
                </View>
                <Text style={[styles.samePayText, { color: sameAsPayment ? '#F97316' : colors.foreground }]}>
                  납부계좌와 동일하게 입력
                </Text>
              </Pressable>
            )}

            <PickerModal
              label="사은품 입금 은행"
              options={BANKS}
              value={giftBank}
              onSelect={setGiftBank}
              placeholder="은행 선택"
            />

            <InputField
              label="사은품 계좌번호"
              required
              icon="card-outline"
              placeholder="계좌번호 (숫자만 입력)"
              value={giftAccount}
              onChangeText={(t) => setGiftAccount(t.replace(/\D/g, ''))}
              keyboardType="number-pad"
              returnKeyType="next"
            />

            <InputField
              label="예금주"
              required
              icon="person-outline"
              placeholder="예금주 이름을 입력해주세요"
              value={giftAccountHolder}
              onChangeText={setGiftAccountHolder}
              autoCapitalize="none"
              returnKeyType="done"
            />

            {/* Summary */}
            <View style={[styles.summaryBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
              <Text style={[styles.summaryTitle, { color: colors.foreground }]}>신청 내용 요약</Text>
              {[
                { label: '가입 통신사', value: applyProvider },
                { label: '인터넷', value: internet },
                { label: 'TV', value: tv || '선택안함' },
                { label: '고객유형', value: customerType },
                { label: '이름', value: name },
                { label: '납부방법', value: paymentMethod },
              ].map((row) => (
                <View key={row.label} style={styles.summaryRow}>
                  <Text style={[styles.summaryKey, { color: colors.mutedForeground }]}>{row.label}</Text>
                  <Text style={[styles.summaryVal, { color: colors.foreground }]}>{row.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </KeyboardAwareScrollViewCompat>

      {/* Bottom nav buttons */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: isWeb ? 16 : insets.bottom + 8 }]}>
        {step > 1 && (
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [styles.backBtn, { backgroundColor: colors.muted, opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="chevron-back" size={18} color={colors.foreground} />
            <Text style={[styles.backBtnText, { color: colors.foreground }]}>이전</Text>
          </Pressable>
        )}

        {step < TOTAL_STEPS ? (
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [styles.nextBtn, { opacity: pressed ? 0.85 : 1, flex: step > 1 ? 1 : undefined }]}
          >
            <LinearGradient colors={['#F97316', '#F59E0B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.nextGradient}>
              <Text style={styles.nextBtnText}>다음</Text>
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </LinearGradient>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleSubmit}
            disabled={isPending}
            style={({ pressed }) => [styles.nextBtn, { opacity: isPending ? 0.6 : pressed ? 0.85 : 1, flex: 1 }]}
          >
            <LinearGradient colors={['#F97316', '#F59E0B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.nextGradient}>
              {isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={18} color="#fff" />
                  <Text style={styles.nextBtnText}>신청하기</Text>
                </>
              )}
            </LinearGradient>
          </Pressable>
        )}
      </View>
    </View>
  );
}

/* ─── Styles ─── */
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 10, borderBottomWidth: 1 },
  headerTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', marginBottom: 2 },
  headerSub: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  stepIndicatorWrap: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  stepIndicator: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center' },
  stepDotWrap: { alignItems: 'center' },
  stepDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  stepDotNum: { fontSize: 10, fontFamily: 'Inter_700Bold' },
  stepLabel: { fontSize: 9, fontFamily: 'Inter_500Medium', marginTop: 3, textAlign: 'center', maxWidth: 50 },
  stepLine: { flex: 1, height: 1.5, marginTop: 10 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  formCard: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', marginBottom: 16 },
  stepDesc: { fontSize: 13, fontFamily: 'Inter_400Regular', marginBottom: 16, marginTop: -8 },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold', marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipText: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular' },
  phoneRow: {},
  carrierMiniRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  carrierMiniChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16, borderWidth: 1 },
  carrierMiniText: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  subSection: { borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 8, gap: 12 },
  subSectionTitle: { fontSize: 13, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  pickerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, marginBottom: 12 },
  pickerBtnText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  dropdownList: { borderWidth: 1, borderRadius: 10, marginTop: -8, marginBottom: 8, overflow: 'hidden' },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: StyleSheet.hairlineWidth },
  dropdownItemText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  samePayBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1.5, borderRadius: 10, padding: 12, marginBottom: 16 },
  checkBox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  samePayText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  summaryBox: { borderRadius: 12, borderWidth: 1, padding: 14, marginTop: 8 },
  summaryTitle: { fontSize: 13, fontFamily: 'Inter_700Bold', marginBottom: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryKey: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  summaryVal: { fontSize: 12, fontFamily: 'Inter_600SemiBold', maxWidth: '60%', textAlign: 'right' },
  bottomBar: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12 },
  backBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  nextBtn: { borderRadius: 12, overflow: 'hidden' },
  nextGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, paddingHorizontal: 24 },
  nextBtnText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
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
