import { SERVER_URL } from "@/settings";
import axios from "axios";

export const authApi = axios.create({
  baseURL: `${SERVER_URL}/auth`,
  withCredentials: true,
});
