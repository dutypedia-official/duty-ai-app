import { create } from "zustand";

interface ChatStore {
  marketData: any;
  setMarketData: (marketData: any) => void;
  favorites: any;
  setFavorites: (favorites: any) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}

const useStockData = create<ChatStore>((set, get) => ({
  marketData: [],
  setMarketData: (marketData) => set({ marketData }),
  favorites: [],
  setFavorites: (favorites) => set({ favorites }),
  isLoading: true,
  setIsLoading: (val) => set({ isLoading: val }),
}));

export default useStockData;
