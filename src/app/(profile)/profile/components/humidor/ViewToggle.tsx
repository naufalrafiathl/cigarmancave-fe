import { LayoutGrid, List } from 'lucide-react';

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

export function ViewToggle({ viewMode, setViewMode }: ViewToggleProps) {
  return (
    <div className="flex gap-2 bg-[#2A2A2A] rounded-lg p-1">
      <button
        onClick={() => setViewMode('grid')}
        className={`p-2 rounded-md transition-colors ${
          viewMode === 'grid'
            ? 'bg-[#EFA427] text-white'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
        aria-label="Grid view"
      >
        <LayoutGrid size={20} />
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`p-2 rounded-md transition-colors ${
          viewMode === 'list'
            ? 'bg-[#EFA427] text-white'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
        aria-label="List view"
      >
        <List size={20} />
      </button>
    </div>
  );
}