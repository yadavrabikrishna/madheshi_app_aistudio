/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { PostItem, Language } from '@/lib/types';
import { getTranslation } from '@/lib/localization';
import {
  X,
  Share2,
  Bookmark,
  ExternalLink,
  Calendar,
  User,
  WifiOff,
} from 'lucide-react';

interface Props {
  post: PostItem | null;
  lang: Language;
  isBookmarked: boolean;
  onClose: () => void;
  onToggleBookmark: (post: PostItem) => void;
  onShare: (post: PostItem) => void;
}

export default function ArticleDetailModal({
  post,
  lang,
  isBookmarked,
  onClose,
  onToggleBookmark,
  onShare,
}: Props) {
  if (!post) return null;
  const t = getTranslation(lang);

  const formattedDate = new Date(post.date).toLocaleDateString(
    lang === 'ne' ? 'ne-NP' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl h-full sm:h-auto sm:max-h-[90vh] sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 shrink-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 -ml-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {post.categories[0]?.name || 'Madheshi.com'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onToggleBookmark(post)}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              aria-label={isBookmarked ? t.removeBookmark : t.bookmarkArticle}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => onShare(post)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label={t.shareArticle}
            >
              <Share2 className="w-4 h-4" />
            </button>

            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Open source article"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 md:p-6 space-y-4 flex-1">
          {/* Status Badge if Cached */}
          {post.isCached && (
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
              <WifiOff className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.offlineNotice}</span>
            </div>
          )}

          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            {post.title}
          </h1>

          {/* Unboxed Metadata */}
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {post.authorName}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
          </div>

          {/* Featured Image */}
          {post.featuredImageUrl && (
            <div className="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 max-h-72 w-full">
              <img
                src={post.featuredImageUrl}
                alt={post.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article HTML Content */}
          <div
            className="prose dark:prose-invert prose-slate max-w-none text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300 space-y-3"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Source Attribution */}
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{lang === 'ne' ? 'स्रोत: Madheshi.com' : 'Source: Madheshi.com'}</span>
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1"
            >
              <span>{lang === 'ne' ? 'Madheshi.com मा हेर्नुहोस्' : 'View on Madheshi.com'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
