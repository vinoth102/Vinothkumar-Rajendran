// src/useInfiniteImages.ts
import { useCallback, useEffect, useState } from 'react';
import type { GalleryItem, PageCursor } from './api';
import { fetchPageBySource } from './api';
import type { ApiSource } from './species';

export function useInfiniteImages(opts: {
  query: string;
  apiSource: ApiSource;
  pageSize: number;
  targetTotal: number;
}) {
  const { query, apiSource, pageSize, targetTotal } = opts;
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [cursor, setCursor] = useState<PageCursor | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endReached = items.length >= targetTotal;

  const reset = useCallback(() => {
    setItems([]);
    setCursor(undefined);
    setError(null);
  }, []);

  const fetchNext = useCallback(async () => {
    if (loading || endReached) return;
    setLoading(true);
    try {
      const remaining = targetTotal - items.length;
      const size = Math.min(pageSize, Math.max(1, remaining));
      const { items: nextItems, next } = await fetchPageBySource(apiSource, {
        query,
        cursor,
        pageSize: size,
      });
      setItems(prev => [...prev, ...nextItems]);
      setCursor(next);
    } catch (e: any) {
      setError(e?.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [apiSource, cursor, endReached, items.length, loading, pageSize, query, targetTotal]);

  // when query or api source changes
  useEffect(() => { reset(); }, [query, apiSource, reset]);

  const removeById = useCallback((id: string) => {
    setItems(prev => prev.filter(it => it.id !== id));
  }, []);

  return { items, fetchNext, loading, error, endReached, removeById, reset };
}
