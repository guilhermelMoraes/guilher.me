import { useCallback, useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';

import Periods from './types/periods.enum';
import type { Album, Artist, TopTrack } from './types/music.types';
import TopItems from './top-items';
import fetchSongData from './fetch-song-data.service';

const podium: Record<string, string> = {
  '1': '🥇',
  '2': '🥈',
  '3': '🥉',
};

export default function TopMusicMetrics() {
  const [currentTab, setCurrentTab] = useState('topTracks');
  const [topTracks, setTopTracks] = useState<TopTrack[]>([]);
  const [topAlbums, setTopAlbums] = useState<Album[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);

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
                      body: album.artist.name,
                      link: album.url,
                      image: {
                        src: album.image[2]['#text'],
                        alt: `Album cover for ${album.name}`,
                      },
                      topPill: {
                        bg: 'primary',
                        content: `Tocado ${album.playcount} vezes ${podium[album['@attr'].rank] ?? '⭐'}`,
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
                      image: {
                        src: artist.image[2]['#text'],
                        alt: `Album cover for ${artist.name}`,
                      },
                      topPill: {
                        content: `Tocado ${artist.playcount} vezes ${podium[artist['@attr'].rank] ?? '⭐'}`,
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
