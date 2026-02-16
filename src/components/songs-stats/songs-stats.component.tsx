import { useCallback, useEffect, useState } from 'react';
import { Badge, Form, Tab, Tabs } from 'react-bootstrap';

import Periods from '../../types/periods.enum';
import Card from '../card/card.component';
import s from './song-stats.module.css';
import Stat from './stat.component';
import PeriodSelect from './period-select.component';

const formatUnixDate = (unixTs: number) => {
  const date = new Date(unixTs * 1000);

  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return formatter.format(date);
};

type SongStats = {
  playcount: string;
  artist_count: string;
  track_count: string;
  album_count: string;
};

const podium: Record<string, string> = {
  '1': '🥇',
  '2': '🥈',
  '3': '🥉',
};

const fetchSongData = async (
  availableData:
    | 'generalStats'
    | 'playbackState'
    | 'topAlbums'
    | 'topArtists'
    | 'topTracks',
  period?: Periods,
) => {
  const params = new URLSearchParams({
    data: availableData,
    ...(period ? { period } : {}),
  });

  const response = await fetch(`/api/music-data?${params}`);
  const data = await response.json();
  return data;
};

function SongStats() {
  const [currentTab, setCurrentTab] = useState('topAlbums');
  const [topTracks, setTopTracks] = useState<TopTrack[]>([]);
  const [playbackState, setPlaybackState] = useState<Track[]>([]);
  const [topAlbums, setTopAlbums] = useState<Album[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [stats, setStats] = useState<SongStats>({
    album_count: '0',
    artist_count: '0',
    playcount: '0',
    track_count: '0',
  });

  const getTopAlbums = useCallback(
    async (period: Periods = Periods.LAST_WEEK): Promise<void> => {
      const data = await fetchSongData('topAlbums', period);
      if (data) {
        setTopAlbums(data.topalbums.album);
      }
    },
    [],
  );

  const getTopArtists = useCallback(
    async (period: Periods = Periods.LAST_WEEK): Promise<void> => {
      const data = await fetchSongData('topArtists', period);
      if (data) {
        setTopArtists(data.topartists.artist);
      }
    },
    [],
  );

  const getTopTracks = useCallback(
    async (period: Periods = Periods.LAST_WEEK): Promise<void> => {
      const data = await fetchSongData('topTracks', period);
      
      if (data) {
        setTopTracks(data.toptracks.track);
      }
    },
    [],
  );

  const fetchDataPerPeriod = useCallback(
    async (key: 'albums' | 'songs' | 'artists', period: Periods) => {
      if (key === 'albums') {
        await getTopAlbums(period);
      }

      if (key === 'artists') {
        await getTopArtists(period);
      }
    },
    [],
  );

  useEffect(() => {
    const getGeneralStats = async (): Promise<void> => {
      const data = await fetchSongData('generalStats');
      if (data) {
        setStats(data.user);
      }
    };

    const getPlaybackState = async (): Promise<void> => {
      const data = await fetchSongData('playbackState');
      if (data) {
        setPlaybackState(data.recenttracks.track);
      }
    };

    getTopTracks();
    getTopAlbums();
    getTopArtists();
    getGeneralStats();
    getPlaybackState();
  }, []);

  const track = playbackState?.at(0) as Track;
  const hasStats = Object.values(stats).some((s) => s !== '0');

  return (
    <section className="container">
      <div className="row mb-4">
        <div className="col">
          <h2 className="text-center">Minhas músicas 🎧</h2>
          {hasStats && (
            <div className="row">
              <Stat label="Artistas ouvidos" stat={stats.artist_count} />
              <Stat label="Álbuns ouvidos" stat={stats.album_count} />
              <Stat label="Total distintas ouvidas" stat={stats.track_count} />
              <Stat label="Total ouvidas" stat={stats.playcount} />
            </div>
          )}
        </div>
      </div>
      {playbackState.length > 0 && (
        <div className="row gx-2 mb-4">
          <div
            className="col-12 col-lg-7 mb-2 mb-lg-0"
            style={{ maxHeight: 318 }}
          >
            {track && (
              <Card
                topPill={
                  <>
                    {track?.['@attr']?.nowplaying && (
                      <Badge
                        bg="danger"
                        className="d-flex align-items-center mb-1"
                        style={{ maxWidth: '170px' }}
                      >
                        <h6 className="text-truncate m-0 flex-grow-1">
                          Ouvindo agora
                        </h6>
                        <span id={s['bars']} className="ms-1 flex-shrink-0">
                          <span />
                          <span />
                          <span />
                          <span />
                        </span>
                      </Badge>
                    )}
                    {track?.date && (
                      <Badge
                        className="d-flex align-items-center mb-1"
                        bg="secondary"
                      >
                        <h6 className="text-truncate m-0 flex-grow-1">
                          {formatUnixDate(Number.parseInt(track?.date.uts))}
                        </h6>
                      </Badge>
                    )}
                  </>
                }
                header={track.name}
                body={track.artist['#text']}
                image={{
                  src: track.image.at(-1)?.['#text'] as string,
                  alt: `Album cover for ${track.album['#text']}`,
                  maxSize: {
                    width: 300,
                    height: 300,
                  },
                }}
                link={track.url}
              />
            )}
          </div>

          <div className="col-12 col-lg-5 position-relative">
            <div
              id={s['previous-songs']}
              className="row overflow-auto"
              style={{ maxHeight: 318 }}
            >
              {playbackState
                ?.filter((_, index) => index !== 0)
                .map((track, index) => (
                  <div key={`${index}-${track.url}`} className="mb-2">
                    <Card
                      topPill={
                        <>
                          {track?.date && (
                            <Badge
                              className="d-flex align-items-center mb-1"
                              bg="secondary"
                              style={{ maxWidth: '200px' }}
                            >
                              <p className="mb-0 text-truncate">
                                {formatUnixDate(
                                  Number.parseInt(track?.date.uts),
                                )}
                              </p>
                            </Badge>
                          )}
                        </>
                      }
                      header={track.name}
                      body={track.artist['#text']}
                      image={{
                        src: track.image.at(-1)?.['#text'] as string,
                        alt: `Album cover for ${track?.name}`,
                      }}
                      link={track.url}
                    />
                  </div>
                ))}

              <div
                id={s['previous-songs__gradient']}
                className="position-absolute bottom-0 start-0 end-0"
              />
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col">
          <Tabs
            activeKey={currentTab}
            onSelect={(k) => setCurrentTab(k as string)}
          >
            {topAlbums.length > 0 && (
              <Tab eventKey="topAlbums" title="Álbuns" className="py-3">
                <PeriodSelect source="albums" teste={fetchDataPerPeriod} />

                <div className="container-fluid px-0">
                  <div className="row g-2">
                    {topAlbums.map((album, index) => (
                      <div className="col-lg-4" key={`${album}-${index}`}>
                        <Card
                          topPill={
                            <Badge
                              className="mb-0 d-flex align-items-center"
                              style={{ maxWidth: 150 }}
                            >
                              <p className="mb-0 text-truncate">
                                Tocado {album.playcount} vezes{' '}
                                {podium[album['@attr'].rank] ?? '⭐'}
                              </p>
                            </Badge>
                          }
                          header={album.name}
                          body={album.artist.name}
                          image={{
                            src: album.image[2]['#text'],
                            alt: `Album cover for ${album.name}`,
                          }}
                          link={album.url}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Tab>
            )}

            {topArtists.length > 0 && (
              <Tab eventKey="topArtists" title="Artistas" className="py-3">
                <PeriodSelect source="artists" teste={fetchDataPerPeriod} />
                <div className="container-fluid px-0">
                  <div className="row g-2">
                    {topArtists.map((artist, index) => (
                      <div className="col-lg-4" key={`${artist}-${index}`}>
                        <Card
                          topPill={
                            <Badge
                              className="mb-0 d-flex align-items-center"
                              style={{ maxWidth: 150 }}
                            >
                              <p className="mb-0 text-truncate">
                                Tocado {artist.playcount} vezes{' '}
                                {podium[artist['@attr'].rank] ?? '⭐'}
                              </p>
                            </Badge>
                          }
                          header={artist.name}
                          // body={artist.artist.name}
                          image={{
                            src: artist.image[2]['#text'],
                            alt: `Album cover for ${artist.name}`,
                          }}
                          link={artist.url}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Tab>
            )}
          </Tabs>
        </div>
      </div>
    </section>
  );
}

export default SongStats;
