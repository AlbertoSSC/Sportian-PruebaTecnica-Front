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
  const url = new URL(API_BASE_URL, window.location.origin);
  url.searchParams.set('locale', LOCALE);
  url.searchParams.set('offset', String(offset));
  url.searchParams.set('limit', String(limit));
  if (query) url.searchParams.set('search', query);

  let response: Response;
  try {
    response = await fetch(url);
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

  const result: PlayersApiResponse = await response.json();

  writeCache(offset, result, query);
  return result;
}
