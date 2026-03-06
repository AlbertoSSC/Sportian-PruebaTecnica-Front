import type { PlayersApiResponse } from '@/common/types';

const CACHE_PREFIX = "eafc_page_";
export const CACHE_TTL_MS = 60 * 60 * 1000;

function cacheKey(offset: number, query?: string): string {
  return query ? `${CACHE_PREFIX}q:${query}:${offset}` : `${CACHE_PREFIX}${offset}`;
}

interface CachedPage {
  data: PlayersApiResponse;
  timestamp: number;
}

export function readCache(offset: number, query?: string): PlayersApiResponse | null {
  try {
    const raw = localStorage.getItem(cacheKey(offset, query));
    if (!raw) return null;

    const cached: CachedPage = JSON.parse(raw) as CachedPage;
    if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(cacheKey(offset, query));
      return null;
    }
    return cached.data;
  } catch {
    return null;
  }
}

export function writeCache(offset: number, data: PlayersApiResponse, query?: string): void {
  const entry: CachedPage = { data, timestamp: Date.now() };
  const value = JSON.stringify(entry);
  const key = cacheKey(offset, query);
  try {
    localStorage.setItem(key, value);
  } catch {
    clearExpiredCache();
    try {
      localStorage.setItem(key, value);
    } catch {
      // Still no space – skip silently
    }
  }
}

export function clearCache(): void {
  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) keysToRemove.push(key);
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

export function clearExpiredCache(): void {
  const keysToRemove: string[] = [];
  const now = Date.now();

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith(CACHE_PREFIX)) continue;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const { timestamp } = JSON.parse(raw) as CachedPage;
      if (now - timestamp > CACHE_TTL_MS) keysToRemove.push(key);
    } catch {
      keysToRemove.push(key!);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}
