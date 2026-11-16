import { NextRequest, NextResponse } from 'next/server';
import { BUNDLED_FALLBACK_POSTS } from '@/lib/news-service';
import { PostItem } from '@/lib/types';

export const dynamic = 'force-dynamic';

function cleanHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const page = searchParams.get('page') || '1';

  const wpUrl = new URL('https://madheshi.com/wp-json/wp/v2/posts');
  wpUrl.searchParams.set('_embed', '1');
  wpUrl.searchParams.set('per_page', '10');
  wpUrl.searchParams.set('page', page);

  if (category && category !== '0') {
    wpUrl.searchParams.set('categories', category);
  }
  if (search) {
    wpUrl.searchParams.set('search', search);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const wpRes = await fetch(wpUrl.toString(), {
      signal: controller.signal,
      headers: {
        'User-Agent': 'MadheshiApp/1.0',
        Accept: 'application/json',
      },
      next: { revalidate: 120 },
    });
    clearTimeout(timeoutId);

    if (wpRes.ok) {
      const postsJson = await wpRes.json();
      if (Array.isArray(postsJson)) {
        const posts: PostItem[] = postsJson.map((item: any) => {
          let featuredImageUrl: string | undefined;
          const media = item._embedded?.['wp:featuredmedia']?.[0];
          if (media?.source_url) {
            featuredImageUrl = media.source_url;
          }

          let authorName = 'मधेशी डेस्क';
          const author = item._embedded?.author?.[0];
          if (author?.name) {
            authorName = author.name;
          }

          const categories: { id: number; name: string }[] = [];
          const terms = item._embedded?.['wp:term']?.[0];
          if (Array.isArray(terms)) {
            terms.forEach((t: any) => {
              if (t.id && t.name) {
                categories.push({ id: t.id, name: t.name });
              }
            });
          }

          return {
            id: item.id,
            title: cleanHtml(item.title?.rendered || 'समाचार'),
            excerpt: cleanHtml(item.excerpt?.rendered || ''),
            content: item.content?.rendered || item.excerpt?.rendered || '',
            date: item.date || new Date().toISOString(),
            link: item.link || `https://madheshi.com/?p=${item.id}`,
            authorName,
            featuredImageUrl,
            categories: categories.length > 0 ? categories : [{ id: 2, name: 'मधेश समाचार' }],
            isCached: false,
          };
        });

        return NextResponse.json({ posts, isOffline: false });
      }
    }
  } catch (err) {
    console.warn('Madheshi.com upstream connection error, using bundled fallback:', err);
  }

  // Graceful fallback to bundled high-fidelity fallback articles
  let filtered = [...BUNDLED_FALLBACK_POSTS];
  if (category && category !== '0') {
    const catId = parseInt(category, 10);
    filtered = filtered.filter((p) => p.categories.some((c) => c.id === catId));
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ posts: filtered, isOffline: true });
}
