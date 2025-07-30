import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Alert, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../hooks/useI18n';
import { useAvatar } from '../../hooks/useAvatar';
import { ProfileAvatarSectionStyles as styles, getProfileAvatarSectionColors } from '../../styles/components/profile/ProfileAvatarSection.styles';

type PackageType = 'free' | 'basic' | 'premium' | 'family';

interface ProfileAvatarSectionProps {
  userName: string;
  userSurname: string;
  onCirclePress: () => void;
  rotateAnim: Animated.Value;
  currentPackage?: PackageType;
}

const ProfileAvatarSection: React.FC<ProfileAvatarSectionProps> = ({
  userName,
  userSurname,
  onCirclePress,
  rotateAnim,
  currentPackage = 'free',
}) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { avatarUri, loading, showAvatarOptions } = useAvatar();
  const dynamicStyles = getProfileAvatarSectionColors(isDark);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const handleAvatarPress = () => {
    if (avatarUri) {
      setShowAvatarModal(true);
    }
  };

  const closeAvatarModal = () => {
    setShowAvatarModal(false);
  };

  const getPackageIcon = () => {
    switch (currentPackage) {
      case 'free': return 'leaf';
      case 'basic': return 'shield';
      case 'premium': return 'heart';
      case 'family': return 'diamond';
      default: return 'leaf';
    }
  };

  const getPackageColor = () => {
    switch (currentPackage) {
      case 'free': return '#10B981';
      case 'basic': return '#3B82F6';
      case 'premium': return '#8B5CF6';
      case 'family': return '#F59E0B';
      default: return '#10B981';
    }
  };

  return (
    <View style={styles.avatarSection}>
      <View style={[styles.profileNameBox, dynamicStyles.profileNameBox]}>
        <TouchableOpacity 
          style={styles.avatar}
          onPress={handleAvatarPress}
          disabled={!avatarUri}
        >
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <Ionicons 
              name="person-circle-outline" 
              size={60} 
              color="#FFFFFF" 
            />
          )}
          <TouchableOpacity 
            style={[styles.addPhotoButton, loading && { opacity: 0.5 }]}
            onPress={showAvatarOptions}
            disabled={loading}
            accessibilityLabel={avatarUri ? t('profile.changePhoto') : t('profile.addPhoto')}
          >
            {loading ? (
              <Ionicons name="hourglass-outline" size={12} color="#083198" />
            ) : (
              <Ionicons name={avatarUri ? "camera" : "add"} size={12} color="#083198" />
            )}
          </TouchableOpacity>
        </TouchableOpacity>
        <View style={styles.nameAndIconContainer}>
          <Text 
            style={[styles.profileName, dynamicStyles.profileName]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {userName} {userSurname}
          </Text>
          <View style={styles.packageIconContainer}>
            <Ionicons 
              name={getPackageIcon()} 
              size={20} 
              color={getPackageColor()} 
            />
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.rightCircle, dynamicStyles.rightCircle]}
          onPress={onCirclePress}
          activeOpacity={0.7}
        >
          <Animated.View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              transform: [{
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg']
                })
              }]
            }}
          >
            <Ionicons name="sync" size={20} color={isDark ? '#9CA3AF' : '#666666'} />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Модальное окно для просмотра аватара */}
      <Modal
        visible={showAvatarModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeAvatarModal}
      >
        <View style={styles.avatarModalOverlay}>
          <TouchableOpacity 
            style={styles.avatarModalBackground} 
            onPress={closeAvatarModal}
            activeOpacity={1}
          >
            <TouchableOpacity 
              style={styles.avatarModalContent}
              onPress={() => {}} // Предотвращаем закрытие при нажатии на фото
              activeOpacity={1}
            >
              <Image 
                source={{ uri: avatarUri }} 
                style={styles.avatarModalImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileAvatarSection; 