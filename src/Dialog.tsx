// src/Dialog.tsx
import { useEffect, useRef } from 'react';
import type { GalleryItem } from './api';

export function Dialog(props: {
  open: boolean;
  item: GalleryItem | null;
  soundUrl?: string;
  muted: boolean;
  onClose: () => void;
}) {
  const { open, item, soundUrl, muted, onClose } = props;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!open || !item || !soundUrl || muted) return;
    const audio = new Audio(soundUrl);
    audioRef.current = audio;
    // gentle volume for kids
    audio.volume = 0.6;
    audio.play().catch(() => { /* ignore autoplay errors */ });
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, [open, item, soundUrl, muted]);

  if (!open || !item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-2 flex justify-end">
          <button className="px-3 py-1 rounded-full border hover:bg-gray-100" onClick={onClose}>
            ✖ Close
          </button>
        </div>
        <div className="px-4 pb-4">
          <img
            src={item.full}
            alt={item.title ?? 'Animal image'}
            className="w-full max-h-[75vh] object-contain"
          />
          {item.sourceUrl && (
            <div className="text-sm mt-2">
              Source: <a className="text-blue-600 underline" href={item.sourceUrl} target="_blank" rel="noopener noreferrer">{item.title ?? 'link'}</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
