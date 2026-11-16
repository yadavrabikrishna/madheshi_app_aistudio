'use client';

import React, { useState } from 'react';
import { Language, ThemeMode } from '@/lib/types';
import { getTranslation } from '@/lib/localization';
import {
  Globe,
  Sun,
  Moon,
  Trash2,
  Database,
  Info,
  CheckCircle2,
  Smartphone,
  Monitor,
} from 'lucide-react';

interface Props {
  lang: Language;
  theme: ThemeMode;
  cachedCount: number;
  bookmarkCount: number;
  isMobileFrame: boolean;
  onLanguageChange: (lang: Language) => void;
  onThemeChange: (theme: ThemeMode) => void;
  onToggleMobileFrame: (val: boolean) => void;
  onClearCache: () => void;
}

export default function SettingsTab({
  lang,
  theme,
  cachedCount,
  bookmarkCount,
  isMobileFrame,
  onLanguageChange,
  onThemeChange,
  onToggleMobileFrame,
  onClearCache,
}: Props) {
  const t = getTranslation(lang);
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleClear = () => {
    onClearCache();
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {t.settingsTitle}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {lang === 'ne' ? 'एपको भाषा, थिम र अफलाइन डाटा व्यवस्थापन' : 'Preferences, theme, and offline data controls'}
        </p>
      </div>

      {/* Language Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 space-y-3 shadow-xs">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {t.languageSection}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onLanguageChange('ne')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-medium border text-left transition-all ${
              lang === 'ne'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-semibold'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span className="block text-sm sm:text-base font-bold">नेपाली</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Nepali (नेपाली भाषा)</span>
          </button>

          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-medium border text-left transition-all ${
              lang === 'en'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-semibold'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span className="block text-sm sm:text-base font-bold">English</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">English (United States)</span>
          </button>
        </div>
      </section>

      {/* Theme Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 space-y-3 shadow-xs">
        <div className="flex items-center gap-2">
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-emerald-400" />
          ) : (
            <Sun className="w-4 h-4 text-emerald-600" />
          )}
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {t.themeSection}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onThemeChange('light')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-medium border flex items-center justify-between transition-all ${
              theme === 'light'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-semibold'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>{t.lightTheme}</span>
            </div>
            {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          </button>

          <button
            type="button"
            onClick={() => onThemeChange('dark')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-medium border flex items-center justify-between transition-all ${
              theme === 'dark'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-semibold'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>{t.darkTheme}</span>
            </div>
            {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          </button>
        </div>
      </section>

      {/* Screen View Mode Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              {lang === 'ne' ? 'स्क्रिन दृश्य शैली' : 'Screen Presentation Mode'}
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            {isMobileFrame ? '390px Phone Shell' : 'Fluid Responsive'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onToggleMobileFrame(true)}
            className={`py-2.5 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
              isMobileFrame
                ? 'bg-emerald-700 text-white border-emerald-700'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{t.mobileViewToggle}</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleMobileFrame(false)}
            className={`py-2.5 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
              !isMobileFrame
                ? 'bg-emerald-700 text-white border-emerald-700'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>{t.fullWidthViewToggle}</span>
          </button>
        </div>
      </section>

      {/* Offline Storage & Cache */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {t.storageSection}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <span className="text-slate-500 block mb-1">{t.cachedArticlesCount}</span>
            <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
              {cachedCount}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <span className="text-slate-500 block mb-1">{t.bookmarkedCount}</span>
            <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
              {bookmarkCount}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-950/30 text-slate-700 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 rounded-xl text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.clearCacheBtn}</span>
          </button>

          {clearedNotice && (
            <span className="text-xs text-emerald-600 font-medium">
              {t.cacheClearedSuccess}
            </span>
          )}
        </div>
      </section>

      {/* About Madheshi App */}
      <section className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {t.aboutSection}
          </h3>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {t.aboutDescription}
        </p>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Madheshi.com · Open REST API</span>
          <span>{t.version}</span>
        </div>
      </section>
    </div>
  );
}
