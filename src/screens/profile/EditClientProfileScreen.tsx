import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Image, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { EditClientProfileScreenStyles as styles, getEditClientProfileScreenColors } from '../../styles/screens/profile/EditClientProfileScreen.styles';
import { Ionicons } from '@expo/vector-icons';
import { ClientScreenProps } from '../../types/navigation';
import { mockUsers } from '../../mocks/users';
import { useAuth } from '../../context/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useProfile } from '../../hooks/useProfile';
import { useVerification } from '../../hooks/useVerification';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';
import { getDefaultDate, hasChanges, handleCirclePress } from '../../utils/profileHelpers';
import DatePicker from '../../components/DatePicker';
import PersonalInfoSection from '../../components/profile/PersonalInfoSection';
import FamilySection from '../../components/profile/FamilySection';
import AddFamilyModal from '../../components/profile/AddFamilyModal';
import ProfileAvatarSection from '../../components/profile/ProfileAvatarSection';
import VipSection from '../../components/profile/VipSection';
import ProfileHeader from '../../components/profile/ProfileHeader';
import { useI18n } from '../../hooks/useI18n';
import { FamilyMember } from '../../types/family';
import { usePackage } from '../../hooks/usePackage';

const EditClientProfileScreen: React.FC<ClientScreenProps<'EditClientProfile'>> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { logout, login } = useAuth();
  const rootNavigation = useNavigation();
  const dynamicStyles = getEditClientProfileScreenColors(isDark);
  const currentColors = isDark ? { dark: { primary: '#3B82F6' } } : { light: { primary: '#083198' } };
  
  const { profile, updateProfile, loadProfile } = useProfile();
  const { currentPackage } = usePackage();
  const user = profile || mockUsers[0];
  
  // Состояние формы
  const [formData, setFormData] = useState({
    firstName: user.name,
    lastName: user.surname,
    phone: user.phone,
    email: user.email,
    birthDate: user.birthDate || '1990-01-01',
  });

  // Исходные данные для сравнения
  const originalDataRef = useRef({
    firstName: user.name,
    lastName: user.surname,
    phone: user.phone,
    email: user.email,
    birthDate: user.birthDate || '1990-01-01',
  });

  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Хуки для верификации и семейных членов
  const {
    verificationStatus,
    isVerifying,
    loadVerificationStatus,
    resetVerificationStatus,
    verifyEmail,
    verifyPhone,
  } = useVerification();

  const {
    familyMembers,
    expandedFamilyMember,
    editingFamilyMember,
    showAddFamilyModal,
    newFamilyMember,
    setNewFamilyMember,
    familyPhoneVerification,
    familyPhoneVerifying,
    toggleFamilyMember,
    openAddFamilyModal,
    closeAddFamilyModal,
    addFamilyMember,
    startEditingFamilyMember,
    cancelEditingFamilyMember,
    saveFamilyMember,
    deleteFamilyMember,
    verifyFamilyPhone,
    resetFamilyPhoneVerification,
  } = useFamilyMembers();

  const saveFamilyRef = useRef<(() => void) | null>(null);

  // Функция для проверки изменений
  const checkHasChanges = () => {
    return formData.firstName !== originalDataRef.current.firstName ||
           formData.lastName !== originalDataRef.current.lastName ||
           formData.phone !== originalDataRef.current.phone ||
           formData.email !== originalDataRef.current.email;
  };

  const handleFamilyExit = () => {
    // Если есть активное редактирование семейного члена
    if (editingFamilyMember !== null) {
      // Проверяем, есть ли изменения через функцию сохранения
      if (saveFamilyRef.current) {
        // Если есть функция сохранения, значит есть изменения - показываем диалог
        Alert.alert(
          t('common.confirmation'),
          t('profile.family.confirmSave'),
          [
            { 
              text: t('common.cancel'), 
              style: 'cancel',
              onPress: () => {
                // При отмене НЕ делаем ничего - остаемся в режиме редактирования
                // Пользователь остается на экране и может продолжить редактирование
              }
            },
            { 
              text: t('common.save'), 
              onPress: () => {
                // Сохраняем изменения и отменяем редактирование
                handleFamilySave();
              }
            }
          ]
        );
      } else {
        // Если нет функции сохранения, значит изменений нет - сразу выходим
        cancelEditingFamilyMember();
        navigation.goBack();
      }
    } else {
      // Если нет активного редактирования, просто уходим назад
      navigation.goBack();
    }
  };

  const handleFamilySave = () => {
    // Вызываем функцию сохранения из ref, если она есть
    if (saveFamilyRef.current) {
      saveFamilyRef.current();
    }
    
    // Отменяем редактирование
    cancelEditingFamilyMember();
    
    // Уходим назад напрямую, без вызова handleFamilyExit
    navigation.goBack();
  };

  // Функция валидации полей личной информации
  const validatePersonalInfo = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!formData.firstName.trim()) {
      errors.push(t('profile.validation.firstNameRequired'));
    }
    
    if (!formData.lastName.trim()) {
      errors.push(t('profile.validation.lastNameRequired'));
    }
    
    // Телефон не обязателен
    // if (!formData.phone.trim()) {
    //   errors.push(t('profile.validation.phoneRequired'));
    // }
    
    if (!formData.email.trim()) {
      errors.push(t('profile.validation.emailRequired'));
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Асинхронная функция сохранения профиля
  const saveProfile = async (): Promise<boolean> => {
    try {
      // Проверяем, есть ли изменения в форме
      const hasFormChanges = formData.firstName !== originalDataRef.current.firstName ||
                            formData.lastName !== originalDataRef.current.lastName ||
                            formData.phone !== originalDataRef.current.phone ||
                            formData.email !== originalDataRef.current.email;

      if (hasFormChanges) {
        // Валидируем поля перед сохранением
        const validation = validatePersonalInfo();
        if (!validation.isValid) {
          Alert.alert(
            t('profile.validation.title'),
            validation.errors.join('\n'),
            [{ text: t('common.ok'), style: 'default' }]
          );
          return false;
        }

        // Сохраняем изменения в форме
        const updateData: any = {};
        
        if (hasFormChanges) {
          updateData.name = formData.firstName.trim();
          updateData.surname = formData.lastName.trim();
          updateData.phone = formData.phone.trim();
          updateData.email = formData.email.trim();
        }

        const success = await updateProfile(updateData);

        if (success) {
          Alert.alert(
            t('profile.profileUpdateSuccess.title'),
            t('profile.profileUpdateSuccess.message')
          );
          setIsEditingPersonalInfo(false);
          // Обновляем исходные данные
          originalDataRef.current = { ...formData };
          return true;
        } else {
          Alert.alert(
            t('profile.profileUpdateError.title'),
            t('profile.profileUpdateError.message')
          );
          return false;
        }
      } else {
        // Если изменений нет, просто закрываем режим редактирования
        setIsEditingPersonalInfo(false);
        return true;
      }
    } catch (error) {
      Alert.alert(
        t('profile.profileUpdateGeneralError.title'),
        t('profile.profileUpdateGeneralError.message')
      );
      return false;
    }
  };

  // Обработчик для перехвата swipe-back жеста
  const handleBackPress = useCallback(() => {
    const hasPersonalChanges = isEditingPersonalInfo && checkHasChanges();
    const hasFamilyEditing = editingFamilyMember !== null;
    
    if (hasPersonalChanges) {
      Alert.alert(
        t('profile.saveChangesConfirm.title'),
        t('profile.saveChangesConfirm.message'),
        [
          { 
            text: t('profile.saveChangesConfirm.cancel'), 
            style: 'cancel',
            onPress: () => navigation.goBack()
          },
          { 
            text: t('profile.saveChangesConfirm.save'), 
            onPress: async () => {
              const success = await saveProfile();
              if (success) {
                navigation.goBack();
              }
            }
          }
        ]
      );
    } else if (hasFamilyEditing) {
      // Если есть редактирование семейной секции, используем специальную обработку
      
      // Проверяем, есть ли изменения через функцию сохранения
      if (saveFamilyRef.current) {
        // Если есть изменения - показываем диалог
        Alert.alert(
          t('common.confirmation'),
          t('profile.family.confirmSave'),
          [
            { 
              text: t('common.cancel'), 
              style: 'cancel',
              onPress: () => {
                // При отмене НЕ делаем ничего - остаемся в режиме редактирования
              }
            },
            { 
              text: t('common.save'), 
              onPress: () => {
                // Сохраняем изменения и отменяем редактирование
                if (saveFamilyRef.current) {
                  saveFamilyRef.current();
                }
                cancelEditingFamilyMember();
                navigation.goBack();
              }
            }
          ]
        );
      } else {
        // Если нет изменений - сразу выходим
        cancelEditingFamilyMember();
        navigation.goBack();
      }
    } else {
      navigation.goBack();
    }
  }, [isEditingPersonalInfo, checkHasChanges, editingFamilyMember, saveProfile, saveFamilyRef, cancelEditingFamilyMember, navigation, t]);

  // Перехватываем swipe-back жест
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
        const hasPersonalChanges = isEditingPersonalInfo && checkHasChanges();
        const hasFamilyEditing = editingFamilyMember !== null;
        
        if (hasPersonalChanges) {
          // Предотвращаем переход назад
          e.preventDefault();
          
          Alert.alert(
            t('profile.saveChangesConfirm.title'),
            t('profile.saveChangesConfirm.message'),
            [
              { 
                text: t('profile.saveChangesConfirm.cancel'), 
                style: 'cancel',
                onPress: () => navigation.dispatch(e.data.action)
              },
              { 
                text: t('profile.saveChangesConfirm.save'), 
                onPress: async () => {
                  const success = await saveProfile();
                  if (success) {
                    navigation.dispatch(e.data.action);
                  }
                }
              }
            ]
          );
        } else if (hasFamilyEditing) {
          // Если есть редактирование семейной секции, используем специальную обработку
          e.preventDefault();
          
          // Проверяем, есть ли изменения через функцию сохранения
          if (saveFamilyRef.current) {
            // Если есть изменения - показываем диалог
            Alert.alert(
              t('common.confirmation'),
              t('profile.family.confirmSave'),
              [
                { 
                  text: t('common.cancel'), 
                  style: 'cancel',
                  onPress: () => {
                    // При отмене НЕ делаем ничего - остаемся в режиме редактирования
                  }
                },
                { 
                  text: t('common.save'), 
                  onPress: () => {
                    // Сохраняем изменения и отменяем редактирование
                    if (saveFamilyRef.current) {
                      saveFamilyRef.current();
                    }
                    cancelEditingFamilyMember();
                    navigation.dispatch(e.data.action);
                  }
                }
              ]
            );
          } else {
            // Если нет изменений - сразу выходим
            cancelEditingFamilyMember();
            navigation.dispatch(e.data.action);
          }
        }
      });

      return unsubscribe;
    }, [navigation, isEditingPersonalInfo, checkHasChanges, editingFamilyMember, saveProfile, saveFamilyRef, cancelEditingFamilyMember, t])
  );

  const handleCirclePressAction = () => {
    // Анимация вращения
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
      
      // После завершения анимации вызываем функцию из утилит
      handleCirclePress(navigation, login, t);
    });
  };

  // Загружаем данные только один раз при монтировании компонента
  useEffect(() => {
    loadProfile();
    loadVerificationStatus();
  }, []); // Пустой массив зависимостей - выполняется только один раз

  // Обновляем форму при изменении профиля
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.name,
        lastName: profile.surname,
        phone: profile.phone,
        email: profile.email,
        birthDate: profile.birthDate || '1990-01-01',
      });
      
      // Обновляем исходные данные
      originalDataRef.current = {
        firstName: profile.name,
        lastName: profile.surname,
        phone: profile.phone,
        email: profile.email,
        birthDate: profile.birthDate || '1990-01-01',
      };
    }
  }, [profile]);

  // Убираем автоматическое сохранение фото - теперь фото сохраняется только при явном сохранении

  // Автоматически сохраняем дату при её изменении
  useEffect(() => {
    if (profile && formData.birthDate !== profile.birthDate && formData.birthDate !== originalDataRef.current.birthDate) {
      // Сохраняем только дату, не трогая остальные данные
      updateProfile({ birthDate: formData.birthDate });
    }
  }, [formData.birthDate]);



  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <ProfileHeader
        onBackPress={handleBackPress}
                  onEditPress={() => {
           if (isEditingPersonalInfo) {
             // Если в режиме редактирования, проверяем изменения
             const hasChanges = checkHasChanges();
             
             if (hasChanges) {
              // Если есть изменения, показываем подтверждение
              Alert.alert(
                t('profile.saveProfileConfirm.title'),
                t('profile.saveProfileConfirm.message'),
                [
                  { 
                    text: t('profile.saveProfileConfirm.cancel'), 
                    style: 'cancel' 
                  },
                  { 
                    text: t('profile.saveProfileConfirm.save'), 
                    onPress: async () => {
                      const success = await saveProfile();
                      if (success) {
                        setIsEditingPersonalInfo(false);
                      }
                    }
                  }
                ]
              );
            } else {
              // Если изменений нет, просто выключаем режим редактирования без подтверждения
              setIsEditingPersonalInfo(false);
            }
          } else {
            // Если в режиме просмотра, включаем редактирование
            setIsEditingPersonalInfo(true);
          }
        }}
        isEditing={isEditingPersonalInfo}
      />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <ProfileAvatarSection
          userName={user.name}
          userSurname={user.surname}
          onCirclePress={handleCirclePressAction}
          rotateAnim={rotateAnim}
          currentPackage={currentPackage}
        />

        <PersonalInfoSection
          formData={formData}
          setFormData={setFormData}
          isEditing={isEditingPersonalInfo}
          verificationStatus={verificationStatus}
          isVerifying={isVerifying}
          onVerifyEmail={verifyEmail}
          onVerifyPhone={verifyPhone}
          onResetVerification={resetVerificationStatus}
        />

        <FamilySection
          familyMembers={familyMembers}
          expandedFamilyMember={expandedFamilyMember}
          editingFamilyMember={editingFamilyMember}
          familyPhoneVerification={familyPhoneVerification}
          onToggleFamilyMember={toggleFamilyMember}
          onOpenAddFamilyModal={openAddFamilyModal}
          onStartEditing={startEditingFamilyMember}
          onCancelEditing={cancelEditingFamilyMember}
          onSaveMember={saveFamilyMember}
          onDeleteMember={deleteFamilyMember}
          onResetPhoneVerification={resetFamilyPhoneVerification}
          onVerifyPhone={verifyFamilyPhone}
          saveFamilyRef={saveFamilyRef}
        />

        <VipSection 
          onVipPress={() => navigation.navigate('PremiumPackages')}
        />

      </ScrollView>

      <AddFamilyModal
        visible={showAddFamilyModal}
        newFamilyMember={newFamilyMember}
        setNewFamilyMember={setNewFamilyMember}
        onClose={closeAddFamilyModal}
        onAdd={addFamilyMember}
        onVerifyPhone={verifyPhone}
        phoneVerificationStatus={verificationStatus.phone}
        isVerifyingPhone={isVerifying.phone}
      />
    </View>
  );
};

export default EditClientProfileScreen;