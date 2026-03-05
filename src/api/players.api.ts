import { API_BASE_URL, LOCALE, PAGE_SIZE } from '@/common/constants';
import type { PlayersApiResponse } from '@/common/types';
import { readCache, writeCache } from './players.cache';

export interface FetchPlayersParams {
  offset: number;
  limit?: number;
  query?: string;
}

interface ApiValidationError {
  statusCode: number;
  createdBy: string;
  validationErrors: string[];
}

function parseApiError(body: unknown): string {
  const err = body as ApiValidationError;
  if (err?.validationErrors?.length) {
    return err.validationErrors[0].split('\n')[0].trim();
  }
  return 'Unexpected error from server.';
}

export async function fetchPlayers({
  offset,
  limit = PAGE_SIZE,
  query,
}: FetchPlayersParams): Promise<PlayersApiResponse> {
  const base = API_BASE_URL.startsWith('http') ? API_BASE_URL : `${window.location.origin}${API_BASE_URL}`;
  const url = new URL(base);
  url.searchParams.set('locale', LOCALE);
  url.searchParams.set('offset', String(offset));
  url.searchParams.set('limit', String(limit));
  if (query) url.searchParams.set('search', query);

  let response: Response;
  try {
    response = await fetch(url.toString());
  } catch {
    const cached = readCache(offset, query);
    if (cached) return cached;
    throw new Error('No network connection and no cached data.');
  }

  if (!response.ok) {
    const cached = readCache(offset, query);
    if (cached) return cached;
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const body: unknown = await response.json();
      errorMessage = parseApiError(body);
    } catch { /* ignore parse failure */ }
    throw new Error(errorMessage);
  }

  const data = await response.json();

  // Normalize response: EA API may return array directly or wrapped
  let items: PlayersApiResponse['items'];
  let totalItems: number;

  if (Array.isArray(data)) {
    items = data as PlayersApiResponse['items'];
    totalItems = items.length;
  } else {
    const obj = data as Record<string, unknown>;
    items = (obj.items ?? obj.players ?? obj.data ?? []) as PlayersApiResponse['items'];
    totalItems = (obj.totalItems ?? obj.total ?? items.length) as number;
  }

  const result: PlayersApiResponse = {
    items: Array.isArray(items) ? items : [],
    totalItems,
  };

  writeCache(offset, result, query);
  return result;
}
