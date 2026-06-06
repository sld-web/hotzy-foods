import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CustomerUser {
  id: string;
  email: string;
  name: string | null;
}

interface CustomerAuthState {
  token: string | null;
  customer: CustomerUser | null;
  isAuthenticated: boolean;
  setAuth: (token: string, customer: CustomerUser) => void;
  logout: () => void;
}

export const useCustomerAuth = create<CustomerAuthState>()(
  persist(
    (set) => ({
      token: null,
      customer: null,
      isAuthenticated: false,
      setAuth: (token, customer) => {
        set({ token, customer, isAuthenticated: true });
      },
      logout: () => {
        set({ token: null, customer: null, isAuthenticated: false });
      },
    }),
    {
      name: 'hotzy-customer-auth',
      partialize: (state) => ({
        token: state.token,
        customer: state.customer,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
