import type { APIRoute } from 'astro';
import {
  SONGS_STATS_ENDPOINT,
  SONGS_STATS_API_KEY,
  SONGS_STATS_USER,
} from 'astro:env/server';

import type Periods from '../../types/periods.enum';

const commonParams = {
  user: SONGS_STATS_USER,
  api_key: SONGS_STATS_API_KEY,
  format: 'json',
  limit: '6',
};

const availableRequests = {
  playbackState: (): Promise<Response> =>
    fetch(
      `${SONGS_STATS_ENDPOINT}/?${new URLSearchParams({
        ...commonParams,
        limit: '10',
        method: 'user.getrecenttracks',
      })}`,
    ),
  generalStats: (): Promise<Response> =>
    fetch(
      `${SONGS_STATS_ENDPOINT}/?${new URLSearchParams({
        ...commonParams,
        method: 'user.getinfo',
      })}`,
    ),
  topAlbums: (period?: Periods): Promise<Response> =>
    fetch(
      `${SONGS_STATS_ENDPOINT}/?${new URLSearchParams({
        ...commonParams,
        method: 'user.gettopalbums',
        ...(period ? { period } : {}),
      })}`,
    ),
  topArtists: (period?: Periods): Promise<Response> =>
    fetch(
      `${SONGS_STATS_ENDPOINT}/?${new URLSearchParams({
        ...commonParams,
        method: 'user.gettopartists',
        ...(period ? { period } : {}),
      })}`,
    ),
  topTracks: (period?: Periods): Promise<Response> =>
    fetch(
      `${SONGS_STATS_ENDPOINT}/?${new URLSearchParams({
        ...commonParams,
        method: 'user.gettoptracks',
        ...(period ? { period } : {}),
      })}`,
    ),
};

export const GET = (async ({ request }) => {
  try {
    const url = new URL(request.url);

    const data = url.searchParams.get('data');
    const period = url.searchParams.get('period') as Periods | null;

    if (data && Object.keys(availableRequests).some((k) => k === data)) {
      return await availableRequests[data as keyof typeof availableRequests](
        period || undefined,
      );
    }

    return new Response(null);
  } catch (error) {
    console.error(error);
    return new Response(null);
  }
}) satisfies APIRoute;

export const prerender = false;
