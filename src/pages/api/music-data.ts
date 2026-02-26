import type { APIRoute } from 'astro';
import {
  SONGS_STATS_ENDPOINT,
  SONGS_STATS_API_KEY,
  SONGS_STATS_USER,
} from 'astro:env/server';

import type Periods from '../../music/types/periods.enum';
import formatUnixDate from '../../helpers/format-unix-date';
import type { TopTrack, Track } from '../../music/types/music.types';

const commonParams = {
  user: SONGS_STATS_USER,
  api_key: SONGS_STATS_API_KEY,
  format: 'json',
  limit: '6',
};

const transformTrackPayload = (tracks: Record<string, any>[]): Track[] =>
  tracks.map((track) => ({
    name: track.name,
    album: track.album['#text'],
    artist: track.artist['#text'],
    url: track.url,
    cover: {
      src: track.image.at(-1)?.['#text'],
      alt: `Album cover for the track ${track.name}`,
    },
    ...(track?.date?.uts
      ? { lastPlayedAt: formatUnixDate(track.date.uts) }
      : {}),
  }));

const transformTopTrackPayload = (
  topTrack: Record<string, any>[],
): TopTrack[] =>
  topTrack.map((topTrack) => ({
    name: topTrack.name,
    playCount: topTrack.playcount,
    rank: topTrack['@attr']?.rank,
    url: topTrack.url,
    artist: topTrack.artist.name,
    cover: {
      src: topTrack.image.at(2)['#text'],
      alt: `Album cover for ${topTrack.name}`,
    },
  }));

const availableRequests = {
  playbackState: async (): Promise<Response> => {
    const fetchRecentTracks = await fetch(
      `${SONGS_STATS_ENDPOINT}/?${new URLSearchParams({
        ...commonParams,
        limit: '15',
        method: 'user.getrecenttracks',
      })}`,
    );

    if (fetchRecentTracks.status === 200) {
      const recentTracks = await fetchRecentTracks.json();
      return new Response(
        JSON.stringify(transformTrackPayload(recentTracks.recenttracks.track)),
      );
    }

    return new Response('[]');
  },
  generalStats: async (): Promise<Response> => {
    const fetchGeneralStats = await fetch(
      `${SONGS_STATS_ENDPOINT}/?${new URLSearchParams({
        ...commonParams,
        method: 'user.getinfo',
      })}`,
    );

    if (fetchGeneralStats.status === 200) {
      const {
        user: { artist_count, playcount, track_count, album_count },
      } = await fetchGeneralStats.json();

      return new Response(
        JSON.stringify([
          {
            label: 'Artistas ouvidos',
            value: artist_count,
          },
          {
            label: 'Total ouvidas',
            value: playcount,
          },
          {
            label: 'Total distintas ouvidas',
            value: track_count,
          },
          {
            label: 'Álbuns ouvidos',
            value: album_count,
          },
        ]),
      );
    }

    return new Response('null');
  },
  topAlbums: async (period?: Periods): Promise<Response> => {
    const fetchTopAlbums = await fetch(
      `${SONGS_STATS_ENDPOINT}/?${new URLSearchParams({
        ...commonParams,
        method: 'user.gettopalbums',
        ...(period ? { period } : {}),
      })}`,
    );

    if (fetchTopAlbums.status === 200) {
      const data = await fetchTopAlbums.json();
      return new Response(JSON.stringify(data.topalbums.album));
    }

    return new Response(null);
  },
  topArtists: async (period?: Periods): Promise<Response> => {
    const fetchTopArtists = await fetch(
      `${SONGS_STATS_ENDPOINT}/?${new URLSearchParams({
        ...commonParams,
        method: 'user.gettopartists',
        ...(period ? { period } : {}),
      })}`,
    );

    if (fetchTopArtists.status === 200) {
      const data = await fetchTopArtists.json();
      return new Response(JSON.stringify(data.topartists.artist));
    }

    return new Response(null);
  },
  topTracks: async (period?: Periods): Promise<Response> => {
    const fetchTopTracks = await fetch(
      `${SONGS_STATS_ENDPOINT}/?${new URLSearchParams({
        ...commonParams,
        method: 'user.gettoptracks',
        ...(period ? { period } : {}),
      })}`,
    );

    if (fetchTopTracks.status === 200) {
      const data = await fetchTopTracks.json();
      return new Response(
        JSON.stringify(transformTopTrackPayload(data.toptracks.track)),
      );
    }

    return new Response(null);
  },
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
