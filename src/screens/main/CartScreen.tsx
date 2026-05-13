import React, {useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
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
          <View style={styles.rowInfo}>
            <Text style={styles.rowName} numberOfLines={2}>
              {item.product.name}
            </Text>
            <Text style={styles.rowPrice}>
              {formatPrice(item.product.pricePaise)} × {item.qty} ={' '}
              {formatPrice(lineTotal)}
            </Text>
          </View>

          <View style={styles.rowActions}>
            <View style={styles.qtyWrap}>
              <TouchableOpacity
                onPress={() => dispatch(decrement(item.product.id))}
                style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyVal}>{item.qty}</Text>
              <TouchableOpacity
                onPress={() => dispatch(increment(item.product.id))}
                style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => dispatch(removeFromCart(item.product.id))}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [dispatch],
  );

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Cart</Text>
          <View style={{width: 50}} />
        </View>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation.goBack()}>
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Your Cart ({items.length} item{items.length !== 1 ? 's' : ''})
        </Text>
        <View style={{width: 50}} />
      </View>

      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={i => i.product.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* bill summary stuck to bottom */}
      <View style={styles.bill}>
        <Text style={styles.billTitle}>Bill Details</Text>

        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Item Total</Text>
          <Text style={styles.billVal}>{formatPrice(itemTotal)}</Text>
        </View>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Delivery Fee</Text>
          <Text style={styles.billVal}>{formatPrice(deliveryFee)}</Text>
        </View>
        <View style={[styles.billRow, styles.billTotal]}>
          <Text style={styles.billTotalLabel}>Grand Total</Text>
          <Text style={styles.billTotalVal}>{formatPrice(grandTotal)}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('Checkout')}
          activeOpacity={0.8}>
          <Text style={styles.checkoutText}>
            Proceed to Checkout — {formatPrice(grandTotal)}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
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
  backText: {
    fontSize: 15,
    color: '#4CAF50',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  // empty state
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {fontSize: 48, marginBottom: 12},
  emptyText: {fontSize: 18, color: '#888', marginBottom: 20},
  shopBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopBtnText: {color: '#fff', fontWeight: 'bold', fontSize: 15},
  // list
  listContent: {padding: 16, paddingBottom: 8},
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  rowImg: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  rowInfo: {flex: 1, marginLeft: 12, justifyContent: 'center'},
  rowName: {fontSize: 14, fontWeight: '500', color: '#333'},
  rowPrice: {fontSize: 12, color: '#777', marginTop: 3},
  rowActions: {alignItems: 'flex-end', justifyContent: 'center'},
  qtyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    marginBottom: 6,
  },
  qtyBtn: {paddingHorizontal: 10, paddingVertical: 4},
  qtyBtnText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  qtyVal: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  removeText: {fontSize: 11, color: '#e53935'},
  // bill
  bill: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  billTitle: {fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#1a1a1a'},
  billRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6},
  billLabel: {fontSize: 14, color: '#666'},
  billVal: {fontSize: 14, color: '#333'},
  billTotal: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
    marginTop: 4,
  },
  billTotalLabel: {fontSize: 15, fontWeight: 'bold', color: '#1a1a1a'},
  billTotalVal: {fontSize: 15, fontWeight: 'bold', color: '#4CAF50'},
  checkoutBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  checkoutText: {color: '#fff', fontSize: 15, fontWeight: 'bold'},
});

export default CartScreen;
