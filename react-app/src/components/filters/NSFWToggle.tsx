import { useNSFW } from '@/contexts/NSFWContext';

export function NSFWToggle() {
  const { nsfwEnabled, toggleNSFWFilter } = useNSFW();

  return (
    <button
      className={`nsfw-toggle ${nsfwEnabled ? 'enabled' : 'disabled'}`}
      onClick={toggleNSFWFilter}
      title={nsfwEnabled ? 'NSFW filter enabled - Click to reveal all' : 'NSFW filter disabled - All content visible'}
    >
      {nsfwEnabled ? '🔒 NSFW Filter ON' : '🔓 NSFW Filter OFF'}
    </button>
  );
}
