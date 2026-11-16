'use client';

import React, { useState } from 'react';
import { PostItem, CategoryItem, Language } from '@/lib/types';
import { getTranslation } from '@/lib/localization';
import ArticleCard from '../news/ArticleCard';
import {
  Search,
  RotateCw,
  Bookmark,
  WifiOff,
  Filter,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  lang: Language;
  posts: PostItem[];
  categories: CategoryItem[];
  bookmarks: PostItem[];
  isOffline: boolean;
  isLoading: boolean;
  activeCategory: number;
  searchQuery: string;
  onSelectCategory: (id: number) => void;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  onOpenArticle: (post: PostItem) => void;
  onToggleBookmark: (post: PostItem) => void;
  onShareArticle: (post: PostItem) => void;
}

export default function NewsTab({
  lang,
  posts,
  categories,
  bookmarks,
  isOffline,
  isLoading,
  activeCategory,
  searchQuery,
  onSelectCategory,
  onSearchChange,
  onRefresh,
  onOpenArticle,
  onToggleBookmark,
  onShareArticle,
}: Props) {
  const t = getTranslation(lang);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Filter posts if showBookmarksOnly is enabled
  const displayedPosts = showBookmarksOnly
    ? bookmarks
    : posts;

  return (
    <div className="space-y-4 pb-6">
      {/* Search & Actions Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.newsSearchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            aria-label={t.refreshNews}
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              showBookmarksOnly
                ? 'bg-emerald-700 border-emerald-700 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showBookmarksOnly ? 'fill-current' : ''}`} />
            <span>{bookmarks.length}</span>
          </button>
        </div>

        {/* Offline Warning Banner */}
        {isOffline && !showBookmarksOnly && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{t.offlineNotice}</span>
            </div>
            <button
              type="button"
              onClick={onRefresh}
              className="font-medium underline hover:text-amber-900 shrink-0"
            >
              {t.refreshNews}
            </button>
          </div>
        )}

        {/* Category Filter Horizontal Scroll */}
        {!showBookmarksOnly && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bookmarks Header if active */}
      {showBookmarksOnly && (
        <div className="flex items-center justify-between pb-1">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            {t.savedBookmarks} ({bookmarks.length})
          </h2>
          <button
            type="button"
            onClick={() => setShowBookmarksOnly(false)}
            className="text-xs text-emerald-700 dark:text-emerald-400 font-medium hover:underline"
          >
            {t.allCategories}
          </button>
        </div>
      )}

      {/* Articles Grid */}
      {displayedPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayedPosts.map((post) => (
            <ArticleCard
              key={post.id}
              post={post}
              lang={lang}
              isBookmarked={bookmarks.some((b) => b.id === post.id)}
              onOpen={onOpenArticle}
              onToggleBookmark={onToggleBookmark}
              onShare={onShareArticle}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {showBookmarksOnly
              ? lang === 'ne' ? 'कुनै सुरक्षित समाचार छैन।' : 'No saved bookmarks yet.'
              : t.noArticlesFound}
          </p>
          <button
            type="button"
            onClick={onRefresh}
            className="mt-3 text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
          >
            {t.refreshNews}
          </button>
        </div>
      )}
    </div>
  );
}
