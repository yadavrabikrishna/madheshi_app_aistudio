import { NextResponse } from 'next/server';
import { DEFAULT_CATEGORIES } from '@/lib/news-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const wpRes = await fetch('https://madheshi.com/wp-json/wp/v2/categories?per_page=20', {
      signal: controller.signal,
      headers: {
        'User-Agent': 'MadheshiApp/1.0',
        Accept: 'application/json',
      },
      next: { revalidate: 3600 },
    });
    clearTimeout(timeoutId);

    if (wpRes.ok) {
      const data = await wpRes.json();
      if (Array.isArray(data)) {
        const categories = [
          { id: 0, name: 'सबै', slug: 'all', count: 0 },
          ...data.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            count: c.count,
          })),
        ];
        return NextResponse.json({ categories });
      }
    }
  } catch (err) {
    console.warn('Could not fetch remote categories, returning default set:', err);
  }

  return NextResponse.json({ categories: DEFAULT_CATEGORIES });
}
