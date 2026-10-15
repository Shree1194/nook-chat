import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_URL
  ? new URL(import.meta.env.VITE_API_URL).origin
  : window.location.origin;

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async (getToken) => {
    set({ isCheckingAuth: true });

    try {
      const token = await getToken();
      const res = await axiosInstance.get("/auth/check", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ authUser: res.data });

      get().connectSocket(res.data, token);
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  clearAuth: () => {
    set({ authUser: null, isCheckingAuth: false, onlineUsers: [] });
    get().disconnectSocket();
  },

  connectSocket: (user, token) => {
    if (!user || !token || get().socket?.connected) return;

    const socket = io(BASE_URL, { auth: { token } });

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    socket?.disconnect();
    set({ socket: null });
  },
}));
