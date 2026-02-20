import type Periods from './types/periods.enum';

type AvailableData =
  | 'generalStats'
  | 'playbackState'
  | 'topAlbums'
  | 'topArtists'
  | 'topTracks';

export default async function fetchSongData<T = unknown>(
  availableData: AvailableData,
  period?: Periods,
) {
  const params = new URLSearchParams({
    data: availableData,
    ...(period ? { period } : {}),
  });

  const response = await fetch(`/api/music-data?${params}`);
  return response.json() as T;
}
