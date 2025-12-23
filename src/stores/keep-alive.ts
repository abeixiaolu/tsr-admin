import { create } from 'zustand';

interface KeepAliveStore {
  include: Set<string>;
  navigation: {
    from: string;
    to: string;
  };
  setNavigation: (from: string, to: string) => void;
  addInclude: (path: string) => void;
  removeInclude: (path: string) => void;
  setInclude: (paths: string[]) => void;
}

export const useKeepAliveStore = create<KeepAliveStore>((set) => ({
  include: new Set(),
  navigation: {
    from: '',
    to: '',
  },
  setNavigation: (from: string, to: string) => set({ navigation: { from, to } }),
  addInclude: (path: string) =>
    set((state) => {
      if (state.include.has(path)) return {};
      const newInclude = new Set(state.include);
      newInclude.add(path);
      return { include: newInclude };
    }),
  removeInclude: (path: string) =>
    set((state) => {
      const newInclude = new Set(state.include);
      newInclude.delete(path);
      return { include: newInclude };
    }),
  setInclude: (paths: string[]) => set({ include: new Set(paths) }),
}));
