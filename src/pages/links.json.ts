import doc from '../data/links.json';

export async function GET(): Promise<Response> {
  return new Response(JSON.stringify(doc), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
