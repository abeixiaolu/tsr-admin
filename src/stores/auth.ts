import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { LoginResponse } from '@/apis/auth';
import unifiedStorage from '@/utils/storage';

interface AuthState {
  userInfo: LoginResponse | null;
  token: string;
  setUserInfo: (userInfo: LoginResponse) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userInfo: null,
      token: '',
      setUserInfo: (userInfo: LoginResponse) => set({ userInfo }),
      setToken: (token: string) => set({ token }),
      clearAuth: () => set({ userInfo: null, token: '' }),
    }),
    {
      name: 'auth',
      storage: createJSONStorage<any>(() => unifiedStorage),
    },
  ),
);
