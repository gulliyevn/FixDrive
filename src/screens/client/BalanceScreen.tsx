import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Animated, Modal, TextInput, Dimensions, Clipboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClientScreenProps } from '../../types/navigation';
import { BalanceScreenStyles as styles, getBalanceScreenStyles, getBalanceScreenColors } from '../../styles/screens/profile/BalanceScreen.styles';
import { 
  mockBalance, 
  mockCashback,
  mockQuickAmounts 
} from '../../mocks/balanceMock';
import { PaymentHistory } from '../../mocks/paymentHistoryMock';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../hooks/useI18n';
import { colors } from '../../constants/colors';
import { usePackage } from '../../hooks/usePackage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createCVVStickAnimation } from '../../styles/animations';
import BalanceCardDecoration from '../../components/BalanceCardDecoration';
import PaymentHistorySection from '../../components/PaymentHistorySection';

type PackageType = 'free' | 'basic' | 'premium' | 'family';
import {
  balanceCardAnimated,
  balanceCardFrontRow,
  cashbackText,
  balanceActionsMargin,
  balanceCardBack,
  cardBackText,
  animatedCardFront,
  animatedCardBack,
  cardSpacer,
  flipButtonBack,
  flipButtonFront,
  mainBalanceContainer,
  cardContainerWithDynamicWidth,
  balanceCardWithTheme,
  cardFrontButtonWithTheme,
  cardFrontButton2WithTheme,
  cardFrontBtnTextWithColor,
  quickAmountsRowWithLayout,
  quickAmountTextWithTheme,
  modalContainerWithTheme,
  modalTitleWithTheme,
  modalLabelWithTheme,
  modalInputWithTheme,
  modalPayBtnWithTheme,
  modalCancelBtnTextWithTheme,
  cvvStickerWithAnimation,
  cvvTextWithOpacity,
  copiedIconStyle,
  flipIconColor,
  backIconColor,
} from '../../styles/screens/profile/BalanceScreen.styles';

/**
 * Экран баланса пользователя
 * 
 * TODO для интеграции с бэкендом:
 * 1. Заменить useState на useBalance hook
 * 2. Подключить BalanceService для API вызовов
 * 3. Добавить обработку ошибок и загрузки
 * 4. Реализовать реальные платежные методы
 * 5. Добавить валидацию сумм
 * 6. Подключить уведомления о транзакциях
 */

const BalanceScreen: React.FC<ClientScreenProps<'Balance'>> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const currentColors = isDark ? colors.dark : colors.light;
  const dynamicStyles = getBalanceScreenStyles(isDark);
  const balanceColors = getBalanceScreenColors(isDark);

  // Цвета и стили для кнопок и карты
  const topUpBtnColor = currentColors.primary;
  const cashbackBtnColor = currentColors.success;
  const cardBg = currentColors.card;
  const flipIconColorValue = flipIconColor(isDark);
  const backIconColorValue = backIconColor(isDark);

  const BALANCE_KEY = 'user_balance';
  const CASHBACK_KEY = 'user_cashback';
  const TOPUP_HISTORY_KEY = 'topup_history';
  const [balance, setBalance] = useState('0');
  const [cashback, setCashback] = useState('0');
  const [topUpHistory, setTopUpHistory] = useState<PaymentHistory[]>([]);
  const { currentPackage } = usePackage();
  React.useEffect(() => {
    (async () => {
      const storedBalance = await AsyncStorage.getItem(BALANCE_KEY);
      const storedCashback = await AsyncStorage.getItem(CASHBACK_KEY);
      const storedHistory = await AsyncStorage.getItem(TOPUP_HISTORY_KEY);
      
      if (storedBalance !== null) setBalance(storedBalance);
      if (storedCashback !== null) setCashback(storedCashback);
      if (storedHistory !== null) {
        try {
          setTopUpHistory(JSON.parse(storedHistory));
        } catch (error) {
          console.log('Error parsing topup history:', error);
        }
      }
    })();
    // Инициализируем анимацию быстрого пополнения в свернутом состоянии
    quickTopUpHeight.setValue(0);
  }, []);


  // Вместо flipAnim._value используем ref
  const flipAnim = useRef(new Animated.Value(0)).current;
  const isFlippedRef = useRef(false);
  const [topUpModalVisible, setTopUpModalVisible] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');

  const handleFlip = () => {
    const toValue = isFlippedRef.current ? 0 : 1;
    Animated.timing(flipAnim, {
      toValue,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      isFlippedRef.current = !isFlippedRef.current;
    });
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['180deg', '90deg', '0deg'],
  });
  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const handleTopUp = (amount?: string) => {
    if (amount) {
      setTopUpAmount(amount);
    }
    // Не очищаем topUpAmount если amount не передан
    setTopUpModalVisible(true);
  };



  const handleUseCashback = () => {
    const cashbackNum = parseFloat(cashback);
    
    if (cashbackNum < 20) {
      Alert.alert(
        t('client.balance.insufficientFunds'),
        t('client.balance.minimumWithdrawal')
      );
      return;
    }
    
    Alert.alert(
      t('client.balance.useCashback'),
      t('client.balance.useCashbackConfirm'),
      [
        { text: t('client.balance.cancel'), style: 'cancel' },
        {
          text: t('client.balance.yes'),
          onPress: () => {
            setBalance((prev: string) => {
              const cleanPrev = String(prev).replace(/AFc/gi, '').replace(/\s+/g, '');
              const prevNum = parseFloat(cleanPrev);
              const newBalance = (isNaN(prevNum) ? 0 : prevNum) + cashbackNum + '';
              AsyncStorage.setItem(BALANCE_KEY, newBalance);
              return newBalance;
            });
            setCashback('0');
            AsyncStorage.setItem(CASHBACK_KEY, '0');
            Alert.alert(t('client.balance.success'), t('client.balance.cashbackAdded', { 0: cashbackNum }));
          }
        }
      ]
    );
  };





  const screenWidth = Dimensions.get('window').width;

  const addToTopUpHistory = async (amount: number) => {
    const now = new Date();
    const newRecord: PaymentHistory = {
      id: Date.now().toString(),
      title: t('client.paymentHistory.mock.balanceTopUp'),
      amount: `+${amount} AFc`,
      type: 'topup',
      status: 'completed',
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0].substring(0, 5)
    };

    const updatedHistory = [newRecord, ...topUpHistory];
    setTopUpHistory(updatedHistory);
    
    try {
      await AsyncStorage.setItem(TOPUP_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.log('Error saving topup history:', error);
    }
  };



  const handleFakeStripePayment = () => {
    const amountNum = parseFloat(topUpAmount.replace(',', '.'));
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert(t('client.balance.error'), t('client.balance.enterValidAmount'));
      return;
    }
    setBalance((prev: string) => {
      const cleanPrev = String(prev).replace(/AFc/gi, '').replace(/\s+/g, '');
      const prevNum = parseFloat(cleanPrev);
      const newBalance = (isNaN(prevNum) ? 0 : prevNum) + amountNum + '';
      AsyncStorage.setItem(BALANCE_KEY, newBalance);
      return newBalance;
    });
    
    // Добавляем запись в историю пополнений
    addToTopUpHistory(amountNum);
    
    setTopUpModalVisible(false);
    Alert.alert(t('client.balance.paymentSuccess'), t('client.balance.balanceToppedUp', { 0: amountNum }));
  };

  const [showCopied, setShowCopied] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  const [isQuickTopUpExpanded, setIsQuickTopUpExpanded] = useState(false);
  const cvvOpacity = useRef(new Animated.Value(0)).current;
  const stickerOpacity = useRef(new Animated.Value(1)).current;
  const stickerTranslateX = useRef(new Animated.Value(0)).current;
  const stickerTranslateY = useRef(new Animated.Value(0)).current;
  const stickerRotate = useRef(new Animated.Value(0)).current;
  const quickTopUpHeight = useRef(new Animated.Value(0)).current;

  const handleCopyCardNumber = async () => {
    try {
      await Clipboard.setString('9876 5432 1098 7654');
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (error) {
      // Ошибка копирования - молча игнорируем
    }
  };

  const handleToggleCVV = () => {
    createCVVStickAnimation(
      { cvvOpacity, stickerOpacity, stickerTranslateX, stickerTranslateY, stickerRotate },
      setShowCVV
    )(showCVV);
  };

  const handleToggleQuickTopUp = () => {
    const toValue = isQuickTopUpExpanded ? 0 : 1;
    Animated.timing(quickTopUpHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setIsQuickTopUpExpanded(!isQuickTopUpExpanded);
    });
  };



  return (
    <View style={[styles.container, balanceColors.container]}>
      <View style={[styles.header, balanceColors.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={backIconColorValue} />
        </TouchableOpacity>
        <Text style={[styles.title, balanceColors.title]}>{t('client.balance.title')}</Text>
        <View style={styles.backButton}>
          <Ionicons 
            name={
              currentPackage === 'free' ? 'leaf' : 
              currentPackage === 'basic' ? 'shield' : 
              currentPackage === 'premium' ? 'heart' : 
              'diamond'
            } 
            size={24} 
            color={
              currentPackage === 'free' ? '#10B981' : 
              currentPackage === 'basic' ? '#3B82F6' : 
              currentPackage === 'premium' ? '#8B5CF6' : 
              '#F59E0B'
            } 
          />
        </View>
      </View>
      
      <ScrollView style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Основной баланс с анимацией */}
        <View style={mainBalanceContainer}>
          <View style={cardContainerWithDynamicWidth(screenWidth)}>  
            {/* Front side - всегда в DOM */}
            <Animated.View
              style={[
                styles.balanceCard,
                styles.balanceCardBorder,
                { ...dynamicStyles.balanceCard, ...balanceCardWithTheme(currentColors, isDark) },
                balanceCardAnimated,
                animatedCardFront,
                { 
                  transform: [{ rotateY: frontInterpolate }],
                  opacity: frontOpacity,
                },
              ]}
            >
              {/* Декорация в верхней части карты */}
              <BalanceCardDecoration isDark={isDark} packageType={currentPackage} />
              <View style={balanceCardFrontRow}>
                <View>
                  <Text style={styles.balanceLabel}>{t('client.balance.currentBalance')}</Text>
                  <View style={styles.balanceRow}>
                    <Text style={styles.balanceAmount}>{balance}</Text>
                    {!String(balance).includes('AFc') && (
                      <Text style={styles.balanceCurrency}>AFc</Text>
                    )}
                  </View>
                  <Text style={cashbackText}>FixBack: {cashback} AFc</Text>
                </View>
                <TouchableOpacity onPress={handleFlip} style={flipButtonFront}>
                  <Ionicons name="swap-horizontal" size={32} color={flipIconColorValue} />
                </TouchableOpacity>
              </View>
              <View style={[styles.balanceActions, balanceActionsMargin]}> 
                <TouchableOpacity
                  style={[
                    styles.cardFrontButton,
                    cardFrontButtonWithTheme(cardBg, topUpBtnColor),
                  ]}
                  onPress={() => handleTopUp()}
                >
                  <Ionicons name="add-circle" size={24} color={topUpBtnColor} />
                  <Text style={[styles.cardFrontBtnText, cardFrontBtnTextWithColor(topUpBtnColor)]}>{t('client.balance.topUp')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.cardFrontButton2,
                    cardFrontButton2WithTheme(cardBg, cashbackBtnColor),
                  ]}
                  onPress={handleUseCashback}
                >
                  <Ionicons name="gift" size={24} color={cashbackBtnColor} />
                  <Text style={[styles.cardFrontBtnText, cardFrontBtnTextWithColor(cashbackBtnColor)]}>{t('client.balance.cashback.use')}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
            {/* Back side - всегда в DOM */}
            <Animated.View
              style={[
                styles.balanceCard,
                styles.balanceCardBorder,
                { ...dynamicStyles.balanceCard, ...balanceCardWithTheme(currentColors, isDark) },
                balanceCardAnimated,
                animatedCardBack,
                {
                  transform: [{ rotateY: backInterpolate }],
                  opacity: backOpacity,
                },
              ]}
            >
              {/* Декорация обратной стороны карты */}
              <BalanceCardDecoration isDark={isDark} packageType={currentPackage} isBackSide={true} />
              <View style={balanceCardBack}>
                <View style={styles.cardBackBtnContainer}>
                  <TouchableOpacity onPress={handleFlip} style={flipButtonBack}>
                    <Ionicons name="swap-horizontal" size={32} color={flipIconColorValue} />
                  </TouchableOpacity>
                </View>
                <Text style={[cardBackText, styles.cardBackTextCenter]}>DIGITAL AFc CARD</Text>
                <View style={styles.cardNumberContainer}>
                  <Text style={[cardBackText, styles.cardNumberText]} numberOfLines={1}>9876 5432 1098 7654</Text>
                  <TouchableOpacity style={styles.copyButton} onPress={handleCopyCardNumber}>
                    <Ionicons name="copy-outline" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View style={styles.cardDetailsContainer}>
                  <Text style={[cardBackText, styles.cardDetailsText]}>12/25</Text>
                  <View style={styles.cvvContainer}>
                    <TouchableOpacity onPress={handleToggleCVV}>
                      <Animated.Text 
                        style={[
                          cardBackText, 
                          styles.cardDetailsText, 
                          cvvTextWithOpacity(cvvOpacity)
                        ]}
                      >
                        123
                      </Animated.Text>
                    </TouchableOpacity>
                    <Animated.View 
                      style={[
                        styles.cvvSticker, 
                        cvvStickerWithAnimation(stickerOpacity, stickerTranslateX, stickerTranslateY, stickerRotate)
                      ]}
                    >
                      <TouchableOpacity onPress={handleToggleCVV}>
                        <Text style={styles.cvvStickerText}>AFc</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  </View>
                </View>
                <View style={styles.cardNameContainer}>
                  {/* TODO: Получать имя держателя карты из БД/профиля пользователя */}
                  <Text style={[cardBackText, styles.cardNameText]}>IVAN IVANOV</Text>
                </View>
                {showCopied && (
                  <View style={styles.copiedNotification}>
                                      <View style={styles.copiedContainer}>
                    <Ionicons name="checkmark-circle" size={16} color="#fff" style={copiedIconStyle} />
                    <Text style={styles.copiedText}>{t('client.balance.copied')}</Text>
                  </View>
                  </View>
                )}
              </View>
            </Animated.View>
            {/* Spacer для высоты */}
            <View style={cardSpacer} />
          </View>
        </View>

        {/* Быстрое пополнение - раскрывающаяся секция */}
        <View style={[styles.quickTopUpCard, dynamicStyles.quickTopUpCard]}>
          <TouchableOpacity 
            style={styles.quickTopUpHeader} 
            onPress={handleToggleQuickTopUp}
            activeOpacity={0.7}
          >
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('client.balance.quickTopUp')}</Text>
          </TouchableOpacity>
          
          <Animated.View style={{
            height: quickTopUpHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 80]
            }),
            overflow: 'hidden'
          }}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickAmountsScrollContainer}
            >
              {mockQuickAmounts.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[styles.quickAmountButtonLarge, dynamicStyles.quickAmountButtonLarge]}
                  onPress={() => handleTopUp(amount)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.quickAmountTextLarge, dynamicStyles.quickAmountTextLarge]}>{amount}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </View>

        {/* История транзакций */}
        <PaymentHistorySection customHistory={topUpHistory} />
      </ScrollView>
      {/* Модальное окно пополнения */}
      <Modal
        visible={topUpModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setTopUpModalVisible(false)}
      >
        <View style={[styles.modalOverlay, isDark && styles.modalOverlayDark]}>
          <View style={[styles.modalContainer, modalContainerWithTheme(currentColors)]}> 
            <Text style={[styles.modalTitle, modalTitleWithTheme(currentColors)]}>{t('client.balance.balanceTopUp')}</Text>
            <Text style={[styles.modalLabel, modalLabelWithTheme(currentColors)]}>{t('client.balance.amountInAFc')}</Text>
            <TextInput
              value={topUpAmount}
              onChangeText={setTopUpAmount}
              placeholder={t('client.balance.enterAmount')}
              placeholderTextColor={currentColors.textSecondary}
              keyboardType="numeric"
              style={[styles.modalInput, modalInputWithTheme(currentColors)]}
            />
            <TouchableOpacity
              style={[styles.modalPayBtn, modalPayBtnWithTheme(currentColors)]}
              onPress={() => {
                Alert.alert(
                  t('client.balance.confirm'),
                  t('client.balance.confirmTopUp', { 0: topUpAmount }),
                  [
                    { text: t('client.balance.cancel'), style: 'cancel' },
                    { text: t('client.balance.topUpBalance'), onPress: handleFakeStripePayment }
                  ]
                );
              }}
            >
              <Text style={styles.modalPayBtnText}>{t('client.balance.payButton')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTopUpModalVisible(false)} style={styles.modalCancelBtn}>
              <Text style={[styles.modalCancelBtnText, modalCancelBtnTextWithTheme(currentColors)]}>{t('client.balance.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BalanceScreen; 