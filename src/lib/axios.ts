// lib/axios.ts
import config from "@/config";
import axios from "axios";

const api = axios.create({
  baseURL: config.API_URL,
});

export default api;
