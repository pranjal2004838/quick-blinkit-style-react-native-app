# QuickShop — Blinkit-Style Grocery App (React Native)

> A Blinkit-inspired mini grocery delivery app built with **React Native CLI + TypeScript** for Android & iOS.
> This is the cross-platform counterpart to my [Kotlin Android assignment](https://github.com/pranjal2004838/oceanx_intent_assignment.git) — same complete order flow, rebuilt from scratch in React Native.

![React Native](https://img.shields.io/badge/React%20Native-0.73-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.3-764ABC?logo=redux&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-green)

---

## ✨ Demo Flow

```
Login → Enter OTP (1234) → Home → Add items → Cart → Checkout → Order Placed ✓
```

All screens are functional with no backend required — everything works offline.

---

## 📱 Screens

### 1. 🔐 Login
- `+91` prefixed phone number input
- Accepts exactly 10 digits (non-digit chars stripped automatically)
- Login button disabled until a valid number is entered

### 2. 🔑 OTP Verification
- Mock OTP: **1234**
- Simulated network delay for a realistic feel
- Error feedback on wrong OTP
- On success → `isLoggedIn` flips in Redux → navigator re-renders to Main stack automatically

### 3. 🏠 Home Screen
- Blinkit-style **yellow header** with "Delivery in 10 minutes" pill
- **Real-time search** across all products
- **Horizontal category chips** — All · Dairy · Bakery · Snacks · Drinks · Veg & Fruit
- **2-column product grid** — product image, name, price
- ADD button → transforms into a green **+/− quantity counter**
- **Floating cart bar** appears as soon as any item is added

### 4. 🛒 Cart Screen
- Line items: image · name · unit price × qty = line total
- +/− quantity controls; decrement at qty=1 removes the item
- Remove button with expanded hit area
- **Bill Summary**: Item Total + ₹15 delivery fee + Grand Total
- Empty cart state with "Start Shopping" CTA

### 5. 💳 Checkout Screen
- Full order summary preview
- Delivery address input with validation (8–500 chars)
- Payment mode selector: **Cash on Delivery / Online** (custom radio buttons)
- "Placing Order…" loading state on button press

### 6. ✅ Order Success Screen
- Auto-generated Order ID (e.g. `OX-AB12CD34`)
- Random ETA (8–18 min range)
- Delivery address, payment method, full order breakdown
- Total paid highlighted in green
- **"Continue Shopping"** resets the nav stack to Home (no back-swipe to old order)

### 7. 👤 Profile & Account
- **User Info**: Avatar and phone number display
- **Wallet**: Real-time balance view (persisted in Redux)
- **Saved Addresses**: List of multiple addresses (Home/Office)
- **Past Orders**: History of all orders placed with status and details
- **Logout**: Securely clear auth state

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | ≥ 18 |
| React Native CLI | Latest |
| JDK | 17 |
| Android Studio | SDK 34 + emulator |
| Xcode *(macOS only)* | 15+ |

### Setup

```bash
# 1. Clone
git clone https://github.com/pranjal2004838/quick-blinkit-style-react-native-app.git
cd quick-blinkit-style-react-native-app

# 2. Install JS dependencies
npm install

# 3a. Run on Android
npx react-native run-android

# 3b. Run on iOS (macOS only)
cd ios && pod install && cd ..
npx react-native run-ios
```

### Demo Credentials
| Field | Value |
|---|---|
| Phone number | Any valid 10-digit number |
| OTP | `1234` |

---

## 📦 Download APK

The Android APK is automatically built on every push to the `main` branch. You can download the latest build from:
**[GitHub Actions → Build APK → Latest Run → Artifacts](https://github.com/pranjal2004838/quick-blinkit-style-react-native-app/actions)**

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | **React Native 0.73** (CLI — no Expo) |
| Language | **TypeScript** |
| Components | Functional Components + Hooks |
| State Management | **Redux Toolkit** — `createSlice`, selectors |
| Persistence | **redux-persist** + AsyncStorage |
| Navigation | **React Navigation 6** — Native Stack |
| UI | Core React Native components (zero third-party UI library) |
| Lifecycle | `AppState` listener for foreground/background detection |
| Build — Android | Gradle 8.3 |
| Build — iOS | CocoaPods |
| CI/CD | **GitHub Actions** (Auto-APK build) |

---

## 📁 Project Structure

```
├── android/                         # Native Android project (Gradle 8)
│   ├── app/
│   │   ├── build.gradle
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       └── java/com/educase/
│   │           ├── MainActivity.kt
│   │           └── MainApplication.kt
│   ├── build.gradle
│   ├── settings.gradle
│   └── gradle.properties
│
├── ios/                             # Native iOS project (CocoaPods)
│   ├── educase/
│   │   ├── AppDelegate.mm
│   │   ├── Info.plist
│   │   └── LaunchScreen.storyboard
│   └── Podfile
│
├── src/                             # All JS/TS source
│   ├── App.tsx                      # Root — Provider, PersistGate, AppState
│   ├── data/
│   │   └── products.ts              # Product catalogue, categories, helpers
│   ├── store/
│   │   ├── index.ts                 # Store + persist config
│   │   ├── authSlice.ts             # Login / logout
│   │   └── cartSlice.ts             # Cart CRUD + selectors
│   ├── navigation/
│   │   └── AppNavigator.tsx         # Auth vs Main stack, typed params
│   └── screens/
│       ├── auth/
│       │   ├── LoginScreen.tsx
│       │   └── OtpScreen.tsx
│       └── main/
│           ├── HomeScreen.tsx       # Product grid, search, categories
│           ├── CartScreen.tsx       # Items, bill summary
│           ├── CheckoutScreen.tsx   # Address, payment, place order
│           └── SuccessScreen.tsx    # Order confirmation
│
├── index.js
├── package.json
├── tsconfig.json
├── babel.config.js
├── metro.config.js
└── react-native.config.js
```

---

## 🏗️ Key Technical Decisions

1. **Redux Toolkit over plain Redux** — `createSlice` collocates actions and reducers. Less boilerplate, easier to walk through in an interview.

2. **redux-persist + AsyncStorage** — Drop-in replacement for Room DB from the Kotlin version. Cart and auth state survive app kills with zero extra code.

3. **Local mock catalogue** — Products are hardcoded (same 18-item catalogue as the Kotlin app). No API dependency → demo always works, even offline.

4. **Prices stored in paise (integers)** — Avoids floating-point precision bugs. `formatPrice(paise)` converts to `₹XX.XX` only at display time.

5. **`selectCartQtyMap` selector** — Builds a `{productId: qty}` map once per render so the product grid does O(1) lookups instead of `.find()` per card.

6. **Conditional navigator rendering** — Auth vs Main stack is driven purely by `isLoggedIn` in Redux state. No imperative `navigation.navigate('Home')` on login.

7. **`CommonActions.reset()` on order success** — Prevents the user from swiping back into a completed checkout flow.

8. **`useMemo` + `useCallback`** — Filtered product list and render callbacks are memoized so cart updates don't re-filter the entire catalogue unnecessarily.

---

## 🔄 Comparison with Kotlin Version

| Feature | Kotlin (Android) | React Native (Cross-platform) |
|---|---|---|
| Language | Kotlin | TypeScript |
| Architecture | MVVM + StateFlow | Redux Toolkit |
| Persistence | Room DB | redux-persist + AsyncStorage |
| Navigation | Jetpack Navigation | React Navigation 6 |
| Image Loading | Coil | Core RN `<Image>` |
| UI | XML Layouts + Material 3 | Core RN StyleSheet |
| Platform | Android only | Android + iOS |

---

## 🔮 What I'd Add Next

- **Real API** — `createAsyncThunk` → fakestoreapi.com or similar
- **Infinite scroll** — `onEndReached` pagination on FlatList
- **Image caching** — `react-native-fast-image`
- **Debounced search** — Avoid filtering every keystroke for large catalogues
- **Pull-to-refresh** — `RefreshControl` on the product list
- **Dark mode** — Theme context with `useColorScheme()`
- **Unit tests** — Jest + React Native Testing Library for reducers and key components
- **Error boundaries** — Graceful crash handling
- **Order history** — Persist placed orders in a separate Redux slice

---

## 📄 License

MIT — free to use, fork, and reference.
