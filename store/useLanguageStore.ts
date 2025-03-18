import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LanguageState {
  language: "en" | "hi";
  setLanguage: (language: "en" | "hi") => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "hi",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "language-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
