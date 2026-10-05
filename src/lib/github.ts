/**
 * Minimal GitHub Contents API client used ONLY by the hidden /area51 dashboard.
 *
 * SECURITY: the token is entered at runtime in the browser and kept in
 * sessionStorage for the tab lifetime. It is NEVER written into the repo,
 * bundled output, or committed files. Anyone who can use the dashboard still
 * needs a token with `contents:write` on this repo to save — obscurity alone
 * protects nothing, Cloudflare Access on /area51* is the real gate.
 */

export interface RepoRef {
  owner: string;
  repo: string;
  branch: string;
  /** Path of the JSON doc inside the repo, e.g. "src/data/links.json". */
  path: string;
}

interface ContentsOk {
  sha: string;
  content: string; // base64
}

function api(token?: string): HeadersInit {
  const h: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

function decodeContent(b64: string): string {
  // b64 may contain UTF-8; decode safely.
  const bin = atob(b64.replace(/\n/g, ''));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodeContent(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

export async function fetchDoc(ref: RepoRef, token?: string): Promise<{ text: string; sha: string }> {
  const url = `https://api.github.com/repos/${ref.owner}/${ref.repo}/contents/${ref.path}?ref=${encodeURIComponent(ref.branch)}`;
  const res = await fetch(url, { headers: api(token) });
  if (!res.ok) throw new Error(`GitHub read failed (${res.status}). Check owner/repo/branch/path.`);
  const data = (await res.json()) as ContentsOk;
  return { text: decodeContent(data.content), sha: data.sha };
}

export async function saveDoc(
  ref: RepoRef,
  token: string,
  text: string,
  sha: string,
  message: string,
): Promise<{ commitUrl: string }> {
  const url = `https://api.github.com/repos/${ref.owner}/${ref.repo}/contents/${ref.path}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...api(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, content: encodeContent(text), sha, branch: ref.branch }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub save failed (${res.status}): ${err.slice(0, 220)}`);
  }
  const data = await res.json();
  return { commitUrl: data?.commit?.html_url ?? '' };
}
