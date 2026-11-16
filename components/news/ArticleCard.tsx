/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { PostItem, Language } from '@/lib/types';
import { getTranslation } from '@/lib/localization';
import {
  Calendar,
  User,
  Bookmark,
  Share2,
  ExternalLink,
  WifiOff,
} from 'lucide-react';

interface Props {
  post: PostItem;
  lang: Language;
  isBookmarked: boolean;
  onOpen: (post: PostItem) => void;
  onToggleBookmark: (post: PostItem) => void;
  onShare: (post: PostItem) => void;
}

export default function ArticleCard({
  post,
  lang,
  isBookmarked,
  onOpen,
  onToggleBookmark,
  onShare,
}: Props) {
  const t = getTranslation(lang);

  const formattedDate = new Date(post.date).toLocaleDateString(
    lang === 'ne' ? 'ne-NP' : 'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  );

  return (
    <article
      onClick={() => onOpen(post)}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer flex flex-col group shadow-xs"
    >
      {/* Featured Image */}
      {post.featuredImageUrl ? (
        <div className="relative w-full h-44 sm:h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <img
            src={post.featuredImageUrl}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {post.isCached && (
            <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
              <WifiOff className="w-3 h-3 text-amber-400" />
              <span>{t.cachedBadge}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-24 bg-gradient-to-r from-emerald-800 to-teal-900 flex items-center justify-between px-4 text-white">
          <span className="text-xs font-semibold tracking-wide uppercase opacity-80">
            {post.categories[0]?.name || 'Madheshi News'}
          </span>
          {post.isCached && (
            <div className="bg-black/30 backdrop-blur-xs text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
              <WifiOff className="w-3 h-3 text-amber-400" />
              <span>{t.cachedBadge}</span>
            </div>
          )}
        </div>
      )}

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata (Zero-pill discipline §1.A) */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>{post.categories[0]?.name || 'समाचार'}</span>
            <span aria-hidden="true">·</span>
            <span>{formattedDate}</span>
          </div>

          <h3 className="text-base font-semibold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            {post.title}
          </h3>

          <p className="mt-2 text-xs md:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Card Footer: Author + Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 truncate max-w-[60%]">
            <User className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{post.authorName}</span>
          </div>

          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => onToggleBookmark(post)}
              aria-label={isBookmarked ? t.removeBookmark : t.bookmarkArticle}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => onShare(post)}
              aria-label={t.shareArticle}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
