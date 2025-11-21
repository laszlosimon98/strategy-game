import { StateManager } from "@/manager/stateManager";
import axios from "axios";

export const authApi = axios.create({
  baseURL: `${(import.meta as any).env.VITE_SERVER_URL}/auth`,
  withCredentials: true,
});

export const userApi = axios.create({
  baseURL: `${(import.meta as any).env.VITE_SERVER_URL}/user`,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${StateManager.getAccessToken()}`,
  },
});
