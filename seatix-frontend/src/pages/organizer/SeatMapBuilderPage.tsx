import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSeatMap, type SeatSection } from '../../hooks/useSeatMap';
import Spinner from '../../components/common/Spinner';
import type { SeatType } from '../../types/seat.types';
import { SEAT_TYPE_LABELS } from '../../types/seat.types';
import type { Section } from '../../types/seat.types';

const defaultRow = (): SeatSection['rows'][number] => ({
  row: 'A',
  seatCount: 10,
  seatType: 'regular',
  price: 5000,
});

function seatMapToBuilderSections(sections: Section[]): SeatSection[] {
  return sections.map((section) => {
    const rowMap = new Map<
      string,
      { row: string; seatType: SeatType; price: number; count: number }
    >();
    for (const seat of section.seats) {
      const existing = rowMap.get(seat.row);
      if (existing) {
        existing.count++;
      } else {
        rowMap.set(seat.row, {
          row: seat.row,
          seatType: seat.seatType,
          price: Number(seat.price),
          count: 1,
        });
      }
    }
    return {
      name: section.name,
      rows: Array.from(rowMap.values()).map((r) => ({
        row: r.row,
        seatCount: r.count,
        seatType: r.seatType,
        price: r.price,
      })),
    };
  });
}

export default function SeatMapBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const { seatMap, loading, saveSeatMap, saveLoading } = useSeatMap(id!);
  const [sections, setSections] = useState<SeatSection[]>([{ name: 'Main', rows: [defaultRow()] }]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && seatMap && seatMap.sections.length > 0) {
      setSections(seatMapToBuilderSections(seatMap.sections));
      setInitialized(true);
    }
  }, [seatMap, initialized]);

  const addSection = () =>
    setSections((prev) => [...prev, { name: `Section ${prev.length + 1}`, rows: [defaultRow()] }]);

  const removeSection = (si: number) => setSections((prev) => prev.filter((_, i) => i !== si));

  const addRow = (si: number) =>
    setSections((prev) =>
      prev.map((s, i) => (i === si ? { ...s, rows: [...s.rows, defaultRow()] } : s)),
    );

  const removeRow = (si: number, ri: number) =>
    setSections((prev) =>
      prev.map((s, i) => (i === si ? { ...s, rows: s.rows.filter((_, j) => j !== ri) } : s)),
    );

  const updateSection = (si: number, name: string) =>
    setSections((prev) => prev.map((s, i) => (i === si ? { ...s, name } : s)));

  const updateRow = <K extends keyof SeatSection['rows'][number]>(
    si: number,
    ri: number,
    key: K,
    val: SeatSection['rows'][number][K],
  ) =>
    setSections((prev) =>
      prev.map((s, i) =>
        i === si ? { ...s, rows: s.rows.map((r, j) => (j === ri ? { ...r, [key]: val } : r)) } : s,
      ),
    );

  const handleSave = () => saveSeatMap(sections, '/organizer');

  const isEditing = !loading && seatMap && seatMap.sections.length > 0;

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">
        {isEditing ? 'Edit Seat Map' : 'Seat Map Builder'}
      </h1>
      {isEditing ? (
        <p className="mb-6 text-sm text-gray-500">
          Saving will replace the current seat map configuration.
        </p>
      ) : (
        <div className="mb-6" />
      )}

      <div className="space-y-6">
        {sections.map((section, si) => (
          <div key={si} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-3">
              <input
                value={section.name}
                onChange={(e) => updateSection(si, e.target.value)}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Section name"
              />
              <button
                onClick={() => removeSection(si)}
                className="text-sm text-red-500 hover:text-red-700"
                disabled={sections.length === 1}
              >
                Remove
              </button>
            </div>

            <div className="space-y-3">
              {section.rows.map((row, ri) => (
                <div key={ri} className="grid grid-cols-2 items-end gap-3 sm:grid-cols-4 sm:gap-2">
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Row label</label>
                    <input
                      value={row.row}
                      onChange={(e) => updateRow(si, ri, 'row', e.target.value)}
                      className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none"
                      maxLength={3}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Seats</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={row.seatCount}
                      onChange={(e) => updateRow(si, ri, 'seatCount', Number(e.target.value))}
                      className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Type</label>
                    <select
                      value={row.seatType}
                      onChange={(e) => updateRow(si, ri, 'seatType', e.target.value as SeatType)}
                      className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none"
                    >
                      {(Object.keys(SEAT_TYPE_LABELS) as SeatType[]).map((t) => (
                        <option key={t} value={t}>
                          {SEAT_TYPE_LABELS[t]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Price (₦)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={0}
                        value={row.price}
                        onChange={(e) => updateRow(si, ri, 'price', Number(e.target.value))}
                        className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none"
                      />
                      <button
                        onClick={() => removeRow(si, ri)}
                        disabled={section.rows.length === 1}
                        className="whitespace-nowrap text-xs text-red-400 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => addRow(si)}
              className="mt-3 text-sm text-primary-600 hover:underline"
            >
              + Add row
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={addSection}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          + Add Section
        </button>
        <button
          onClick={handleSave}
          disabled={saveLoading}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
        >
          {saveLoading && <Spinner size="sm" />}
          Save Seat Map
        </button>
      </div>
    </div>
  );
}
