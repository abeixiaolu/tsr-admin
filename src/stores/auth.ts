import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { GlobalInfoResponse, LoginResponse } from '@/apis/apis';
import { API } from '@/apis/backend';
import unifiedStorage from '@/utils/storage';

interface AuthState {
  userInfo: LoginResponse | null;
  token: string;
  globalInfo: GlobalInfoResponse | null;
  getGlobalInfo: () => Promise<GlobalInfoResponse | null>;
  setUserInfo: (userInfo: LoginResponse) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userInfo: null,
      token: '',
      globalInfo: null,
      getGlobalInfo: async () => {
        const res = await API.getGlobalInfo();
        if (res.err) return null;
        set({ globalInfo: res.data });
        return res.data;
      },
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
