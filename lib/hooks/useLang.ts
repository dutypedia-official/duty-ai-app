import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LangStore {
  language: "en" | "bn" | "ja" | any;
  setLanguage: (lang: "en" | "bn" | "ja" | any) => void;
  autoTranslateTo: string | null;
  setAutoTranslateTo: (lang: string) => void;
  isTranslate: boolean;
  setIsTranslate: (val: boolean) => void;
  updateInfo: any;
  setUpdateInfo: (val: boolean) => void;
}

const useLang = create<LangStore>()(
  persist(
    (set, get) => ({
      language: "",
      setLanguage: (lang) => set({ language: lang }),
      autoTranslateTo: null,
      setAutoTranslateTo: (lang) => set({ autoTranslateTo: lang }),
      isTranslate: false,
      setIsTranslate: (val) => set({ isTranslate: val }),
      updateInfo: null,
      setUpdateInfo: (val) => set({ updateInfo: val }),
    }),
    {
      name: "lang-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useLang;
