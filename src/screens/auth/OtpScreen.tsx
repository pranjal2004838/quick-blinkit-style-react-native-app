import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {useDispatch} from 'react-redux';
import {login} from '../../store/authSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'Otp'>;

const CORRECT_OTP = '1234'; // hardcoded for demo

const OtpScreen = ({route}: Props) => {
  const {phoneNumber} = route.params;
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const dispatch = useDispatch();

  const handleVerify = () => {
    if (otp.length !== 4) return;

    setIsVerifying(true);

    // simulate a tiny network delay so it feels more real
    setTimeout(() => {
      if (otp === CORRECT_OTP) {
        dispatch(login(phoneNumber));
        // navigator will auto-switch to Home stack since isLoggedIn becomes true
      } else {
        setError('Invalid OTP. Hint: use 1234');
        setIsVerifying(false);
      }
    }, 400);
  };

  const handleOtpChange = (text: string) => {
    const digits = text.replace(/\D/g, '');
    setOtp(digits);
    if (error) setError('');
  };

  const canSubmit = otp.length === 4 && !isVerifying;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}>
        <Text style={styles.title}>Verify your number</Text>
        <Text style={styles.subtitle}>
          Enter the 4-digit code sent to{'\n'}
          <Text style={styles.phone}>+91 {phoneNumber}</Text>
        </Text>

        <TextInput
          style={[styles.otpInput, error ? styles.otpInputError : null]}
          placeholder="● ● ● ●"
          placeholderTextColor="#ccc"
          keyboardType="number-pad"
          maxLength={4}
          value={otp}
          onChangeText={handleOtpChange}
          autoFocus
        />

        {error.length > 0 && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.btn, canSubmit && styles.btnActive]}
          onPress={handleVerify}
          disabled={!canSubmit}
          activeOpacity={0.7}>
          <Text style={[styles.btnText, canSubmit && styles.btnTextActive]}>
            {isVerifying ? 'Verifying...' : 'Verify OTP'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.demoHint}>Demo OTP: 1234</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 28,
    lineHeight: 22,
  },
  phone: {
    fontWeight: '600',
    color: '#333',
  },
  otpInput: {
    borderBottomWidth: 2,
    borderColor: '#F8CB46',
    fontSize: 28,
    textAlign: 'center',
    paddingVertical: 12,
    letterSpacing: 16,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  otpInputError: {
    borderColor: '#e53935',
  },
  errorText: {
    color: '#e53935',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
  },
  btn: {
    backgroundColor: '#e8e8e8',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  btnActive: {
    backgroundColor: '#F8CB46',
  },
  btnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
  },
  btnTextActive: {
    color: '#1a1a1a',
  },
  demoHint: {
    fontSize: 12,
    color: '#bbb',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default OtpScreen;
