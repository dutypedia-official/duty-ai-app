import { create } from "zustand";

interface ChatStore {
  marketData: any;
  setMarketData: (marketData: any) => void;
  favorites: any;
  setFavorites: (favorites: any) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  stockName: string;
  setStockName: (stockName: string) => void;
  // currentAlarm: any;
  // setCurrentAlarm: (currentAlarm: any) => void;
  // targetedPrice: any;
  // setTargetedPrice: (targetedPrice: any) => void;
  // addNewAlarm: boolean;
  // setAddNewAlarm: (addNewAlarm: boolean) => void;
  // deleteAlarm: boolean;
  // setDeleteAlarm: (deleteAlarm: boolean) => void;
}

const useStockData = create<ChatStore>((set, get) => ({
  marketData: [],
  setMarketData: (marketData) => set({ marketData }),
  favorites: [],
  setFavorites: (favorites) => set({ favorites }),
  isLoading: true,
  setIsLoading: (val) => set({ isLoading: val }),
  stockName: "",
  setStockName: (stockName) => set({ stockName }),
  // currentAlarm: null,
  // setCurrentAlarm: (currentAlarm) => set({ currentAlarm }),
  // targetedPrice: null,
  // setTargetedPrice: (targetedPrice) => set({ targetedPrice }),
  // addNewAlarm: false,
  // setAddNewAlarm: (addNewAlarm) => set({ addNewAlarm }),
  // deleteAlarm: false,
  // setDeleteAlarm: (deleteAlarm) => set({ deleteAlarm }),
}));

export default useStockData;
