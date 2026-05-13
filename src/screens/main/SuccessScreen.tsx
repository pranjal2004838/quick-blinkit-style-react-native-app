import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {CommonActions} from '@react-navigation/native';

const C = {
  yellow: '#F8CB46',
  green: '#22C55E',
  bg: '#F3F4F6',
  card: '#FFFFFF',
  text: '#111827',
  sub: '#6B7280',
  light: '#9CA3AF',
  border: '#E5E7EB',
  orange: '#F97316',
};

type Props = NativeStackScreenProps<RootStackParamList, 'Success'>;

const SuccessScreen = ({route, navigation}: Props) => {
  const {orderId, eta, address, payMode, summary, totalDisplay} = route.params;

  const goHome = () => {
    navigation.dispatch(
      CommonActions.reset({index: 0, routes: [{name: 'Home'}]}),
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* Success badge */}
        <View style={styles.badgeOuter}>
          <View style={styles.badgeInner}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
        </View>

        <Text style={styles.heading}>Order Placed!</Text>
        <Text style={styles.orderId}>{orderId}</Text>

        {/* ETA pill */}
        <View style={styles.etaBadge}>
          <Text style={styles.etaEmoji}>🛵</Text>
          <Text style={styles.etaText}>Arriving in {eta}</Text>
        </View>

        {/* Details card */}
        <View style={styles.card}>
          <Row label="📍 Delivery To" value={address} />
          <View style={styles.separator} />
          <Row label="💳 Payment" value={payMode} />
          <View style={styles.separator} />

          <Text style={styles.summaryTitle}>🧾 Your Order</Text>
          {summary.split('\n').map((line, idx) => (
            <Text key={idx} style={styles.summaryLine}>
              {line}
            </Text>
          ))}

          <View style={styles.totalBox}>
            <Text style={styles.totalBoxLabel}>Total Paid</Text>
            <Text style={styles.totalBoxVal}>{totalDisplay}</Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={goHome}
          activeOpacity={0.85}>
          <Text style={styles.continueBtnTxt}>Continue Shopping 🛍️</Text>
        </TouchableOpacity>

        <Text style={styles.thanks}>
          Thank you for shopping with QuickShop ❤️
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const Row = ({label, value}: {label: string; value: string}) => (
  <View style={rowStyles.wrap}>
    <Text style={rowStyles.label}>{label}</Text>
    <Text style={rowStyles.value}>{value}</Text>
  </View>
);
const rowStyles = StyleSheet.create({
  wrap: {marginBottom: 4},
  label: {fontSize: 12, color: C.sub, marginBottom: 4, fontWeight: '600'},
  value: {fontSize: 14, color: C.text, lineHeight: 20},
});

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: C.bg},
  content: {
    padding: 24,
    alignItems: 'center',
    paddingBottom: 40,
  },

  // badge
  badgeOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  badgeInner: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: C.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    color: '#fff',
    fontSize: 38,
    fontWeight: '700',
    lineHeight: 42,
  },

  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: C.text,
    marginBottom: 4,
  },
  orderId: {
    fontSize: 13,
    color: C.sub,
    marginBottom: 18,
    letterSpacing: 0.5,
    fontWeight: '600',
  },

  // eta
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  etaEmoji: {fontSize: 18, marginRight: 8},
  etaText: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '700',
  },

  // card
  card: {
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 18,
    width: '100%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    marginBottom: 22,
  },
  separator: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 14,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: C.sub,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryLine: {
    fontSize: 13,
    color: C.text,
    lineHeight: 22,
  },
  totalBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  totalBoxLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: C.text,
  },
  totalBoxVal: {
    fontSize: 18,
    fontWeight: '800',
    color: C.green,
  },

  // CTA
  continueBtn: {
    backgroundColor: C.yellow,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 36,
    alignItems: 'center',
    width: '100%',
    elevation: 2,
    shadowColor: C.yellow,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  continueBtnTxt: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '800',
  },
  thanks: {
    fontSize: 13,
    color: C.light,
    marginTop: 18,
    textAlign: 'center',
  },
});

export default SuccessScreen;
