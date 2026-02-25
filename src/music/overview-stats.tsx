import { Fragment, use, useEffect, useRef, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import HOCWithSuspense from '../hoc/with-suspense';
import fetchSongData from './fetch-song-data.service';
import type { Stat } from './types/music.types';
import useIsVisible from '../hooks/use-is-visible.hook';
import makeFallbackArray from '../helpers/make-fallback-array';

const FIFTEEN_SECONDS = 15000;
const initialStatsPromise = fetchSongData<Stat[]>('generalStats');

function OverviewStats() {
  const initialStats = use(initialStatsPromise);
  const [stats, setStats] = useState<Stat[]>(initialStats);
  const statsWrapper = useRef<null | HTMLDivElement>(null);
  const areStatsVisible = useIsVisible(statsWrapper);

  useEffect(() => {
    if (!areStatsVisible) return;

    const interval = setInterval(async () => {
      setStats(await fetchSongData<Stat[]>('generalStats'));
    }, FIFTEEN_SECONDS);

    return () => clearInterval(interval);
  }, [areStatsVisible]);

  return (
    <section className="container">
      <div className="row" ref={statsWrapper}>
        {stats.map(({ label, value }) => (
          <div className="col-6 col-sm-3" key={label}>
            <div>
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
  );
}

function OverviewStatsFallback() {
  const fallbackStat = (
    <div className="col-6 col-sm-3 placeholder-glow text-center">
      <small className="placeholder w-100" />
      <h4 className="placeholder w-25 mb-0" />
    </div>
  );

  return (
    <section className="container">
      <div className="row">
        {makeFallbackArray(4).map((value) => (
          <Fragment key={value}>{fallbackStat}</Fragment>
        ))}
      </div>
    </section>
  );
}

export default HOCWithSuspense(OverviewStats, OverviewStatsFallback);
