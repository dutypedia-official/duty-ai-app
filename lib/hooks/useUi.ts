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
}));

export default useUi;
