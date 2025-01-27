import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Store {
  isPortfolio: boolean;
  setIsPortfolio: (val: boolean) => void;
}

const usePortfolio = create<Store>()(
  persist(
    (set, get) => ({
      isPortfolio: false,
      setIsPortfolio: (val) => set({ isPortfolio: val }),
    }),
    {
      name: "portfolio-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default usePortfolio;
