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
        snapToInterval={380}
        decelerationRate="fast"
        snapToAlignment="center"
        contentInsetAdjustmentBehavior="automatic"
      >
        {packages.map((pkg, index) => (
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

            {/* Таблица функций */}
            <View style={VipPackagesStyles.featuresContainer}>
              {packageFeatures.map((feature, featureIndex) => {
                const featureIcon = getFeatureIcon(feature.name);
                const isLastRow = featureIndex === packageFeatures.length - 1;
                return (
                  <View key={featureIndex} style={[
                    VipPackagesStyles.featureRow,
                    isLastRow && { borderBottomWidth: 0 }
                  ]}>
                    <View style={VipPackagesStyles.featureNameContainer}>
                      <View style={[VipPackagesStyles.iconWrapper, { backgroundColor: featureIcon.color + '15' }]}>
                        <Ionicons 
                          name={featureIcon.name as any} 
                          size={14} 
                          color={featureIcon.color} 
                        />
                      </View>
                      <Text style={[VipPackagesStyles.featureName, { color: currentColors.textSecondary }]}>
                        {feature.name}
                      </Text>
                    </View>
                    <View style={VipPackagesStyles.featureValueContainer}>
                      {renderFeatureValue(
                        getFeatureValue(feature, pkg.id), 
                        pkg.id !== 'free'
                      )}
                    </View>
                  </View>
                );
              })}
            </View>

            <TouchableOpacity
              style={[VipPackagesStyles.priceButton, dynamicStyles.priceButton]}
              onPress={() => onSelectPackage(pkg.id, pkg.price)}
              activeOpacity={0.7}
            >
              <View style={VipPackagesStyles.priceContainer}>
                <Text style={VipPackagesStyles.priceText}>
                  {pkg.price} AFC
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default VipPackages; 