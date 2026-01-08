export const envConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  iceServers: import.meta.env.VITE_ICE_SERVERS ? JSON.parse(import.meta.env.VITE_ICE_SERVERS) : [],
}
