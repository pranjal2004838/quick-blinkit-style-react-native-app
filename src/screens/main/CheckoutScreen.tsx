import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {
  selectCartItems,
  selectGrandTotal,
  selectItemTotal,
  selectDeliveryFee,
  clearCart,
} from '../../store/cartSlice';
import {formatPrice} from '../../data/products';
import {RootState} from '../../store';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Checkout'>;
};

// --- palette (consistent with the rest of the app) ---
const C = {
  yellow: '#F8CB46',
  green: '#22C55E',
  greenDark: '#16A34A',
  bg: '#F3F4F6',
  card: '#FFFFFF',
  text: '#111827',
  sub: '#6B7280',
  light: '#9CA3AF',
  border: '#E5E7EB',
  red: '#EF4444',
};

function makeOrderId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'OX-';
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

const CheckoutScreen = ({navigation}: Props) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => selectCartItems(state));
  const grandTotal = useSelector((state: RootState) => selectGrandTotal(state));
  const itemTotal = useSelector((state: RootState) => selectItemTotal(state));
  const deliveryFee = selectDeliveryFee();

  const [address, setAddress] = useState('');
  const [addrError, setAddrError] = useState('');
  const [payMode, setPayMode] = useState<'cod' | 'online'>('cod');
  const [placing, setPlacing] = useState(false);

  const buildSummary = () =>
    cartItems
      .map(
        i =>
          `${i.product.name} ×${i.qty} — ${formatPrice(
            i.product.pricePaise * i.qty,
          )}`,
      )
      .join('\n');

  const handlePlaceOrder = () => {
    const trimmed = address.trim();
    if (trimmed.length < 8) {
      setAddrError('Please enter a valid delivery address (min 8 characters)');
      return;
    }
    if (trimmed.length > 500) {
      setAddrError('Address is too long (max 500 characters)');
      return;
    }
    setAddrError('');

    if (cartItems.length === 0) {
      Alert.alert('Cart is empty', 'Add some items before placing an order.');
      return;
    }

    setPlacing(true);

    const orderId = makeOrderId();
    const eta = `${Math.floor(Math.random() * 11) + 8} min`;
    const payLabel = payMode === 'cod' ? 'Cash on Delivery' : 'Online Payment';
    const summary = buildSummary();
    const total = formatPrice(grandTotal);

    setTimeout(() => {
      dispatch(clearCart());
      navigation.navigate('Success', {
        orderId,
        eta,
        address: trimmed,
        payMode: payLabel,
        summary,
        totalDisplay: total,
      });
    }, 600);
  };

  const canPlace = cartItems.length > 0 && address.trim().length >= 8 && !placing;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.card} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{width: 40}} />
      </View>

      {/* ── Scrollable body ── */}
      {/* NOTE: No KeyboardAvoidingView wrapping this — it caused blank screens
          on Android (behavior=undefined breaks layout). Using keyboardShouldPersistTaps
          + paddingBottom on content container instead. */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* Order Summary card */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🧾</Text>
            <Text style={styles.sectionTitle}>Order Summary</Text>
          </View>

          {cartItems.map(item => (
            <View key={item.product.id} style={styles.lineItem}>
              <View style={styles.lineLeft}>
                <Text style={styles.lineName} numberOfLines={1}>
                  {item.product.name}
                </Text>
                <Text style={styles.lineQty}>Qty: {item.qty}</Text>
              </View>
              <Text style={styles.linePrice}>
                {formatPrice(item.product.pricePaise * item.qty)}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billVal}>{formatPrice(itemTotal)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={styles.billVal}>{formatPrice(deliveryFee)}</Text>
          </View>
          <View style={[styles.billRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalVal}>{formatPrice(grandTotal)}</Text>
          </View>
        </View>

        {/* Delivery Address card */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📍</Text>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <TextInput
            style={[
              styles.addrInput,
              addrError ? styles.addrInputErr : null,
              address.trim().length >= 8 && !addrError
                ? styles.addrInputOk
                : null,
            ]}
            placeholder="House / Flat no., Street, Area, City..."
            placeholderTextColor={C.light}
            value={address}
            onChangeText={txt => {
              setAddress(txt);
              if (addrError) setAddrError('');
            }}
            multiline
            numberOfLines={Platform.OS === 'ios' ? undefined : 3}
            textAlignVertical="top"
            returnKeyType="done"
          />
          {addrError.length > 0 && (
            <Text style={styles.errText}>{addrError}</Text>
          )}
          {address.trim().length > 0 && address.trim().length < 8 && (
            <Text style={styles.hintText}>
              {8 - address.trim().length} more character
              {8 - address.trim().length !== 1 ? 's' : ''} needed
            </Text>
          )}
        </View>

        {/* Payment Method card */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>💳</Text>
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>

          <TouchableOpacity
            style={[styles.payOption, payMode === 'cod' && styles.payOptionActive]}
            onPress={() => setPayMode('cod')}
            activeOpacity={0.7}>
            <View style={[styles.radioOuter, payMode === 'cod' && styles.radioOuterActive]}>
              {payMode === 'cod' && <View style={styles.radioDot} />}
            </View>
            <View style={styles.payInfo}>
              <Text style={styles.payTitle}>Cash on Delivery</Text>
              <Text style={styles.paySub}>Pay when your order arrives</Text>
            </View>
            <Text style={styles.payEmoji}>💵</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.payOption, payMode === 'online' && styles.payOptionActive]}
            onPress={() => setPayMode('online')}
            activeOpacity={0.7}>
            <View style={[styles.radioOuter, payMode === 'online' && styles.radioOuterActive]}>
              {payMode === 'online' && <View style={styles.radioDot} />}
            </View>
            <View style={styles.payInfo}>
              <Text style={styles.payTitle}>Online Payment</Text>
              <Text style={styles.paySub}>UPI, Card, Net Banking (Demo)</Text>
            </View>
            <Text style={styles.payEmoji}>📱</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacer so content clears the fixed CTA */}
        <View style={{height: 100}} />
      </ScrollView>

      {/* ── Fixed bottom CTA ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.placeBtn, !canPlace && styles.placeBtnOff]}
          onPress={handlePlaceOrder}
          disabled={!canPlace}
          activeOpacity={0.85}>
          {placing ? (
            <Text style={styles.placeBtnText}>Placing your order…</Text>
          ) : (
            <Text style={styles.placeBtnText}>
              Place Order · {formatPrice(grandTotal)}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: C.bg},

  // header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 32,
    color: C.green,
    lineHeight: 36,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: C.text,
  },

  // scroll
  scroll: {flex: 1},
  scrollContent: {padding: 16},

  // card
  card: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    // Android shadow
    elevation: 2,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionIcon: {fontSize: 18, marginRight: 8},
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: C.text,
  },

  // line items
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  lineLeft: {flex: 1, marginRight: 12},
  lineName: {fontSize: 14, color: C.text, fontWeight: '500'},
  lineQty: {fontSize: 12, color: C.sub, marginTop: 2},
  linePrice: {fontSize: 14, fontWeight: '600', color: C.text},

  // bill
  divider: {height: 1, backgroundColor: C.border, marginVertical: 10},
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  billLabel: {fontSize: 13, color: C.sub},
  billVal: {fontSize: 13, color: C.text},
  totalRow: {
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  totalLabel: {fontSize: 15, fontWeight: '700', color: C.text},
  totalVal: {fontSize: 15, fontWeight: '700', color: C.green},

  // address
  addrInput: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: C.text,
    minHeight: 90,
    lineHeight: 20,
  },
  addrInputErr: {borderColor: C.red},
  addrInputOk: {borderColor: C.green},
  errText: {color: C.red, fontSize: 12, marginTop: 6},
  hintText: {color: C.light, fontSize: 12, marginTop: 6},

  // payment
  payOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    marginBottom: 10,
  },
  payOptionActive: {
    borderColor: C.green,
    backgroundColor: '#F0FDF4',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: C.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioOuterActive: {borderColor: C.green},
  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: C.green,
  },
  payInfo: {flex: 1},
  payTitle: {fontSize: 14, fontWeight: '600', color: C.text},
  paySub: {fontSize: 12, color: C.sub, marginTop: 2},
  payEmoji: {fontSize: 22},

  // bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.card,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'android' ? 16 : 8,
    borderTopWidth: 1,
    borderTopColor: C.border,
    // shadow upwards
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  placeBtn: {
    backgroundColor: C.green,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  placeBtnOff: {backgroundColor: '#D1D5DB'},
  placeBtnText: {color: '#fff', fontSize: 16, fontWeight: '700'},
});

export default CheckoutScreen;
