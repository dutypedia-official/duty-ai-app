import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MarketStore {
  selectMarket: string;
  setSelectMarket: (selectMarket: string) => void;
}

const useMarket = create<MarketStore>()(
  persist(
    (set, get) => ({
      selectMarket: "",
      setSelectMarket: (selectMarket: string) => set({ selectMarket }),
    }),
    {
      name: "market-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useMarket;
