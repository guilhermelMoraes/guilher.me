import { useCallback, useEffect, useRef, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import type Periods from './types/periods.enum';
import useIsVisible from '../../hooks/use-is-visible.hook';

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

type Stat = {
  label: string;
  value: string;
};

export default function OverviewStats() {
  const [stats, setStats] = useState<Stat[]>([]);
  const statsWrapper = useRef<HTMLDivElement | null>(null);
  const areStatsVisible = useIsVisible(statsWrapper, [stats.length]);

  const getGeneralStats = useCallback(async (): Promise<void> => {
    const data = await fetchSongData<Stat[]>('generalStats');

    if (data) {
      setStats(data);
    }
  }, []);

  useEffect(() => {
    getGeneralStats();
  }, []);

  useEffect(() => {
    if (!areStatsVisible) return;

    const interval = setInterval(async () => {
      await getGeneralStats();
    }, 10000);

    return () => clearInterval(interval);
  }, [areStatsVisible]);

  return (
    stats.length > 0 && (
      <section className="container">
        <div className="row" ref={statsWrapper}>
          {stats.map(({ label, value }) => (
            <div className="col-6 col-sm-3" key={label}>
              <div className="rounded">
                <small
                  className="d-block text-center text-truncate"
                  title={label}
                >
                  {label}{' '}
                  <OverlayTrigger
                    overlay={
                      <Tooltip>
                        Dados coletados a partir de 18 de abril de 2025.
                      </Tooltip>
                    }
                  >
                    <i className="bi bi-info-circle" />
                  </OverlayTrigger>
                </small>
                <h4 className="text-center mb-0">{value}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  );
}
