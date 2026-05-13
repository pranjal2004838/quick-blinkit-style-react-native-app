import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {
  CATEGORIES,
  filterProducts,
  formatPrice,
  Product,
} from '../../data/products';
import {
  addToCart,
  increment,
  decrement,
  selectCartQtyMap,
  selectCartCount,
  selectGrandTotal,
} from '../../store/cartSlice';
import {RootState} from '../../store';
import {logout} from '../../store/authSlice';

// --- palette ---
const C = {
  yellow: '#F8CB46',
  yellowDark: '#E5B800',
  green: '#22C55E',
  bg: '#F3F4F6',
  card: '#FFFFFF',
  text: '#111827',
  sub: '#6B7280',
  light: '#9CA3AF',
  border: '#E5E7EB',
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen = ({navigation}: Props) => {
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();

  const qtyMap = useSelector((state: RootState) => selectCartQtyMap(state));
  const cartCount = useSelector((state: RootState) => selectCartCount(state));
  const grandTotal = useSelector((state: RootState) => selectGrandTotal(state));

  const products = useMemo(
    () => filterProducts(activeCat, search),
    [activeCat, search],
  );

  const onAddPress = useCallback(
    (product: Product) => dispatch(addToCart(product)),
    [dispatch],
  );
  const onIncrement = useCallback(
    (id: string) => dispatch(increment(id)),
    [dispatch],
  );
  const onDecrement = useCallback(
    (id: string) => dispatch(decrement(id)),
    [dispatch],
  );

  const renderItem = useCallback(
    ({item}: {item: Product}) => {
      const qty = qtyMap[item.id] || 0;
      return (
        <View style={styles.card}>
          <Image
            source={{uri: item.imageUrl}}
            style={styles.cardImg}
            resizeMode="cover"
          />
          <Text style={styles.cardName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.cardPrice}>{formatPrice(item.pricePaise)}</Text>

          {qty === 0 ? (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => onAddPress(item)}
              activeOpacity={0.75}>
              <Text style={styles.addBtnLabel}>ADD</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => onDecrement(item.id)}
                hitSlop={{top: 6, bottom: 6, left: 6, right: 6}}>
                <Text style={styles.qtyBtnLabel}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyCount}>{qty}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => onIncrement(item.id)}
                hitSlop={{top: 6, bottom: 6, left: 6, right: 6}}>
                <Text style={styles.qtyBtnLabel}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    },
    [qtyMap, onAddPress, onIncrement, onDecrement],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={C.yellow} barStyle="dark-content" />

      {/* ── Yellow header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerBrand}>QuickShop</Text>
          <View style={styles.deliveryPill}>
            <Text style={styles.deliveryDot}>●</Text>
            <Text style={styles.deliveryText}>Delivery in 10 minutes</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => navigation.navigate('Profile')}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileEmoji}>👤</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* ── Search ── */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for atta, eggs, coke..."
            placeholderTextColor={C.light}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Categories ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
        contentContainerStyle={styles.catContent}>
        {CATEGORIES.map(cat => {
          const active = cat.id === activeCat;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setActiveCat(cat.id)}
              activeOpacity={0.7}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {cat.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Product grid ── */}
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={p => p.id}
        numColumns={2}
        contentContainerStyle={[
          styles.grid,
          cartCount > 0 && {paddingBottom: 88},
        ]}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>
              {search.length > 0 ? '🔍' : '📦'}
            </Text>
            <Text style={styles.emptyText}>
              {search.length > 0
                ? `No results for "${search}"`
                : 'No items in this category'}
            </Text>
          </View>
        }
      />

      {/* ── Floating cart bar ── */}
      {cartCount > 0 && (
        <TouchableOpacity
          style={styles.cartBar}
          onPress={() => navigation.navigate('Cart')}
          activeOpacity={0.9}>
          <View style={styles.cartBarLeft}>
            <Text style={styles.cartBarCount}>
              {cartCount} item{cartCount !== 1 ? 's' : ''}
            </Text>
            <Text style={styles.cartBarSub}>View Cart →</Text>
          </View>
          <Text style={styles.cartBarTotal}>{formatPrice(grandTotal)}</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: C.bg},

  // header
  header: {
    backgroundColor: C.yellow,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerBrand: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  deliveryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  deliveryDot: {fontSize: 8, color: '#1a1a1a', marginRight: 5},
  deliveryText: {fontSize: 12, fontWeight: '600', color: '#1a1a1a'},
  profileBtn: {
    marginTop: 2,
  },
  profileCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  profileEmoji: {
    fontSize: 20,
  },

  // search
  searchWrap: {
    backgroundColor: C.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.bg,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
  },
  searchIcon: {fontSize: 16, marginRight: 8},
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: C.text,
    paddingVertical: 0,
  },
  clearIcon: {fontSize: 14, color: C.light, paddingLeft: 8},

  // categories
  catScroll: {
    backgroundColor: C.card,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    maxHeight: 52,
  },
  catContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: C.bg,
    marginRight: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  chipActive: {
    backgroundColor: C.yellow,
    borderColor: C.yellowDark,
  },
  chipText: {fontSize: 13, color: C.sub, fontWeight: '500'},
  chipTextActive: {color: '#1a1a1a', fontWeight: '700'},

  // grid
  grid: {paddingHorizontal: 12, paddingTop: 12, paddingBottom: 20},
  gridRow: {justifyContent: 'space-between'},

  // card
  card: {
    width: '48.5%',
    backgroundColor: C.card,
    borderRadius: 14,
    marginBottom: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  cardImg: {
    width: '100%',
    height: 115,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
  },
  cardName: {
    fontSize: 13,
    fontWeight: '500',
    color: C.text,
    marginTop: 9,
    minHeight: 36,
    lineHeight: 18,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: C.text,
    marginTop: 3,
    marginBottom: 8,
  },
  addBtn: {
    borderWidth: 1.5,
    borderColor: C.green,
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: 'center',
  },
  addBtnLabel: {
    color: C.green,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.green,
    borderRadius: 8,
    paddingVertical: 5,
  },
  qtyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 2,
  },
  qtyBtnLabel: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
  },
  qtyCount: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    minWidth: 26,
    textAlign: 'center',
  },

  // empty
  empty: {alignItems: 'center', marginTop: 60, paddingHorizontal: 24},
  emptyEmoji: {fontSize: 44, marginBottom: 12},
  emptyText: {fontSize: 15, color: C.sub, textAlign: 'center'},

  // cart bar
  cartBar: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: C.green,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 6,
    shadowColor: C.green,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  cartBarLeft: {},
  cartBarCount: {color: '#fff', fontSize: 15, fontWeight: '700'},
  cartBarSub: {color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1},
  cartBarTotal: {color: '#fff', fontSize: 16, fontWeight: '800'},
});

export default HomeScreen;
