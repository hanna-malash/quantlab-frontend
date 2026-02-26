export const env = {
  //Use "/api" so Vite proxy works in dev.
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "/api",
};
