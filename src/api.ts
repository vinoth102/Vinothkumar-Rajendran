// src/api.ts
import type { ApiSource } from './species';

const COMMONS_ENDPOINT = 'https://commons.wikimedia.org/w/api.php';

export interface GalleryItem {
  id: string;
  thumb: string;
  full: string;
  title?: string;
  sourceUrl?: string;
}

export interface PageCursor {
  continue?: string;       // for Wikimedia
  page?: number;           // for paginated APIs
}

export interface FetchPageParams {
  query: string;
  cursor?: PageCursor;
  pageSize: number;
}

export async function fetchCommonsPage(
  { query, cursor, pageSize }: FetchPageParams
): Promise<{ items: GalleryItem[]; next?: PageCursor; }> {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    prop: 'imageinfo',
    generator: 'search',
    gsrlimit: String(pageSize),
    gsrsearch: query,
    iiprop: 'url',
    iiurlwidth: '600'
  });

  if (cursor?.continue) {
    // accept raw continue string
    const cont = new URLSearchParams(cursor.continue);
    for (const [k, v] of cont.entries()) params.set(k, v);
  }

  const url = `${COMMONS_ENDPOINT}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed Wikimedia request');

  const data = await res.json();

  const pages = data?.query?.pages ? Object.values<any>(data.query.pages) : [];
  const items: GalleryItem[] = pages
    .filter((p: any) => p?.imageinfo?.[0]?.thumburl || p?.imageinfo?.[0]?.url)
    .map((p: any) => {
      const ii = p.imageinfo[0];
      return {
        id: String(p.pageid),
        thumb: ii.thumburl || ii.url,
        full: ii.url,
        title: p.title,
        sourceUrl: ii.descriptionurl
      };
    });

  let next: PageCursor | undefined;
  if (data?.continue) {
    next = { continue: new URLSearchParams(data.continue as any).toString() };
  }
  return { items, next };
}

// ---- Optional: TheCatAPI / TheDogAPI (only for better quality) ----
// Put keys in .env as: VITE_CAT_API_KEY / VITE_DOG_API_KEY (optional)
const CAT_API = 'https://api.thecatapi.com/v1/images/search';
const DOG_API = 'https://api.thedogapi.com/v1/images/search';

function authHeaders(key?: string) {
  return key ? { 'x-api-key': key } : {};
}

async function fetchSimpleImageList(endpoint: string, limit: number, key?: string) {
  const res = await fetch(`${endpoint}?limit=${limit}`, { headers: authHeaders(key) });
  if (!res.ok) throw new Error('Failed species API request');
  return res.json();
}

export async function fetchCatPage(
  { pageSize, cursor }: FetchPageParams
): Promise<{ items: GalleryItem[]; next?: PageCursor; }> {
  const key = import.meta.env.VITE_CAT_API_KEY as string | undefined;
  const page = cursor?.page ?? 0;
  // Cat/Dog APIs don’t support classic pagination; fetch next chunk each time:
  const data = await fetchSimpleImageList(CAT_API, pageSize, key);
  const items: GalleryItem[] = (data || []).map((it: any, i: number) => ({
    id: it.id ?? `cat-${page}-${i}`,
    thumb: it.url,
    full: it.url,
    title: 'Cat',
    sourceUrl: it.url
  }));
  return { items, next: { page: page + 1 } };
}

export async function fetchDogPage(
  { pageSize, cursor }: FetchPageParams
): Promise<{ items: GalleryItem[]; next?: PageCursor; }> {
  const key = import.meta.env.VITE_DOG_API_KEY as string | undefined;
  const page = cursor?.page ?? 0;
  const data = await fetchSimpleImageList(DOG_API, pageSize, key);
  const items: GalleryItem[] = (data || []).map((it: any, i: number) => ({
    id: it.id ?? `dog-${page}-${i}`,
    thumb: it.url,
    full: it.url,
    title: 'Dog',
    sourceUrl: it.url
  }));
  return { items, next: { page: page + 1 } };
}

export async function fetchPageBySource(source: ApiSource, params: FetchPageParams) {
  switch (source) {
    case 'catapi': return fetchCatPage(params);
    case 'dogapi': return fetchDogPage(params);
    default: return fetchCommonsPage(params);
  }
}
