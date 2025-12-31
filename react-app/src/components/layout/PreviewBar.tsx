import { usePlayer } from '@/contexts/PlayerContext';
import { AudioPreview } from '../player/AudioPreview';
import { SpectrumVisualizer } from '../player/SpectrumVisualizer';

export function PreviewBar() {
  const { activePreview, isPlaying } = usePlayer();

  if (!activePreview) return null;

  return (
    <div id="previewBar">
      <img src={activePreview.track.album.cover_small} alt={activePreview.track.album.title} />
      <div className="info">
        <strong>{activePreview.track.title}</strong>
        <br />
        <small>
          {activePreview.track.artist.name} • {activePreview.year || ''}
        </small>
        <SpectrumVisualizer isPlaying={isPlaying} />
      </div>
      <AudioPreview />
    </div>
  );
}
