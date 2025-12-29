import type { Track } from '@/types/album';

interface TracksListProps {
  tracks: Track[];
  isVisible: boolean;
}

export function TracksList({ tracks, isVisible }: TracksListProps) {
  return (
    <div className={`tracks-list ${isVisible ? '' : 'hidden'}`}>
      <ul>
        {tracks.map((track, index) => (
          <li key={index}>
            {track.track}. {track.title} <span>{track.length}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
