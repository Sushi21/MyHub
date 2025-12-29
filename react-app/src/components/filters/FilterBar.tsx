import { CategoryButtons } from './CategoryButtons';
import { GenreDropdown } from './GenreDropdown';
import { SearchBox } from './SearchBox';
import { RandomButton } from './RandomButton';
import { NSFWToggle } from './NSFWToggle';

export function FilterBar() {
  return (
    <div className="filters">
      <CategoryButtons />
      <GenreDropdown />
      <SearchBox />
      <RandomButton />
      <NSFWToggle />
    </div>
  );
}
