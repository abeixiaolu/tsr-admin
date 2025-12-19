const storagePrefix = `${import.meta.env.VITE_APP_STORAGE_PREFIX || 'tsr-admin'}:`;

export default {
  getItem: (name: string) => {
    return localStorage.getItem(`${storagePrefix}${name}`);
  },
  setItem: (name: string, value: string) => {
    localStorage.setItem(`${storagePrefix}${name}`, value);
  },
  removeItem: (name: string) => {
    localStorage.removeItem(`${storagePrefix}${name}`);
  },
  clear: () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(storagePrefix)) {
        localStorage.removeItem(key);
      }
    });
  },
};
