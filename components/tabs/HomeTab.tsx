'use client';

import React from 'react';
import { PostItem, Language, MainTab, CalculatorType } from '@/lib/types';
import { getTranslation } from '@/lib/localization';
import ArticleCard from '../news/ArticleCard';
import {
  Coins,
  CalendarDays,
  Compass,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

interface Props {
  lang: Language;
  latestPosts: PostItem[];
  bookmarks: PostItem[];
  onNavigateTab: (tab: MainTab, calculator?: CalculatorType) => void;
  onOpenArticle: (post: PostItem) => void;
  onToggleBookmark: (post: PostItem) => void;
  onShareArticle: (post: PostItem) => void;
}

export default function HomeTab({
  lang,
  latestPosts,
  bookmarks,
  onNavigateTab,
  onOpenArticle,
  onToggleBookmark,
  onShareArticle,
}: Props) {
  const t = getTranslation(lang);

  return (
    <div className="space-y-6 pb-6">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-3xl p-5 md:p-8 shadow-sm relative overflow-hidden">
        {/* Subtle decorative geometry */}
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-56 h-56 rounded-full bg-emerald-700/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>{lang === 'ne' ? 'आधिकारिक संस्करण १.०' : 'Official Release V1'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            {t.welcomeTitle}
          </h1>

          <p className="mt-2 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            {t.welcomeSubtitle}
          </p>

          <div className="mt-5 flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => onNavigateTab('calculators', 'interest')}
              className="py-2.5 px-4 bg-white text-emerald-950 font-semibold text-xs sm:text-sm rounded-xl shadow-xs hover:bg-emerald-50 active:scale-[0.98] transition-all flex items-center gap-1.5"
            >
              <span>{t.interestTitle}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('news')}
              className="py-2.5 px-4 bg-emerald-800/80 hover:bg-emerald-700/80 border border-emerald-600/40 text-white font-medium text-xs sm:text-sm rounded-xl active:scale-[0.98] transition-all"
            >
              {t.viewAllNews}
            </button>
          </div>
        </div>
      </section>

      {/* Quick Calculator Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {t.quickTools}
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'ne' ? '१००% अफलाइन उपलब्ध' : '100% Offline Ready'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1: Interest */}
          <div
            onClick={() => onNavigateTab('calculators', 'interest')}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-emerald-500/50 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                {t.interestTitle}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {lang === 'ne' ? 'घरेलु र साहु ब्याज (साधारण र चक्रवृद्धि)' : 'Simple & Compound interest with AD month clamping'}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span>{t.viewCalculator}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: Age */}
          <div
            onClick={() => onNavigateTab('calculators', 'age')}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-emerald-500/50 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <CalendarDays className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                {t.ageTitle}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {lang === 'ne' ? 'ई.सं. (AD) र वि.सं. (BS) उमेर गणना (३०/१२ सापटी नियम)' : 'Official 30-day/12-month borrowing for AD & BS dates'}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-teal-700 dark:text-teal-400">
              <span>{t.viewCalculator}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 3: Land */}
          <div
            onClick={() => onNavigateTab('calculators', 'land')}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-emerald-500/50 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
                {t.landTitle}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {lang === 'ne' ? 'तराई (विघा-कट्ठा-धुर) र पहाडी (रोपनी-आना) नाप' : 'Terai Bigha & Hill Ropani conversion baseline'}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-cyan-700 dark:text-cyan-400">
              <span>{t.viewCalculator}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Feed Preview */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {t.latestNewsHeader}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'ne' ? 'Madheshi.com को ताजा समाचार सामग्री' : 'Direct from Madheshi.com WordPress API'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('news')}
            className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>{t.viewAllNews}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {latestPosts.slice(0, 3).map((post) => (
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
      </section>
    </div>
  );
}
