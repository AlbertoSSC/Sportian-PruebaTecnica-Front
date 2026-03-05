import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { mockApiResponse, mockPlayers } from './player.mocks';

export const handlers = [
  http.get('https://drop-api.ea.com/rating/ea-sports-fc', ({ request }) => {
    const name = new URL(request.url).searchParams.get('search')?.toLowerCase();
    if (name) {
      const filtered = mockPlayers.filter((p) =>
        (p.commonName ?? `${p.firstName} ${p.lastName}`).toLowerCase().includes(name)
      );
      return HttpResponse.json({ items: filtered, totalItems: filtered.length });
    }
    return HttpResponse.json(mockApiResponse);
  }),
];

export const server = setupServer(...handlers);
