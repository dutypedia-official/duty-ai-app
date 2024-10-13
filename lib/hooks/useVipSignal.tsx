import { create } from "zustand";

interface Store {
  selectStock: string[];
  setSelectStock: (val: string) => void;
  removeSelectStock: (val: string) => void;
  clearSelectStock: () => void;
  answer: any;
  setAnswer: (val: any) => void;
}

const useVipSignal = create<Store>((set, get) => ({
  selectStock: [],

  // Add stock to the selection
  setSelectStock: (val) =>
    set((state) => ({
      selectStock: [...state.selectStock, val],
    })),

  // Remove stock from the selection
  removeSelectStock: (val) =>
    set((state) => ({
      selectStock: state.selectStock.filter((stock) => stock !== val),
    })),

  // Clear the selection
  clearSelectStock: () =>
    set(() => ({
      selectStock: [],
      // answer: null,
    })),
  answer: null,

  setAnswer: (val) => set({ answer: val }),
}));

export default useVipSignal;
