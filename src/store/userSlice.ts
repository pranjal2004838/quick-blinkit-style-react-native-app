import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Address {
  id: string;
  label: string; // e.g. "Home", "Office"
  details: string;
}

export interface Order {
  id: string;
  date: string;
  items: string;
  total: string;
  status: 'Delivered' | 'On the way' | 'Cancelled';
}

interface UserState {
  walletBalancePaise: number;
  addresses: Address[];
  orders: Order[];
}

const initialState: UserState = {
  walletBalancePaise: 250000, // ₹2,500.00
  addresses: [
    {
      id: '1',
      label: 'Home',
      details: 'H.No 42, Green Avenue, Sector 15, Gurgaon, HR',
    },
    {
      id: '2',
      label: 'Office',
      details: 'Cyber Hub, Tower C, 5th Floor, DLF Phase 3, Gurgaon',
    },
  ],
  orders: [
    {
      id: 'OX-PREV123',
      date: '12 May, 2026',
      items: 'Milk x2, Bread x1',
      total: '₹145.00',
      status: 'Delivered',
    },
  ],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    },
    addAddress: (state, action: PayloadAction<Address>) => {
      state.addresses.push(action.payload);
    },
    deductWallet: (state, action: PayloadAction<number>) => {
      state.walletBalancePaise -= action.payload;
    },
    topUpWallet: (state, action: PayloadAction<number>) => {
      state.walletBalancePaise += action.payload;
    },
  },
});

export const {addOrder, addAddress, deductWallet, topUpWallet} = userSlice.actions;
export default userSlice.reducer;
