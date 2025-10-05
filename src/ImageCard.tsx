// src/ImageCard.tsx
import type { GalleryItem } from './api';

export function ImageCard(props: {
  item: GalleryItem;
  onOpen: (item: GalleryItem) => void;
  onBroken: (id: string) => void;
}) {
  const { item, onOpen, onBroken } = props;
  return (
    <button
      className="group relative rounded-2xl overflow-hidden bg-white shadow hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
      onClick={() => onOpen(item)}
    >
      <img
        src={item.thumb}
        alt={item.title ?? 'Animal image'}
        loading="lazy"
        className="w-full h-48 object-cover"
        onError={() => onBroken(item.id)}
      />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition flex items-center justify-center bg-black/30 text-white text-sm">
        Tap to view
      </div>
    </button>
  );
}
