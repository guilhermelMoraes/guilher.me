import OverviewStats from './overview-stats';
import PlaybackStatus from './playback-status/playback-status.component';
import TopMusicMetrics from './top-music-metrics.component';

export default function MusicData() {
  return (
    <section>
      <h2 className="text-center">Minhas músicas 🎧</h2>
      <OverviewStats />
      <PlaybackStatus />
      <TopMusicMetrics />
    </section>
  );
}
