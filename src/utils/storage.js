// ─── STORAGE LOCAL ────────────────────────────────────────

export const db = {
  get: async (key) => {
    try {
      const data = localStorage.getItem(key);

      return data
        ? JSON.parse(data)
        : null;
    } catch {
      return null;
    }
  },

  set: async (key, value) => {
    try {
      localStorage.setItem(
        key,
        JSON.stringify(value)
      );
    } catch (error) {
      console.log(error);
    }
  },
};
