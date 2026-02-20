import { useCallback, useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';

import Periods from './periods.enum';
import PlaybackStatus from '../music-data/playback-status/playback-status.component';
import type { Album, Artist, TopTrack, Track } from './song-stats.types';
import Stat, { type StatProps } from './stat.component';
import TopItems from './top-items';
import MusicStats from '../music-data/music-stats';

const podium: Record<string, string> = {
  '1': '🥇',
  '2': '🥈',
  '3': '🥉',
};

const fetchSongData = async <T = unknown,>(
  availableData:
    | 'generalStats'
    | 'playbackState'
    | 'topAlbums'
    | 'topArtists'
    | 'topTracks',
  period?: Periods,
): Promise<T> => {
  const params = new URLSearchParams({
    data: availableData,
    ...(period ? { period } : {}),
  });

  const response = await fetch(`/api/music-data?${params}`);
  const data = (await response.json()) as T;

  return data;
};

function SongStats() {
  const [currentTab, setCurrentTab] = useState('topAlbums');
  const [topTracks, setTopTracks] = useState<TopTrack[]>([]);
  const [playbackState, setPlaybackState] = useState<Track[]>([]);
  const [topAlbums, setTopAlbums] = useState<Album[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [stats, setStats] = useState<StatProps[]>([]);

  const [playbackVisible, setPlaybackVisible] = useState(true);

  const getTopAlbums = useCallback(
    async (period: Periods = Periods.LAST_WEEK): Promise<void> => {
      const data = await fetchSongData<Album[]>('topAlbums', period);
      if (data) {
        setTopAlbums(data);
      }
    },
    [],
  );

  const getTopArtists = useCallback(
    async (period: Periods = Periods.LAST_WEEK): Promise<void> => {
      const data = await fetchSongData<Artist[]>('topArtists', period);
      if (data) {
        setTopArtists(data);
      }
    },
    [],
  );

  const getTopTracks = useCallback(
    async (period: Periods = Periods.LAST_WEEK): Promise<void> => {
      const data = await fetchSongData<TopTrack[]>('topTracks', period);
      if (data) {
        setTopTracks(data);
      }
    },
    [],
  );

  const getGeneralStats = useCallback(async (): Promise<void> => {
    const data = await fetchSongData<StatProps[]>('generalStats');

    if (data) {
      setStats(data);
    }
  }, []);

  const getPlaybackState = useCallback(async (): Promise<void> => {
    const data = await fetchSongData<Track[]>('playbackState');
    if (data) {
      setPlaybackState(data);
    }
  }, []);

  const fetchDataPerPeriod = useCallback(
    async (source: 'albums' | 'tracks' | 'artists', period: Periods) => {
      const fetchers = {
        albums: getTopAlbums,
        artists: getTopArtists,
        tracks: getTopTracks,
      };

      fetchers[source](period);
    },
    [getTopAlbums, getTopArtists, getTopTracks],
  );

  useEffect(() => {
    const fetchSongsData = () => {
      getTopTracks();
      getTopAlbums();
      getTopArtists();
      getGeneralStats();
      getPlaybackState();
    };

    fetchSongsData();
  }, []);

  // useEffect(() => {
  //   if (!playbackVisible) return;

  //   const interval = setInterval(async () => {
  //     await getPlaybackState();
  //     await getGeneralStats();
  //   }, 10000);

  //   return () => clearInterval(interval);
  // }, [playbackVisible]);

  const hasStats =
    topTracks.length > 0 || topArtists.length > 0 || topAlbums.length > 0;

  return (
    <section className="container">
      <div className="row mb-4">
        <div className="col">
          <h2 className="text-center">Minhas músicas 🎧</h2>
          {stats.length > 0 && (
            <div className="row">
              {stats.map(({ label, value }) => (
                <Stat key={label} label={label} value={value} />
              ))}
            </div>
          )}
        </div>
      </div>

      <MusicStats />
      <PlaybackStatus />

      {hasStats && (
        <>
          <div className="row">
            <div className="col">
              <h3 className="text-center">Mais ouvidos</h3>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Tabs
                activeKey={currentTab}
                onSelect={(k) => setCurrentTab(k as string)}
              >
                <Tab eventKey="topAlbums" title="Álbuns" className="py-3">
                  <TopItems
                    periodSelector={{
                      source: 'albums',
                      setState: fetchDataPerPeriod,
                    }}
                    items={topAlbums.map((album) => ({
                      header: album.name,
                      body: album.artist.name,
                      link: album.url,
                      image: {
                        src: album.image[2]['#text'],
                        alt: `Album cover for ${album.name}`,
                      },
                      topPill: `Tocado ${album.playcount} vezes ${podium[album['@attr'].rank] ?? '⭐'}`,
                    }))}
                  />
                </Tab>

                <Tab eventKey="topArtists" title="Artistas" className="py-3">
                  <TopItems
                    periodSelector={{
                      source: 'artists',
                      setState: fetchDataPerPeriod,
                    }}
                    items={topArtists.map((artist) => ({
                      header: artist.name,
                      link: artist.url,
                      image: {
                        src: artist.image[2]['#text'],
                        alt: `Album cover for ${artist.name}`,
                      },
                      topPill: `Tocado ${artist.playcount} vezes ${podium[artist['@attr'].rank] ?? '⭐'}`,
                    }))}
                  />
                </Tab>

                <Tab eventKey="topTracks" title="Músicas" className="py-3">
                  <TopItems
                    periodSelector={{
                      source: 'tracks',
                      setState: fetchDataPerPeriod,
                    }}
                    items={topTracks.map((track) => ({
                      header: track.name,
                      body: track.artist.name,
                      link: track.url,
                      image: {
                        src: track.image[2]['#text'],
                        alt: `Album cover for ${track.name}`,
                      },
                      topPill: `Tocada ${track.playcount} vezes ${podium[track['@attr'].rank] ?? '⭐'}`,
                    }))}
                  />
                </Tab>
              </Tabs>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default SongStats;
