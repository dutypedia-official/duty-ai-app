import { create } from "zustand";
interface Store {
  refreash: boolean;
  setRefreash: (refreash: boolean) => void;
  refreashFav: boolean;
  setRefreashFav: (refreashFav: boolean) => void;
  screenRefresh: boolean;
  setScreenRefresh: (screenRefresh: boolean) => void;
  mainServerAvailable: boolean;
  setMainServerAvailable: (mainServerAvailable: boolean) => void;
  selectedStock: any;
  setSelectedStock: (selectedStock: any) => void;
  selectedAlarmShit: any;
  setSelectedAlarmShit: (selectedAlarmShit: any) => void;
  hideTabNav: boolean;
  setHideTabNav: (hideTabNav: boolean) => void;
  aiAlermPrompt: string;
  setAiAlermPrompt: (aiAlermPrompt: string) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  totalInvestment: string;
  setTotalInvestment: (totalInvestment: string) => void;
  balance: string;
  setBalance: (balance: string) => void;
  freeBalance: string;
  setFreeBalance: (freeBalance: string) => void;
  holdings: any;
  setHoldings: (holdings: any) => void;
}

const useUi = create<Store>((set, get) => ({
  refreash: false,
  setRefreash: (refreash: boolean) => set({ refreash }),
  screenRefresh: false,
  setScreenRefresh: (screenRefresh: boolean) => set({ screenRefresh }),
  refreashFav: false,
  setRefreashFav: (refreashFav: boolean) => set({ refreashFav }),
  mainServerAvailable: false,
  setMainServerAvailable: (mainServerAvailable: boolean) =>
    set({ mainServerAvailable }),
  selectedStock: null,
  setSelectedStock: (selectedStock: any) => set({ selectedStock }),
  selectedAlarmShit: null,
  setSelectedAlarmShit: (selectedAlarmShit: any) => set({ selectedAlarmShit }),
  hideTabNav: false,
  setHideTabNav: (hideTabNav: boolean) => set({ hideTabNav }),
  aiAlermPrompt: "",
  setAiAlermPrompt: (aiAlermPrompt: string) => set({ aiAlermPrompt }),
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  totalInvestment: "0",
  setTotalInvestment: (totalInvestment: string) => set({ totalInvestment }),
  balance: "0",
  setBalance: (balance: string) => set({ balance }),
  freeBalance: "0",
  setFreeBalance: (freeBalance: string) => set({ freeBalance }),
  holdings: [],
  setHoldings: (holdings: any) => set({ holdings }),
}));

export default useUi;
