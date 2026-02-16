import { useEffect, useState } from 'react';
import { Badge, Tabs } from 'react-bootstrap';

import Card from '../card/card.component';
import s from './song-stats.module.css';
import Stat from './stat.component';
import Periods from '../../types/periods.enum';

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

const fetchSongData = async (
  availableData:
    | 'generalStats'
    | 'playbackState'
    | 'topAlbums'
    | 'topArtists'
    | 'topSongs',
  period?: Periods,
) => {
  const params = new URLSearchParams({
    data: availableData,
    ...period ? { period } : {}
  });

  const response = await fetch(`/api/music-data?${params}`);
  const data = await response.json();
  return data;
};

function SongStats() {
  const [currentTab, setCurrentTab] = useState('topAlbums');
  const [playbackState, setPlaybackState] = useState<Track[]>([]);
  const [topAlbums, setTopAlbums] = useState<Album[]>([]);
  const [stats, setStats] = useState<SongStats>({
    album_count: '0',
    artist_count: '0',
    playcount: '0',
    track_count: '0',
  });

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

    const topAlbums = async (): Promise<void> => {
      const data = await fetchSongData('topAlbums');
      if (data) {
        console.log(data.topalbums);
        // setTopAlbums()
      }
    }

    topAlbums();
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
          <div className="col-12 col-lg-7 mb-2 mb-lg-0">
            {track && (
              <Card
                topPill={
                  <>
                    {track?.['@attr']?.nowplaying && (
                      <Badge bg="danger" className="mb-1">
                        <h6 className="text-truncate d-inline-block m-0">
                          Ouvindo agora
                        </h6>
                        <span id={s['bars']} className="ms-1">
                          <span />
                          <span />
                          <span />
                          <span />
                        </span>
                      </Badge>
                    )}
                    {track?.date && (
                      <Badge className="text-truncate" bg="secondary">
                        <h6 className="text-truncate d-inline-block m-0">
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
            <div id={s['previous-songs']} className="row overflow-auto">
              {playbackState
                ?.filter((_, index) => index !== 0)
                .map((track, index) => (
                  <div key={`${index}-${track.url}`} className="mb-2">
                    <Card
                      topPill={
                        <>
                          {track?.date && (
                            <Badge className="text-truncate" bg="secondary">
                              {formatUnixDate(Number.parseInt(track?.date.uts))}
                            </Badge>
                          )}
                        </>
                      }
                      header={track.name}
                      body={track.artist['#text']}
                      image={{
                        src: track.image['3']['#text'],
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

      <Tabs activeKey={currentTab} onSelect={(k) => setCurrentTab(k as string)}>

      </Tabs>
    </section>
  );
}

export default SongStats;
