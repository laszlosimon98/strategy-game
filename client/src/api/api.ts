import { StateManager } from "@/manager/stateManager";
import { SERVER_URL } from "@/settings";
import axios from "axios";

export const authApi = axios.create({
  baseURL: `${SERVER_URL}/auth`,
  withCredentials: true,
});

export const userApi = axios.create({
  baseURL: `${SERVER_URL}/user`,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${StateManager.getAccessToken()}`,
  },
});
