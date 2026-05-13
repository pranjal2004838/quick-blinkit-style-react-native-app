import React, {useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {
  CartItem,
  selectCartItems,
  selectItemTotal,
  selectDeliveryFee,
  selectGrandTotal,
  increment,
  decrement,
  removeFromCart,
} from '../../store/cartSlice';
import {formatPrice} from '../../data/products';
import {RootState} from '../../store';

const C = {
  yellow: '#F8CB46',
  green: '#22C55E',
  bg: '#F3F4F6',
  card: '#FFFFFF',
  text: '#111827',
  sub: '#6B7280',
  light: '#9CA3AF',
  border: '#E5E7EB',
  red: '#EF4444',
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Cart'>;
};

const CartScreen = ({navigation}: Props) => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => selectCartItems(state));
  const itemTotal = useSelector((state: RootState) => selectItemTotal(state));
  const deliveryFee = selectDeliveryFee();
  const grandTotal = useSelector((state: RootState) => selectGrandTotal(state));

  const renderCartItem = useCallback(
    ({item}: {item: CartItem}) => {
      const lineTotal = item.product.pricePaise * item.qty;
      return (
        <View style={styles.row}>
          <Image
            source={{uri: item.product.imageUrl}}
            style={styles.rowImg}
            resizeMode="cover"
          />
          <View style={styles.rowBody}>
            <Text style={styles.rowName} numberOfLines={2}>
              {item.product.name}
            </Text>
            <Text style={styles.rowUnit}>
              {formatPrice(item.product.pricePaise)} each
            </Text>
            <Text style={styles.rowTotal}>{formatPrice(lineTotal)}</Text>
          </View>

          <View style={styles.rowActions}>
            <View style={styles.qtyWrap}>
              <TouchableOpacity
                onPress={() => dispatch(decrement(item.product.id))}
                style={styles.qtyBtn}
                hitSlop={{top: 6, bottom: 6, left: 6, right: 6}}>
                <Text style={styles.qtyBtnTxt}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyVal}>{item.qty}</Text>
              <TouchableOpacity
                onPress={() => dispatch(increment(item.product.id))}
                style={styles.qtyBtn}
                hitSlop={{top: 6, bottom: 6, left: 6, right: 6}}>
                <Text style={styles.qtyBtnTxt}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => dispatch(removeFromCart(item.product.id))}
              style={styles.removeBtn}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              <Text style={styles.removeTxt}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [dispatch],
  );

  // ── Empty state ──
  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={C.card} />
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Cart</Text>
          <View style={{width: 36}} />
        </View>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>
            Add items from the home screen to get started
          </Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}>
            <Text style={styles.shopBtnTxt}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.card} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          My Cart ({items.length} item{items.length !== 1 ? 's' : ''})
        </Text>
        <View style={{width: 36}} />
      </View>

      {/* ── Items ── */}
      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={i => i.product.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* ── Bill summary ── */}
      <View style={styles.bill}>
        <Text style={styles.billTitle}>Bill Details</Text>

        <View style={styles.billRow}>
          <Text style={styles.billLabel}>
            Item Total ({items.length} item{items.length !== 1 ? 's' : ''})
          </Text>
          <Text style={styles.billVal}>{formatPrice(itemTotal)}</Text>
        </View>

        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Delivery Fee</Text>
          <Text style={styles.billVal}>{formatPrice(deliveryFee)}</Text>
        </View>

        <View style={styles.billDivider} />

        <View style={styles.billRow}>
          <Text style={styles.billTotalLabel}>Grand Total</Text>
          <Text style={styles.billTotalVal}>{formatPrice(grandTotal)}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('Checkout')}
          activeOpacity={0.85}>
          <Text style={styles.checkoutBtnTxt}>
            Proceed to Checkout · {formatPrice(grandTotal)}
          </Text>
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

  // item row
  listContent: {padding: 14, paddingBottom: 8},
  row: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  rowImg: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
  },
  rowBody: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  rowName: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
    lineHeight: 19,
  },
  rowUnit: {
    fontSize: 12,
    color: C.sub,
    marginTop: 3,
  },
  rowTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: C.text,
    marginTop: 5,
  },
  rowActions: {alignItems: 'flex-end', justifyContent: 'space-between'},
  qtyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.green,
    borderRadius: 8,
  },
  qtyBtn: {paddingHorizontal: 10, paddingVertical: 5},
  qtyBtnTxt: {color: '#fff', fontSize: 18, fontWeight: '700'},
  qtyVal: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    minWidth: 22,
    textAlign: 'center',
  },
  removeBtn: {marginTop: 8},
  removeTxt: {fontSize: 12, color: C.red, fontWeight: '600'},

  // empty
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyEmoji: {fontSize: 56, marginBottom: 16},
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: C.text,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: C.sub,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  shopBtn: {
    backgroundColor: C.green,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 12,
  },
  shopBtnTxt: {color: '#fff', fontWeight: '700', fontSize: 15},

  // bill
  bill: {
    backgroundColor: C.card,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'android' ? 16 : 8,
    borderTopWidth: 1,
    borderTopColor: C.border,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  billTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: C.text,
    marginBottom: 12,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billLabel: {fontSize: 14, color: C.sub},
  billVal: {fontSize: 14, color: C.text, fontWeight: '500'},
  billDivider: {height: 1, backgroundColor: C.border, marginVertical: 8},
  billTotalLabel: {fontSize: 16, fontWeight: '700', color: C.text},
  billTotalVal: {fontSize: 16, fontWeight: '800', color: C.green},
  checkoutBtn: {
    backgroundColor: C.green,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 12,
    elevation: 3,
    shadowColor: C.green,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  checkoutBtnTxt: {color: '#fff', fontSize: 15, fontWeight: '700'},
});

export default CartScreen;
