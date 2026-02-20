import { useCallback, useEffect, useRef, useState } from 'react';
import { Badge } from 'react-bootstrap';

import formatUnixDate from '../../../helpers/format-unix-date';
import Card from '../../card/card.component';
import type Periods from '../../songs-stats/periods.enum';
import type { Track } from '../../songs-stats/song-stats.types';
import s from './playback-status.module.css';
import useIsVisible from '../../../hooks/use-is-visible.hook';

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

export default function PlaybackStatus() {
  const [playbackState, setPlaybackState] = useState<Track[]>([]);

  const playbackWrapper = useRef<HTMLDivElement | null>(null);
  const playbackVisible = useIsVisible(playbackWrapper, [playbackState.length]);

  const getPlaybackState = useCallback(async (): Promise<void> => {
    const data = await fetchSongData<Track[]>('playbackState');
    if (data) {
      setPlaybackState(data);
    }
  }, []);

  useEffect(() => {
    getPlaybackState();
  }, []);

  useEffect(() => {
    if (!playbackVisible) return;

    const interval = setInterval(async () => {
      await getPlaybackState();
    }, 10000);

    return () => clearInterval(interval);
  }, [playbackVisible]);

  const track = playbackState?.at(0) as Track;

  return (
    <div className="row gx-2 mb-4" ref={playbackWrapper}>
      <div className="col-12 col-lg-7 mb-2 mb-lg-0" style={{ maxHeight: 318 }}>
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
          className="row overflow-auto"
          style={{ maxHeight: 318, scrollBehavior: 'smooth' }}
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
                            {formatUnixDate(Number.parseInt(track?.date.uts))}
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
            id={s['gradient']}
            className="position-absolute bottom-0 start-0 end-0"
          />
        </div>
      </div>
    </div>
  );
}
