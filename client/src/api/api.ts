import { StateManager } from "@/manager/stateManager";
import axios from "axios";

/**
 * Autentikáció API végpont kezelő
 */
export const authApi = axios.create({
  baseURL: `${(import.meta as any).env.VITE_SERVER_URL}/auth`,
  withCredentials: true,
});

/**
 * Felhasználó API végpont kezelő
 */
export const userApi = axios.create({
  baseURL: `${(import.meta as any).env.VITE_SERVER_URL}/user`,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${StateManager.getAccessToken()}`,
  },
});

/**
 * Statisztika API végpont kezelő
 */
export const statisticApi = axios.create({
  baseURL: `${(import.meta as any).env.VITE_SERVER_URL}/statistic`,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${StateManager.getAccessToken()}`,
  },
});
