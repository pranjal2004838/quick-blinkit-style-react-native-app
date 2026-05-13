import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {RootState} from '../../store';
import {logout} from '../../store/authSlice';
import {formatPrice} from '../../data/products';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

const C = {
  yellow: '#F8CB46',
  green: '#22C55E',
  bg: '#F8F9FB',
  card: '#FFFFFF',
  text: '#111827',
  sub: '#6B7280',
  light: '#9CA3AF',
  border: '#E5E7EB',
  red: '#EF4444',
};

const ProfileScreen = ({navigation}: Props) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const phoneNumber = useSelector((state: RootState) => state.auth.phoneNumber);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      
      {/* --- Custom Header --- */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Account</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* --- Profile Info --- */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>QuickShop User</Text>
            <Text style={styles.userPhone}>{phoneNumber}</Text>
          </View>
        </View>

        {/* --- Wallet --- */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>YOUR WALLET</Text>
          <View style={styles.walletCard}>
            <View>
              <Text style={styles.walletLabel}>Balance</Text>
              <Text style={styles.walletAmount}>
                {formatPrice(user.walletBalancePaise)}
              </Text>
            </View>
            <TouchableOpacity style={styles.topUpBtn}>
              <Text style={styles.topUpText}>+ Top Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Saved Addresses --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>SAVED ADDRESSES</Text>
            <TouchableOpacity>
              <Text style={styles.addText}>+ Add New</Text>
            </TouchableOpacity>
          </View>
          {user.addresses.map((addr) => (
            <View key={addr.id} style={styles.addressItem}>
              <View style={styles.addrIconBg}>
                <Text style={styles.addrIcon}>{addr.label === 'Home' ? '🏠' : '🏢'}</Text>
              </View>
              <View style={styles.addrTextWrap}>
                <Text style={styles.addrLabel}>{addr.label}</Text>
                <Text style={styles.addrDetails} numberOfLines={2}>
                  {addr.details}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* --- Past Orders --- */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PAST ORDERS</Text>
          {user.orders.length > 0 ? (
            user.orders.map((order) => (
              <TouchableOpacity key={order.id} style={styles.orderItem}>
                <View style={styles.orderTop}>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{order.status}</Text>
                  </View>
                </View>
                <Text style={styles.orderItems}>{order.items}</Text>
                <View style={styles.orderBottom}>
                  <Text style={styles.orderDate}>{order.date}</Text>
                  <Text style={styles.orderTotal}>{order.total}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No orders yet 🛍️</Text>
            </View>
          )}
        </View>

        {/* --- Logout --- */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>QuickShop v1.0.4 (Production)</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: C.bg},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: C.card,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backBtn: {width: 40, height: 40, justifyContent: 'center'},
  backIcon: {fontSize: 32, color: C.green, lineHeight: 36},
  headerTitle: {fontSize: 17, fontWeight: '700', color: C.text},
  
  scrollContent: {padding: 16, paddingBottom: 40},

  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: C.card,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  avatarWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  avatarText: {fontSize: 28},
  profileInfo: {},
  userName: {fontSize: 18, fontWeight: '800', color: C.text},
  userPhone: {fontSize: 14, color: C.sub, marginTop: 2},

  section: {marginBottom: 24},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: C.light,
    letterSpacing: 1,
    marginBottom: 10,
  },
  addText: {fontSize: 13, color: C.green, fontWeight: '700'},

  walletCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletLabel: {color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600'},
  walletAmount: {color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 4},
  topUpBtn: {
    backgroundColor: C.yellow,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  topUpText: {color: '#1a1a1a', fontWeight: '800', fontSize: 13},

  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  addrIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addrIcon: {fontSize: 18},
  addrTextWrap: {flex: 1},
  addrLabel: {fontSize: 14, fontWeight: '700', color: C.text},
  addrDetails: {fontSize: 13, color: C.sub, marginTop: 2},

  orderItem: {
    backgroundColor: C.card,
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {fontSize: 13, fontWeight: '700', color: C.text},
  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {fontSize: 11, color: C.green, fontWeight: '800'},
  orderItems: {fontSize: 13, color: C.sub, marginBottom: 10},
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  orderDate: {fontSize: 12, color: C.light},
  orderTotal: {fontSize: 14, fontWeight: '700', color: C.text},

  emptyCard: {
    backgroundColor: C.card,
    padding: 20,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
    borderStyle: 'dashed',
  },
  emptyText: {color: C.sub, fontSize: 14},

  logoutBtn: {
    marginTop: 10,
    backgroundColor: '#FEE2E2',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutBtnText: {color: C.red, fontWeight: '800', fontSize: 15},
  version: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 12,
    color: C.light,
    fontWeight: '500',
  },
});

export default ProfileScreen;
