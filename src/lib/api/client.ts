// Axios instance — base URL + JWT auth interceptor.
// For now all calls route through the mock transport (ARCHITECTURE.md §3.3, T0.7).
// To switch to real API: set NEXT_PUBLIC_USE_MOCK=false and provide NEXT_PUBLIC_API_URL.

import axios from "axios";

const USE_MOCK =
  typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_USE_MOCK !== "false"
    : true;

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("synergy_auth="))
      ?.split("=")[1];
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export { client, USE_MOCK };
