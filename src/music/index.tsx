import OverviewStats from './overview-stats';
import PlaybackStatus, {
  PlaybackStatusFallback,
} from './playback-status/playback-status.component';

export default function MusicData() {
  return (
    <section>
      <h2 className="text-center">Minhas músicas 🎧</h2>
      <OverviewStats />
      <PlaybackStatusFallback />
      <PlaybackStatus />
    </section>
  );
}
