// src/App.tsx
import { useEffect, useRef, useState } from 'react';
import { Header } from './Header';
import { ImageCard } from './ImageCard';
import { Dialog } from './Dialog';
import { useInfiniteImages } from './useInfiniteImages';
import { SPECIES, speciesGrad, type SpeciesKey } from './species';

const PAGE_SIZE = 50;
const DEFAULT_TOTAL_PER_SPECIES = 500;

export default function App() {
  const [active, setActive] = useState<SpeciesKey>('dog');
  const [targetTotal, setTargetTotal] = useState<number>(DEFAULT_TOTAL_PER_SPECIES);
  const [itemOpen, setItemOpen] = useState<any | null>(null);
  const [muted, setMuted] = useState<boolean>(() => {
    const m = localStorage.getItem('animal-muted');
    return m === '1';
  });

  const spec = SPECIES[active];
  const grad = speciesGrad[active];

  const { items, fetchNext, loading, error, endReached, removeById, reset } =
    useInfiniteImages({
      query: spec.query,
      apiSource: spec.apiSource,
      pageSize: PAGE_SIZE,
      targetTotal,
    });

  // sentinel for infinite scroll
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) fetchNext();
      });
    }, { rootMargin: '600px' });
    io.observe(el);
    return () => io.disconnect();
  }, [fetchNext]);

  // refetch when category changes
  useEffect(() => { reset(); }, [active, reset]);

  function toggleMute() {
    setMuted(m => {
      const next = !m;
      localStorage.setItem('animal-muted', next ? '1' : '0');
      return next;
    });
  }

  const header = (
    <Header
      active={active}
      onSelect={setActive}
      muted={muted}
      onToggleMute={toggleMute}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {header}

      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-4 flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${grad} text-white text-sm font-semibold`}>
            {SPECIES[active].emoji} {SPECIES[active].label}
          </div>

          <label className="text-sm flex items-center gap-2">
            Target images:
            <input
              type="number"
              min={50}
              max={2000}
              step={50}
              value={targetTotal}
              onChange={e => setTargetTotal(Number(e.target.value || DEFAULT_TOTAL_PER_SPECIES))}
              className="w-24 px-2 py-1 border rounded"
            />
          </label>
        </div>

        {error && (
          <div className="mb-3 p-3 border-l-4 border-red-500 bg-red-50 text-red-800 rounded">
            {error}
          </div>
        )}

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map(it => (
            <ImageCard
              key={it.id}
              item={it}
              onOpen={setItemOpen}
              onBroken={removeById}
            />
          ))}
        </div>

        <div ref={sentinelRef} className="h-16 flex items-center justify-center">
          {!endReached && (loading ? <span>Loading…</span> : <span>Scroll to load more</span>)}
          {endReached && <span className="text-sm text-gray-600">Reached target total.</span>}
        </div>
      </section>

      <Dialog
        open={!!itemOpen}
        item={itemOpen}
        soundUrl={SPECIES[active].soundUrl}
        muted={muted}
        onClose={() => setItemOpen(null)}
      />
    </div>
  );
}
