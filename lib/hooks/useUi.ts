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
  bottomSheetRef: null | any;
  setBottomSheetRef: (bottomSheetRef: null | any) => void;
  currentStockData: any;
  setCurrentStockData: (currentStockData: any) => void;
  currentAlarmData: any;
  setCurrentAlarmData: (currentAlarm: any) => void;
  sheetType: any;
  setSheetType: (sheetType: any) => void;
  hideTabNav: boolean;
  setHideTabNav: (hideTabNav: boolean) => void;
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
  bottomSheetRef: null,
  setBottomSheetRef: (bottomSheetRef: null | any) => set({ bottomSheetRef }),
  currentStockData: null,
  setCurrentStockData: (currentStockData: any) => set({ currentStockData }),
  currentAlarmData: null,
  setCurrentAlarmData: (currentAlarmData: any) => set({ currentAlarmData }),
  sheetType: null,
  setSheetType: (sheetType: any) => set({ sheetType }),
  hideTabNav: false,
  setHideTabNav: (hideTabNav: boolean) => set({ hideTabNav }),
}));

export default useUi;
