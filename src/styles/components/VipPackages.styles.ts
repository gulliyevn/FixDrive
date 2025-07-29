import { StyleSheet } from 'react-native';

export const VipPackagesStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  periodSwitchContainer: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginTop: 28,
    marginBottom: 16,
    borderRadius: 24,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodButtonWrapLeft: {
    flex: 0.9,
    marginRight: 4,
  },
  periodButtonWrapRight: {
    flex: 0.9,
    marginLeft: 4,
  },
  periodButton: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 20,
    alignItems: 'center',
  },
  periodButtonInactive: {
    borderWidth: 0,
  },
  periodButtonText: {
    fontSize: 15,
    fontWeight: '600',
    opacity: 1,
    letterSpacing: 0.2,
  },
  packagesScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  packageCard: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 8,
    borderWidth: 2,
    width: 350,
    height: 480,
    justifyContent: 'space-between',
  },
  packageTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  packageDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
    textAlign: 'center',
  },
  priceButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priceText: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '700',
  },
});

export const getVipPackagesColors = (isDark: boolean) => {
  const colors = isDark ? {
    surface: '#1F2937',
    card: '#1F2937',
    border: '#374151',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    primary: '#3B82F6',
    priceButton: '#3B82F6',
  } : {
    surface: '#f9f9f9',
    card: '#ffffff',
    border: '#f0f0f0',
    text: '#003366',
    textSecondary: '#666666',
    primary: '#083198',
    priceButton: '#083198',
  };

  return {
    periodSwitchContainer: { backgroundColor: colors.surface },
    packageCard: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
    packageTitle: { color: colors.text },
    packageDescription: { color: colors.textSecondary },
    priceButton: {
      backgroundColor: colors.priceButton,
      borderColor: colors.priceButton,
    },
  };
}; 