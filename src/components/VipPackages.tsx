import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../constants/colors';
import { VipPackagesStyles, getVipPackagesColors } from '../styles/components/VipPackages.styles';
import { getPremiumPackages, VipPackage } from '../mocks/premiumPackagesMock';

interface VipPackagesProps {
  onSelectPackage: (packageId: string, price: number) => void;
  selectedPackage?: string;
}

const VipPackages: React.FC<VipPackagesProps> = ({ onSelectPackage, selectedPackage }) => {
  const { isDark } = useTheme();
  const currentColors = isDark ? colors.dark : colors.light;
  const dynamicStyles = getVipPackagesColors(isDark);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year'>('month');

  // Один Animated.Value для плавного перехода
  const periodAnim = useRef(new Animated.Value(0)).current; // 0 - месяц, 1 - год

  useEffect(() => {
    Animated.timing(periodAnim, {
      toValue: selectedPeriod === 'year' ? 1 : 0,
      duration: 220,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [selectedPeriod]);

  const packages = getPremiumPackages(selectedPeriod, currentColors);

  return (
    <View style={VipPackagesStyles.container}>
      {/* Период подписки */}
      <View style={[VipPackagesStyles.periodSwitchContainer, dynamicStyles.periodSwitchContainer]}>
        <TouchableOpacity
          style={VipPackagesStyles.periodButtonWrapLeft}
          onPress={() => setSelectedPeriod('month')}
          activeOpacity={0.9}
        >
          <Animated.View
            style={[
              VipPackagesStyles.periodButton,
              selectedPeriod !== 'month' && VipPackagesStyles.periodButtonInactive,
              selectedPeriod === 'month' && {
                backgroundColor: currentColors.primary,
                shadowOpacity: 0.08,
                elevation: 2,
              },
            ]}
          >
            <Text style={[
              VipPackagesStyles.periodButtonText,
              { color: selectedPeriod === 'month' ? '#fff' : currentColors.text },
            ]}>
              Месяц
            </Text>
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity
          style={VipPackagesStyles.periodButtonWrapRight}
          onPress={() => setSelectedPeriod('year')}
          activeOpacity={0.9}
        >
          <Animated.View
            style={[
              VipPackagesStyles.periodButton,
              selectedPeriod !== 'year' && VipPackagesStyles.periodButtonInactive,
              selectedPeriod === 'year' && {
                backgroundColor: currentColors.primary,
                shadowOpacity: 0.08,
                elevation: 2,
              },
            ]}
          >
            <Text style={[
              VipPackagesStyles.periodButtonText,
              { color: selectedPeriod === 'year' ? '#fff' : currentColors.text },
            ]}>
              Год
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Пакеты */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={VipPackagesStyles.packagesScrollContent}
        snapToInterval={366}
        decelerationRate="fast"
        snapToAlignment="center"
        contentInsetAdjustmentBehavior="automatic"
      >
        {packages.map((pkg) => (
          <View
            key={pkg.id}
            style={[VipPackagesStyles.packageCard, dynamicStyles.packageCard]}
          >
            <Text style={[VipPackagesStyles.packageTitle, dynamicStyles.packageTitle]}>
              {pkg.name}
            </Text>

            <Text style={[VipPackagesStyles.packageDescription, dynamicStyles.packageDescription]}>
              {pkg.description}
            </Text>

            <TouchableOpacity
              style={[VipPackagesStyles.priceButton, dynamicStyles.priceButton]}
              onPress={() => onSelectPackage(pkg.id, pkg.price)}
              activeOpacity={0.7}
            >
              <Text style={VipPackagesStyles.priceText}>
                {pkg.price} AFC
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default VipPackages; 