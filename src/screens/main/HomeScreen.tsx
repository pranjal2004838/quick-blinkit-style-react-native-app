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
} from '../../store/cartSlice';
import {RootState} from '../../store';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen = ({navigation}: Props) => {
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();

  const qtyMap = useSelector((state: RootState) => selectCartQtyMap(state));
  const cartCount = useSelector((state: RootState) => selectCartCount(state));

  // recompute filtered list only when category or search changes
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

  // product card renderer — memoized to avoid recreating on every render
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
              activeOpacity={0.7}>
              <Text style={styles.addBtnLabel}>ADD</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => onDecrement(item.id)}>
                <Text style={styles.qtyBtnLabel}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyCount}>{qty}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => onIncrement(item.id)}>
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
      <StatusBar backgroundColor="#F8CB46" barStyle="dark-content" />

      {/* blinkit-style yellow header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>QuickShop</Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>🕐 Delivery in 10 minutes</Text>
        </View>
      </View>

      {/* search */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for atta, dal, coke..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>

      {/* category chips — horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
        contentContainerStyle={styles.catContainer}>
        {CATEGORIES.map(cat => {
          const active = cat.id === activeCat;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setActiveCat(cat.id)}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {cat.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* product grid */}
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={p => p.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {search.length > 0
                ? `No results for "${search}"`
                : 'No items in this category'}
            </Text>
          </View>
        }
      />

      {/* floating cart bar */}
      {cartCount > 0 && (
        <TouchableOpacity
          style={styles.cartBar}
          onPress={() => navigation.navigate('Cart')}
          activeOpacity={0.85}>
          <Text style={styles.cartBarText}>
            🛒 {cartCount} item{cartCount !== 1 ? 's' : ''} — View Cart
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // --- header ---
  header: {
    backgroundColor: '#F8CB46',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  pill: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 6,
  },
  pillText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  // --- search ---
  searchWrap: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  // --- categories ---
  catScroll: {
    maxHeight: 44,
    paddingLeft: 16,
  },
  catContainer: {
    alignItems: 'center',
    paddingRight: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#F8CB46',
  },
  chipText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#1a1a1a',
    fontWeight: '700',
  },
  // --- grid ---
  grid: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 80,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardImg: {
    width: '100%',
    height: 110,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  cardName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    marginTop: 8,
    minHeight: 34,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 4,
  },
  addBtn: {
    borderColor: '#4CAF50',
    borderWidth: 1.5,
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  addBtnLabel: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 13,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    marginTop: 8,
    paddingVertical: 4,
  },
  qtyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  qtyBtnLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  qtyCount: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    minWidth: 24,
    textAlign: 'center',
  },
  // --- empty ---
  empty: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
  },
  // --- cart bar ---
  cartBar: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cartBarText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
