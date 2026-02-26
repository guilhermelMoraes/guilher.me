import { use, useEffect, useRef, useState } from 'react';

import Card from '../../components/card/card.component';
import formatUnixDate from '../../helpers/format-unix-date';
import makeFallbackArray from '../../helpers/make-fallback-array';
import HOCWithSuspense from '../../hoc/with-suspense';
import useIsVisible from '../../hooks/use-is-visible.hook';
import fetchSongData from '../fetch-song-data.service';
import type { Track } from '../types/music.types';
import s from './playback-status.module.css';

const FIFTEEN_SECONDS = 15000;
const initialPlaybackPromise = fetchSongData<Track[]>('playbackState');

function PlaybackStatus() {
  const initialPlaybackStatus = use(initialPlaybackPromise);
  const [playbackState, setPlaybackState] = useState<Track[]>(
    initialPlaybackStatus,
  );

  const playbackWrapper = useRef<HTMLDivElement | null>(null);
  const playbackVisible = useIsVisible(playbackWrapper);

  useEffect(() => {
    if (!playbackVisible) return;

    const interval = setInterval(async () => {
      setPlaybackState(await fetchSongData<Track[]>('playbackState'));
    }, FIFTEEN_SECONDS);

    return () => clearInterval(interval);
  }, [playbackVisible]);

  const track = playbackState?.at(0);
  const isPlayingNow = track?.['@attr']?.nowplaying || false;

  return (
    <section className="container">
      <div className="row gx-2" ref={playbackWrapper}>
        <div
          className="col-12 col-lg-7 mb-2 mb-lg-0"
          style={{ maxHeight: 318 }}
        >
          {track && (
            <Card
              topPill={{
                bg: isPlayingNow ? 'danger' : 'secondary',
                content: isPlayingNow ? (
                  <>
                    <h6 className="text-truncate m-0 flex-grow-1">
                      Ouvindo agora
                    </h6>
                    <span id={s['bars']} className="ms-1 flex-shrink-0">
                      <span />
                      <span />
                      <span />
                      <span />
                    </span>
                  </>
                ) : (
                  <h6 className="text-truncate m-0 flex-grow-1">
                    {formatUnixDate(Number.parseInt((track.date as any).uts))}
                  </h6>
                ),
              }}
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
                    topPill={{
                      bg: 'secondary',
                      maxWidth: 200,
                      content: track?.date && (
                        <p className="mb-0 text-truncate">
                          {formatUnixDate(Number.parseInt(track?.date.uts))}
                        </p>
                      ),
                    }}
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
    </section>
  );
}

export function PlaybackStatusFallback() {
  return (
    <section className="container">
      <div className="row gx-2">
        <div className="col-12 col-lg-7 mb-2 mb-lg-0">
          <Card
            mode="placeholder"
            fallbackProps={{ image: { height: 300, width: 300 } }}
          />
        </div>

        <div className="col-12 col-lg-5 position-relative">
          <div
            className="row overflow-auto"
            style={{ maxHeight: 318, scrollBehavior: 'smooth' }}
          >
            {makeFallbackArray(15).map((key) => (
              <div className="mb-2" key={key}>
                <Card mode="placeholder" />
              </div>
            ))}

            <div
              id={s['gradient']}
              className="position-absolute bottom-0 start-0 end-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HOCWithSuspense(PlaybackStatus, PlaybackStatusFallback);
