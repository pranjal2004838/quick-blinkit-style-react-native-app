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
  StatusBar,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/AppNavigator';

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

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen = ({navigation}: Props) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    navigation.navigate('Otp', {phoneNumber: cleaned});
  };

  const onChangePhone = (text: string) => {
    const digits = text.replace(/\D/g, '');
    setPhone(digits);
    if (error) setError('');
  };

  const isValid = phone.length === 10;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}>

        <View style={styles.top}>
          {/* Brand */}
          <View style={styles.logoWrap}>
            <Text style={styles.logoEmoji}>🛒</Text>
          </View>
          <Text style={styles.brand}>QuickShop</Text>
          <Text style={styles.tagline}>Groceries in 10 minutes</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Log in or Sign up</Text>
          <Text style={styles.formSub}>
            We'll send a verification code to your number
          </Text>

          {/* Phone input */}
          <View style={[styles.inputWrap, error ? styles.inputWrapErr : null, isValid && !error ? styles.inputWrapOk : null]}>
            <View style={styles.prefix}>
              <Text style={styles.flag}>🇮🇳</Text>
              <Text style={styles.prefixTxt}>+91</Text>
            </View>
            <View style={styles.divider} />
            <TextInput
              style={styles.input}
              placeholder="Enter mobile number"
              placeholderTextColor={C.light}
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={onChangePhone}
              autoFocus
            />
            {isValid && <Text style={styles.tick}>✓</Text>}
          </View>

          {error.length > 0 && (
            <Text style={styles.errorTxt}>{error}</Text>
          )}

          <TouchableOpacity
            style={[styles.btn, isValid && styles.btnActive]}
            onPress={handleContinue}
            disabled={!isValid}
            activeOpacity={0.8}>
            <Text style={[styles.btnTxt, isValid && styles.btnTxtActive]}>
              Continue →
            </Text>
          </TouchableOpacity>

          <Text style={styles.terms}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: C.bg},
  kav: {flex: 1},

  top: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 32,
    backgroundColor: C.yellow,
    paddingTop: 60,
  },
  logoWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoEmoji: {fontSize: 40},
  brand: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
    fontWeight: '500',
  },

  form: {
    backgroundColor: C.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 26,
    paddingBottom: 36,
    marginTop: -20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: C.text,
    marginBottom: 4,
  },
  formSub: {
    fontSize: 13,
    color: C.sub,
    marginBottom: 22,
    lineHeight: 18,
  },

  // phone input
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#FAFAFA',
    marginBottom: 6,
  },
  inputWrapErr: {borderColor: C.red},
  inputWrapOk: {borderColor: C.green},
  prefix: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  flag: {fontSize: 18, marginRight: 6},
  prefixTxt: {fontSize: 15, fontWeight: '700', color: C.text},
  divider: {
    width: 1,
    height: 24,
    backgroundColor: C.border,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: C.text,
  },
  tick: {fontSize: 18, color: C.green, paddingRight: 14},
  errorTxt: {color: C.red, fontSize: 12, marginBottom: 10, marginLeft: 2},

  btn: {
    backgroundColor: '#E5E7EB',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  btnActive: {backgroundColor: C.yellow},
  btnTxt: {fontSize: 16, fontWeight: '700', color: '#9CA3AF'},
  btnTxtActive: {color: '#1a1a1a'},

  terms: {fontSize: 12, color: C.light, textAlign: 'center', lineHeight: 18},
  termsLink: {color: C.sub, fontWeight: '600'},
});

export default LoginScreen;
