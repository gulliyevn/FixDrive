import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const MapScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    backgroundColor: colors.light.background,
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
    marginLeft: 8,
  },
  profileButton: {
    padding: 4,
  },
  mapContainer: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light.surface,
  },
  mapText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.light.text,
    marginTop: 10,
  },
  mapSubtext: {
    fontSize: 16,
    color: colors.light.textSecondary,
    marginTop: 5,
  },
  locationButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: colors.light.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.light.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  onlineButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: colors.light.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  onlineButtonText: {
    color: colors.light.background,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  statsSection: {
    backgroundColor: colors.light.background,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.light.text,
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: colors.light.cardShadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.light.text,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  orderSection: {
    backgroundColor: colors.light.background,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  orderCard: {
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: colors.light.cardShadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
  },
  orderPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.light.success,
  },
  orderDetails: {
    marginBottom: 10,
  },
  orderDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  orderText: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginLeft: 8,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  completeButton: {
    backgroundColor: colors.light.success,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  completeButtonText: {
    color: colors.light.background,
    fontSize: 14,
    fontWeight: '600',
  },
  actionsSection: {
    backgroundColor: colors.light.background,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  actionButton: {
    backgroundColor: colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: colors.light.background,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  controlButton: {
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
    textAlign: 'center',
  },
}); 