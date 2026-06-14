import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      role: null,
      isAuthenticated: false,
      login: (userData, accessToken, refreshToken, role) => set({
        user: userData,
        token: accessToken,
        refreshToken: refreshToken,
        role: role,
        isAuthenticated: true,
      }),
      logout: () => {
        // Also clear sessionStorage just in case
        if (typeof window !== 'undefined') {
          sessionStorage.clear();
        }
        set({
          user: null,
          token: null,
          refreshToken: null,
          role: null,
          isAuthenticated: false,
        });
      },
      updateUser: (data) => set((state) => ({
        user: { ...state.user, ...data }
      })),
    }),
    {
      name: 'smart-it-auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
