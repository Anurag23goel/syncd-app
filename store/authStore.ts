import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { customAsyncStorage } from "./customStorage";

interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  isVerified: boolean;
  pendingVerification: boolean;
  registrationEmail: string | null;
  projectID: string | null;
  expoPushToken: string | null;

  // Actions
  setToken: (token: string | null) => void;
  setUser: (user: any | null) => void;
  login: (token: string, user: any) => void;
  logout: () => void;
  setPendingVerification: (email: string) => void;
  setVerified: (status: boolean) => void;
  clearRegistrationState: () => void;
  setProjectID: (id: string) => void;
  setExpoPushToken: (expoToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isVerified: false,
      pendingVerification: false,
      registrationEmail: null,
      projectID: null,
      expoPushToken: null,

      setToken: (token) => set({ token, isAuthenticated: !!token }),
      setUser: (user) => set({ user }),
      setExpoPushToken: (expoPushToken) => set({ expoPushToken }),
      login: (token, user) =>
        set({
          token,
          user,
          isAuthenticated: true,
          isVerified: user.IsVerified || false,
        }),
      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isVerified: false,
          pendingVerification: false,
          registrationEmail: null,
        }),
      setPendingVerification: (email) =>
        set({
          pendingVerification: true,
          registrationEmail: email,
        }),
      setVerified: (status) =>
        set({
          isVerified: status,
          pendingVerification: !status,
        }),
      clearRegistrationState: () =>
        set({
          pendingVerification: false,
          registrationEmail: null,
        }),
      setProjectID: (id) => set({ projectID: id }), // ✅ action added here
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => customAsyncStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isVerified: state.isVerified,
        projectID: state.projectID,
        expoPushToken: state.expoPushToken, 
      }),
    }
  )
);
