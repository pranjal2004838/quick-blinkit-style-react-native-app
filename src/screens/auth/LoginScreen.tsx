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
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen = ({navigation}: Props) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    // strip anything that isn't a digit just to be safe
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    navigation.navigate('Otp', {phoneNumber: cleaned});
  };

  const onChangePhone = (text: string) => {
    // only allow digits
    const digits = text.replace(/\D/g, '');
    setPhone(digits);
    if (error) setError(''); // clear error as user types
  };

  const isValid = phone.length === 10;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}>
        <Text style={styles.logo}>🛒</Text>
        <Text style={styles.title}>QuickShop</Text>
        <Text style={styles.subtitle}>India's last minute app</Text>

        <Text style={styles.label}>Log in or Sign up</Text>

        <View style={styles.phoneRow}>
          <View style={styles.prefixBox}>
            <Text style={styles.prefix}>+91</Text>
          </View>
          <TextInput
            style={styles.phoneInput}
            placeholder="Enter mobile number"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={onChangePhone}
            autoFocus
          />
        </View>

        {error.length > 0 && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.btn, isValid && styles.btnActive]}
          onPress={handleContinue}
          disabled={!isValid}
          activeOpacity={0.7}>
          <Text style={[styles.btnText, isValid && styles.btnTextActive]}>
            Continue
          </Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          By continuing, you agree to our Terms of Service
        </Text>
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
  logo: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  phoneRow: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  prefixBox: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  prefix: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1a1a1a',
  },
  errorText: {
    color: '#e53935',
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 4,
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
  hint: {
    fontSize: 11,
    color: '#bbb',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default LoginScreen;
