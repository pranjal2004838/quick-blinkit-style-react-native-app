import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import userReducer from './userSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  user: userReducer,
});

// persist everything (auth + cart) to AsyncStorage
// this way login state and cart survive app restarts — replaces Room from the kotlin version
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // could add blacklist/whitelist here if needed later
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // redux-persist actions aren't serializable, so we gotta ignore them
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
