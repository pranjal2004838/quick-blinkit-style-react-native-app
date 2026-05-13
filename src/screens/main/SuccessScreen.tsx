import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {CommonActions} from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Success'>;

const SuccessScreen = ({route, navigation}: Props) => {
  const {orderId, eta, address, payMode, summary, totalDisplay} = route.params;

  const goHome = () => {
    // reset nav stack so the user can't swipe back to a completed order
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Home'}],
      }),
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* big green checkmark */}
        <View style={styles.checkCircle}>
          <Text style={styles.checkMark}>✓</Text>
        </View>

        <Text style={styles.heading}>Order Placed!</Text>
        <Text style={styles.orderId}>{orderId}</Text>

        <View style={styles.etaBadge}>
          <Text style={styles.etaText}>🕐 Estimated delivery: {eta}</Text>
        </View>

        {/* details card */}
        <View style={styles.card}>
          <DetailRow label="Delivery Address" value={address} />
          <DetailRow label="Payment" value={payMode} />

          <View style={styles.divider} />

          <Text style={styles.summaryTitle}>Order Summary</Text>
          <Text style={styles.summaryBody}>{summary}</Text>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalVal}>{totalDisplay}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.continueBtn}
          onPress={goHome}
          activeOpacity={0.8}>
          <Text style={styles.continueBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// small helper component — not worth putting in its own file
const DetailRow = ({label, value}: {label: string; value: string}) => (
  <View style={styles.detailBlock}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f8f8f8'},
  content: {padding: 24, alignItems: 'center'},
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  checkMark: {color: '#fff', fontSize: 36, fontWeight: 'bold'},
  heading: {fontSize: 22, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 4},
  orderId: {fontSize: 14, color: '#888', marginBottom: 16},
  etaBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  etaText: {fontSize: 13, color: '#E65100', fontWeight: '600'},
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 24,
  },
  detailBlock: {marginBottom: 12},
  detailLabel: {fontSize: 12, color: '#999', marginBottom: 2},
  detailValue: {fontSize: 14, color: '#333'},
  divider: {height: 1, backgroundColor: '#eee', marginVertical: 12},
  summaryTitle: {fontSize: 14, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8},
  summaryBody: {fontSize: 13, color: '#555', lineHeight: 20},
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {fontSize: 15, fontWeight: 'bold', color: '#1a1a1a'},
  totalVal: {fontSize: 16, fontWeight: 'bold', color: '#4CAF50'},
  continueBtn: {
    backgroundColor: '#F8CB46',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
  },
  continueBtnText: {color: '#1a1a1a', fontSize: 16, fontWeight: 'bold'},
});

export default SuccessScreen;
