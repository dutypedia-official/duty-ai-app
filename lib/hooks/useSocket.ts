import io, { Socket } from "socket.io-client";
import { create } from "zustand";
import Constants from "expo-constants";

interface Store {
  connect: () => void;
  disconnect: () => void;
  socket: Socket | undefined;
}

const isRunningInExpoGo = Constants.appOwnership === "expo";
const BASE_URL = isRunningInExpoGo
  ? "http://192.168.0.102:8000"
  : `https://api.dutyai.app`;

const useSocket = create<Store>((set, get) => ({
  socket: undefined,
  connect: () => {
    const socket = io(BASE_URL, {
      reconnection: true,
      reconnectionDelay: 3000,
      reconnectionAttempts: 1000,
      autoConnect: true,
    });
    console.log(socket?.id);

    set({ socket });
  },
  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: undefined });
    }
  },
}));

export default useSocket;
