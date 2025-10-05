// src/Header.tsx
import { SPECIES_ORDER, SPECIES, speciesGrad, type SpeciesKey } from './species';
import { useMemo } from 'react';

export function Header(props: {
  active: SpeciesKey;
  onSelect: (k: SpeciesKey) => void;
  muted: boolean;
  onToggleMute: () => void;
}) {
  const { active, onSelect, muted, onToggleMute } = props;

  const activeGrad = useMemo(() => speciesGrad[active], [active]);

  return (
    <header className={`sticky top-0 z-20 backdrop-blur bg-white/70 border-b`}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className={`text-xl md:text-2xl font-extrabold bg-gradient-to-r ${activeGrad} text-transparent bg-clip-text`}>
          Animal Explorer 🐾
        </h1>

        <nav className="flex flex-wrap gap-2 md:gap-3 items-center">
          {SPECIES_ORDER.map(k => {
            const s = SPECIES[k];
            const isActive = k === active;
            return (
              <button
                key={k}
                className={`px-3 py-1.5 rounded-full text-sm md:text-base border
                           flex items-center gap-1.5 transition
                           ${isActive ? 'bg-black text-white border-black' : 'bg-white hover:bg-gray-100'}`}
                onClick={() => onSelect(k)}
                aria-current={isActive ? 'page' : undefined}
              >
                <span aria-hidden>{s.emoji}</span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </nav>

        <button
          onClick={onToggleMute}
          className="ml-3 px-3 py-1.5 rounded-full border hover:bg-gray-100"
          aria-pressed={muted}
          title={muted ? 'Unmute sounds' : 'Mute sounds'}
        >
          {muted ? '🔇 Mute' : '🔊 Sound'}
        </button>
      </div>
    </header>
  );
}
