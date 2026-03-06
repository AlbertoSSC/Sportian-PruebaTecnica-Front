const isDev = import.meta.env.DEV;
const isTest = import.meta.env.VITEST;
export const API_BASE_URL =
  !isTest && isDev
    ? "/api/ea/rating/ea-sports-fc"
    : "https://drop-api.ea.com/rating/ea-sports-fc";

export const PAGE_SIZE = 25;
export const LOCALE = "es";
export const INFINITE_SCROLL_THRESHOLD = 300; // px from bottom
