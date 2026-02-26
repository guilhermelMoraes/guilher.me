import { useCallback, useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';

import Periods from './types/periods.enum';
import type { TopAlbum, TopArtist, TopTrack } from './types/music.types';
import TopItems from './top-items';
import fetchSongData from './fetch-song-data.service';

const podium: Record<string, string> = {
  '1': '🥇',
  '2': '🥈',
  '3': '🥉',
};

export default function TopMusicMetrics() {
  const [currentTab, setCurrentTab] = useState('topAlbums');
  const [topTracks, setTopTracks] = useState<TopTrack[]>([]);
  const [topAlbums, setTopAlbums] = useState<TopAlbum[]>([]);
  const [topArtists, setTopArtists] = useState<TopArtist[]>([]);

  const getTopAlbums = useCallback(
    async (period: Periods = Periods.LAST_WEEK): Promise<void> => {
      const data = await fetchSongData<TopAlbum[]>('topAlbums', period);
      if (data) {
        setTopAlbums(data);
      }
    },
    [],
  );

  const getTopArtists = useCallback(
    async (period: Periods = Periods.LAST_WEEK): Promise<void> => {
      const data = await fetchSongData<TopArtist[]>('topArtists', period);
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
    };

    fetchSongsData();
  }, []);

  const hasStats =
    topTracks.length > 0 || topArtists.length > 0 || topAlbums.length > 0;

  return (
    <section className="container">
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
                fill
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
                      body: album.artist,
                      link: album.url,
                      image: album.cover,
                      topPill: {
                        bg: 'primary',
                        content: `Tocado ${album.playCount} vezes ${podium[album.rank] ?? '⭐'}`,
                      },
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
                      image: artist.cover,
                      topPill: {
                        content: `Tocado ${artist.playCount} vezes ${podium[artist.rank] ?? '⭐'}`,
                      },
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
                      body: track.artist,
                      link: track.url,
                      image: track.cover,
                      topPill: {
                        content: `Tocada ${track.playCount} vezes ${podium[track.rank] ?? '⭐'}`,
                      },
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
