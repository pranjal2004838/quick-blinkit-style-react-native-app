import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {useDispatch} from 'react-redux';
import {login} from '../../store/authSlice';

const C = {
  yellow: '#F8CB46',
  green: '#22C55E',
  bg: '#FFFFFF',
  text: '#111827',
  sub: '#6B7280',
  light: '#9CA3AF',
  border: '#E5E7EB',
  red: '#EF4444',
};

type Props = NativeStackScreenProps<RootStackParamList, 'Otp'>;

const CORRECT_OTP = '1234';

const OtpScreen = ({route, navigation}: Props) => {
  const {phoneNumber} = route.params;
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const dispatch = useDispatch();

  const handleVerify = () => {
    if (otp.length !== 4) return;
    setIsVerifying(true);

    setTimeout(() => {
      if (otp === CORRECT_OTP) {
        dispatch(login(phoneNumber));
      } else {
        setError('Incorrect OTP. Try 1234 for this demo.');
        setIsVerifying(false);
      }
    }, 450);
  };

  const handleOtpChange = (text: string) => {
    const digits = text.replace(/\D/g, '');
    setOtp(digits);
    if (error) setError('');
  };

  const canSubmit = otp.length === 4 && !isVerifying;

  const maskedPhone = `+91 ${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5)}`;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}>

        {/* Back */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Text style={styles.backTxt}>‹ Back</Text>
        </TouchableOpacity>

        <View style={styles.body}>
          {/* Phone badge */}
          <View style={styles.phoneBadge}>
            <Text style={styles.phoneBadgeTxt}>📱</Text>
          </View>

          <Text style={styles.title}>Verify your number</Text>
          <Text style={styles.sub}>
            We sent a 4-digit code to{'\n'}
            <Text style={styles.phoneHighlight}>{maskedPhone}</Text>
          </Text>

          {/* OTP Box */}
          <View style={[styles.otpWrap, error ? styles.otpWrapErr : null, otp.length === 4 && !error ? styles.otpWrapOk : null]}>
            <TextInput
              style={styles.otpInput}
              placeholder="● ● ● ●"
              placeholderTextColor={C.light}
              keyboardType="number-pad"
              maxLength={4}
              value={otp}
              onChangeText={handleOtpChange}
              autoFocus
              textAlign="center"
            />
          </View>

          {error.length > 0 && (
            <Text style={styles.errorTxt}>{error}</Text>
          )}

          {/* Verify button */}
          <TouchableOpacity
            style={[styles.btn, canSubmit && styles.btnActive]}
            onPress={handleVerify}
            disabled={!canSubmit}
            activeOpacity={0.8}>
            <Text style={[styles.btnTxt, canSubmit && styles.btnTxtActive]}>
              {isVerifying ? 'Verifying…' : 'Verify & Continue →'}
            </Text>
          </TouchableOpacity>

          {/* Demo hint */}
          <View style={styles.hintBox}>
            <Text style={styles.hintEmoji}>💡</Text>
            <Text style={styles.hintTxt}>
              Demo OTP:{' '}
              <Text style={styles.hintCode}>1234</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: C.bg},
  kav: {flex: 1},

  backBtn: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backTxt: {
    fontSize: 16,
    color: C.green,
    fontWeight: '600',
  },

  body: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 20,
  },

  phoneBadge: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: '#FEF9C3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  phoneBadgeTxt: {fontSize: 34},

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: C.text,
    marginBottom: 8,
  },
  sub: {
    fontSize: 14,
    color: C.sub,
    lineHeight: 21,
    marginBottom: 30,
  },
  phoneHighlight: {
    fontWeight: '700',
    color: C.text,
  },

  // OTP input
  otpWrap: {
    borderWidth: 2,
    borderColor: C.border,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: '#FAFAFA',
  },
  otpWrapErr: {borderColor: C.red},
  otpWrapOk: {borderColor: C.green},
  otpInput: {
    fontSize: 32,
    fontWeight: '800',
    color: C.text,
    textAlign: 'center',
    paddingVertical: 18,
    letterSpacing: 20,
  },

  errorTxt: {
    color: C.red,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 10,
  },

  btn: {
    backgroundColor: '#E5E7EB',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  btnActive: {backgroundColor: C.yellow},
  btnTxt: {fontSize: 16, fontWeight: '700', color: '#9CA3AF'},
  btnTxtActive: {color: '#1a1a1a'},

  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  hintEmoji: {fontSize: 16, marginRight: 8},
  hintTxt: {fontSize: 13, color: C.sub},
  hintCode: {
    fontWeight: '800',
    color: C.text,
    letterSpacing: 2,
  },
});

export default OtpScreen;
