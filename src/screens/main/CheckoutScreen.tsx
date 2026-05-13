import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {selectCartItems, selectGrandTotal, clearCart} from '../../store/cartSlice';
import {formatPrice} from '../../data/products';
import {RootState} from '../../store';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Checkout'>;
};

// random order id like OX-AB12CD34
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

  const [address, setAddress] = useState('');
  const [addrError, setAddrError] = useState('');
  const [payMode, setPayMode] = useState<'cod' | 'online'>('cod');
  const [placing, setPlacing] = useState(false);

  // build the summary text that'll show on the success screen
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
    // validate address (same 8-500 rule as the kotlin app)
    const trimmed = address.trim();
    if (trimmed.length < 8) {
      setAddrError('Address must be at least 8 characters');
      return;
    }
    if (trimmed.length > 500) {
      setAddrError('Address too long (max 500 characters)');
      return;
    }
    setAddrError('');

    if (cartItems.length === 0) {
      Alert.alert('Cart is empty', 'Add some items before placing order');
      return;
    }

    setPlacing(true);

    const orderId = makeOrderId();
    const eta = `${Math.floor(Math.random() * 11) + 8} min`; // 8 to 18
    const payLabel = payMode === 'cod' ? 'Cash on Delivery' : 'Online Payment';
    const summary = buildSummary();
    const total = formatPrice(grandTotal);

    // small delay to feel real
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
    }, 500);
  };

  const canPlace = cartItems.length > 0 && !placing;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        {/* header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{width: 50}} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled">
          {/* order preview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            {cartItems.map(item => (
              <View key={item.product.id} style={styles.previewLine}>
                <Text style={styles.previewName} numberOfLines={1}>
                  {item.product.name} ×{item.qty}
                </Text>
                <Text style={styles.previewPrice}>
                  {formatPrice(item.product.pricePaise * item.qty)}
                </Text>
              </View>
            ))}
            <View style={[styles.previewLine, styles.totalLine]}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalVal}>{formatPrice(grandTotal)}</Text>
            </View>
          </View>

          {/* delivery address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TextInput
              style={[styles.addrInput, addrError ? styles.addrInputErr : null]}
              placeholder="Enter your full delivery address..."
              placeholderTextColor="#aaa"
              value={address}
              onChangeText={txt => {
                setAddress(txt);
                if (addrError) setAddrError('');
              }}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            {addrError.length > 0 && (
              <Text style={styles.errText}>{addrError}</Text>
            )}
          </View>

          {/* payment mode picker */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>

            <TouchableOpacity
              style={[styles.radio, payMode === 'cod' && styles.radioActive]}
              onPress={() => setPayMode('cod')}>
              <View style={styles.radioCircle}>
                {payMode === 'cod' && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioText}>Cash on Delivery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.radio, payMode === 'online' && styles.radioActive]}
              onPress={() => setPayMode('online')}>
              <View style={styles.radioCircle}>
                {payMode === 'online' && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioText}>Online Payment (Demo)</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* place order */}
        <TouchableOpacity
          style={[styles.placeBtn, !canPlace && styles.placeBtnOff]}
          onPress={handlePlaceOrder}
          disabled={!canPlace}
          activeOpacity={0.8}>
          <Text style={styles.placeBtnText}>
            {placing ? 'Placing Order...' : 'Place Order'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f8f8f8'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backText: {fontSize: 15, color: '#4CAF50', fontWeight: '600'},
  headerTitle: {fontSize: 17, fontWeight: 'bold', color: '#1a1a1a'},
  scroll: {padding: 16, paddingBottom: 100},
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  previewLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  previewName: {flex: 1, fontSize: 13, color: '#555', marginRight: 8},
  previewPrice: {fontSize: 13, color: '#333', fontWeight: '500'},
  totalLine: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
    marginTop: 6,
  },
  totalLabel: {fontWeight: 'bold', fontSize: 14, color: '#1a1a1a'},
  totalVal: {fontWeight: 'bold', fontSize: 14, color: '#4CAF50'},
  addrInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    minHeight: 80,
  },
  addrInputErr: {borderColor: '#e53935'},
  errText: {color: '#e53935', fontSize: 12, marginTop: 6},
  // radio buttons
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#eee',
  },
  radioActive: {borderColor: '#4CAF50', backgroundColor: '#f1f9f1'},
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  radioText: {fontSize: 14, color: '#333'},
  placeBtn: {
    backgroundColor: '#4CAF50',
    margin: 16,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  placeBtnOff: {backgroundColor: '#ccc'},
  placeBtnText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
});

export default CheckoutScreen;
