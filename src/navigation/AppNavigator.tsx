import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState} from '../store';

import LoginScreen from '../screens/auth/LoginScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import HomeScreen from '../screens/main/HomeScreen';
import CartScreen from '../screens/main/CartScreen';
import CheckoutScreen from '../screens/main/CheckoutScreen';
import SuccessScreen from '../screens/main/SuccessScreen';

// keeping all params in one place so navigation.navigate() is type-safe
export type RootStackParamList = {
  Login: undefined;
  Otp: {phoneNumber: string};
  Home: undefined;
  Cart: undefined;
  Checkout: undefined;
  Success: {
    orderId: string;
    eta: string;
    address: string;
    payMode: string;
    summary: string;
    totalDisplay: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Otp" component={OtpScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="Success" component={SuccessScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
