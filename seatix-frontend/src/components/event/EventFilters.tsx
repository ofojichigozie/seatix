import { useRef, useState } from 'react';
import { EVENT_CATEGORIES } from '../../types/event.types';

interface FiltersValue {
  search: string;
  category: string;
  startDate: string;
  endDate: string;
}

interface EventFiltersProps {
  value: FiltersValue;
  onChange: (value: FiltersValue) => void;
}

export default function EventFilters({ value, onChange }: EventFiltersProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [expanded, setExpanded] = useState(false);

  const handleChange = (field: keyof FiltersValue, val: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange({ ...value, [field]: val });
    }, 300);
  };

  const hasAdvancedFilters = !!(value.category || value.startDate || value.endDate);

  const clearAll = () => {
    onChange({ search: '', category: '', startDate: '', endDate: '' });
  };

  return (
    <div className="space-y-3">
      {/* Always-visible row: search + toggle */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search events..."
          defaultValue={value.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:w-60"
        />
        <button
          onClick={() => setExpanded((v) => !v)}
          className={`relative flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
            expanded
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h18M7 8h10M10 12h4"
            />
          </svg>
          Filters
          {hasAdvancedFilters && (
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-primary-600" />
          )}
        </button>
      </div>

      {/* Collapsible advanced filters */}
      {expanded && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <select
            value={value.category}
            onChange={(e) => onChange({ ...value, category: e.target.value })}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">All categories</option>
            {EVENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-xs text-gray-400">From</label>
            <input
              type="date"
              value={value.startDate}
              onChange={(e) => onChange({ ...value, startDate: e.target.value })}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-xs text-gray-400">To</label>
            <input
              type="date"
              value={value.endDate}
              onChange={(e) => onChange({ ...value, endDate: e.target.value })}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {hasAdvancedFilters && (
            <button onClick={clearAll} className="text-sm text-red-500 hover:text-red-700">
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
