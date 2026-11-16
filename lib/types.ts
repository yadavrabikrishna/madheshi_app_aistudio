export type Language = 'en' | 'ne';
export type ThemeMode = 'light' | 'dark';

export type MainTab = 'home' | 'news' | 'calculators' | 'settings';
export type CalculatorType = 'interest' | 'age' | 'land';

export interface PostItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  link: string;
  authorName: string;
  featuredImageUrl?: string;
  categories: { id: number; name: string }[];
  isCached?: boolean;
}

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  count: number;
}
