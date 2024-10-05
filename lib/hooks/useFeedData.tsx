import { create } from "zustand";

interface ChatStore {
  indexData: any;
  setIndexData: (indexData: any) => void;
}

const useFeedData = create<ChatStore>((set, get) => ({
  indexData: null,
  setIndexData: (indexData) => set({ indexData }),
}));

export default useFeedData;
