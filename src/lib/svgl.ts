import type { LinkItem } from './types';

const SVGL_API = 'https://api.svgl.app';
const CACHE_TTL = 7 * 24 * 3600 * 1000;
const mem = new Map<string, string>();

function cacheGet(key: string): string | null {
  try {
    const raw = localStorage.getItem('svgl:' + key);
    if (!raw) return null;
    const o = JSON.parse(raw) as { u: string; t: number };
    return Date.now() - o.t < CACHE_TTL && o.u ? o.u : null;
  } catch {
    return null;
  }
}

function cacheSet(key: string, url: string): void {
  try {
    localStorage.setItem('svgl:' + key, JSON.stringify({ u: url, t: Date.now() }));
  } catch {
    /* storage full / private mode — ignore */
  }
}

/**
 * Resolve a brand icon through the SVGL API (no key, rate-limited).
 * Always falls back to `iconUrl`, then null (caller renders a monogram).
 * Results are cached in memory + localStorage per SVGL's guidance.
 */
export function resolveIcon(link: Pick<LinkItem, 'icon' | 'iconUrl'>): Promise<string | null> {
  const term = (link.icon || '').trim();
  if (!term) return Promise.resolve(link.iconUrl || null);
  if (/^https?:\/\//i.test(term)) return Promise.resolve(term);
  const key = term.toLowerCase();
  if (mem.has(key)) return Promise.resolve(mem.get(key)!);
  const hit = cacheGet(key);
  if (hit) {
    mem.set(key, hit);
    return Promise.resolve(hit);
  }
  return fetch(`${SVGL_API}?search=${encodeURIComponent(term)}`)
    .then((r) => {
      if (!r.ok) throw new Error('svgl ' + r.status);
      return r.json();
    })
    .then((arr: Array<{ title?: string; route?: string | { dark?: string; light?: string } }>) => {
      if (!Array.isArray(arr) || arr.length === 0) throw new Error('svgl empty');
      const low = term.toLowerCase();
      const best = arr.find((x) => (x.title || '').toLowerCase() === low) ?? arr[0]!;
      const route = best.route;
      // Dark page: prefer the dark variant when SVGL ships light/dark pairs.
      const url = typeof route === 'string' ? route : (route?.dark || route?.light || null);
      if (!url) throw new Error('svgl no route');
      mem.set(key, url);
      cacheSet(key, url);
      return url;
    })
    .catch(() => {
      const fb = link.iconUrl || null;
      if (fb) mem.set(key, fb);
      return fb;
    });
}
