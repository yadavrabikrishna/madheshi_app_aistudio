'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MainTab, CalculatorType, Language, ThemeMode, PostItem } from '@/lib/types';
import { getTranslation } from '@/lib/localization';
import {
  fetchNewsPosts,
  DEFAULT_CATEGORIES,
  getPostsFromLocalCache,
  getSavedBookmarks,
  toggleArticleBookmark,
  clearLocalNewsCache,
} from '@/lib/news-service';

import HomeTab from './tabs/HomeTab';
import NewsTab from './tabs/NewsTab';
import CalculatorsTab from './tabs/CalculatorsTab';
import SettingsTab from './tabs/SettingsTab';
import ArticleDetailModal from './news/ArticleDetailModal';

import {
  Home,
  Newspaper,
  Calculator,
  Settings,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  Check,
} from 'lucide-react';

export default function MobileShell() {
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('interest');

  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('madheshi_lang') as Language;
      if (saved === 'en' || saved === 'ne') return saved;
    }
    return 'ne';
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('madheshi_theme') as ThemeMode;
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'light';
  });

  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('madheshi_frame');
      if (saved !== null) return saved === 'true';
    }
    return true;
  });

  // News states
  const [posts, setPosts] = useState<PostItem[]>(() => {
    return getPostsFromLocalCache().length > 0
      ? getPostsFromLocalCache()
      : [];
  });
  const [bookmarks, setBookmarks] = useState<PostItem[]>(() => {
    return getSavedBookmarks();
  });
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isLoadingNews, setIsLoadingNews] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<PostItem | null>(null);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = getTranslation(lang);

  const loadNews = useCallback(async (catId: number, search: string) => {
    setIsLoadingNews(true);
    try {
      const res = await fetchNewsPosts({
        categoryId: catId,
        search,
      });
      setPosts(res.posts);
      setIsOffline(res.isOffline);
    } catch {
      setIsOffline(true);
    } finally {
      setIsLoadingNews(false);
    }
  }, []);

  // Sync theme with HTML root class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Initial news fetch
  useEffect(() => {
    let ignore = false;
    async function initFetch() {
      try {
        const res = await fetchNewsPosts({ categoryId: 0, search: '' });
        if (!ignore) {
          setPosts(res.posts);
          setIsOffline(res.isOffline);
        }
      } catch {
        if (!ignore) {
          setIsOffline(true);
        }
      }
    }
    initFetch();
    return () => {
      ignore = true;
    };
  }, []);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem('madheshi_theme', newTheme);
  };

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('madheshi_lang', newLang);
  };

  const handleToggleMobileFrame = (frameMode: boolean) => {
    setIsMobileFrame(frameMode);
    localStorage.setItem('madheshi_frame', frameMode ? 'true' : 'false');
  };

  const handleCategorySelect = (catId: number) => {
    setActiveCategory(catId);
    loadNews(catId, searchQuery);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    loadNews(activeCategory, q);
  };

  const handleToggleBookmark = (post: PostItem) => {
    toggleArticleBookmark(post);
    setBookmarks(getSavedBookmarks());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleShareArticle = async (post: PostItem) => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: post.link,
        });
        return;
      } catch {
        // User cancelled or share unhandled
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(post.link);
      showToast(t.linkCopied);
    }
  };

  const handleNavigateTab = (tab: MainTab, calc?: CalculatorType) => {
    setActiveTab(tab);
    if (calc) {
      setActiveCalculator(calc);
    }
    const container = document.getElementById('app-scroll-content');
    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearCache = () => {
    clearLocalNewsCache();
    loadNews(activeCategory, searchQuery);
  };

  return (
    <div className={`min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center font-sans antialiased ${isMobileFrame ? 'p-0 sm:p-4 md:p-6' : 'p-0'}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 z-50 bg-slate-900 text-white text-xs font-medium py-2 px-4 rounded-full shadow-lg flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container - either Mobile Device Frame or Responsive Full Width */}
      <div
        className={`w-full flex flex-col bg-slate-50 dark:bg-slate-900 transition-all duration-300 relative ${
          isMobileFrame
            ? 'max-w-[420px] h-[100dvh] sm:h-[844px] sm:rounded-[40px] sm:shadow-2xl sm:border-[8px] sm:border-slate-800 dark:sm:border-slate-800/90 overflow-hidden ring-1 ring-slate-900/10'
            : 'max-w-4xl min-h-screen shadow-xs'
        }`}
      >
        {/* Mobile Device Speaker Notch */}
        {isMobileFrame && (
          <div className="hidden sm:flex justify-center pt-2 pb-1 shrink-0 bg-white dark:bg-slate-900">
            <div className="w-24 h-4 bg-slate-900 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-700 ml-auto mr-2" />
            </div>
          </div>
        )}

        {/* Top App Bar */}
        <header className="h-14 px-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleNavigateTab('home')}
              className="text-left"
            >
              <span className="text-base font-extrabold tracking-tight text-emerald-800 dark:text-emerald-400">
                {t.appName}
              </span>
            </button>
          </div>

          {/* Quick Utility Actions */}
          <div className="flex items-center gap-1.5">
            {/* Language Quick Switcher */}
            <button
              type="button"
              onClick={() => handleLanguageChange(lang === 'ne' ? 'en' : 'ne')}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              title="Toggle Language"
            >
              {lang === 'ne' ? 'EN' : 'नेपाली'}
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => handleThemeChange(theme === 'light' ? 'dark' : 'light')}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Toggle Theme"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Frame / Desktop Mode Toggle */}
            <button
              type="button"
              onClick={() => handleToggleMobileFrame(!isMobileFrame)}
              className="hidden sm:flex p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title={isMobileFrame ? 'Expand to Desktop View' : 'Switch to Mobile Frame'}
            >
              {isMobileFrame ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </header>

        {/* Scrollable Main Content Area */}
        <main
          id="app-scroll-content"
          className="flex-1 overflow-y-auto px-4 py-4 md:px-5 overscroll-contain"
        >
          {activeTab === 'home' && (
            <HomeTab
              lang={lang}
              latestPosts={posts}
              bookmarks={bookmarks}
              onNavigateTab={handleNavigateTab}
              onOpenArticle={(post) => setSelectedArticle(post)}
              onToggleBookmark={handleToggleBookmark}
              onShareArticle={handleShareArticle}
            />
          )}

          {activeTab === 'news' && (
            <NewsTab
              lang={lang}
              posts={posts}
              categories={DEFAULT_CATEGORIES}
              bookmarks={bookmarks}
              isOffline={isOffline}
              isLoading={isLoadingNews}
              activeCategory={activeCategory}
              searchQuery={searchQuery}
              onSelectCategory={handleCategorySelect}
              onSearchChange={handleSearchChange}
              onRefresh={() => loadNews(activeCategory, searchQuery)}
              onOpenArticle={(post) => setSelectedArticle(post)}
              onToggleBookmark={handleToggleBookmark}
              onShareArticle={handleShareArticle}
            />
          )}

          {activeTab === 'calculators' && (
            <CalculatorsTab
              lang={lang}
              activeCalculator={activeCalculator}
              onChangeCalculator={(calc) => setActiveCalculator(calc)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              lang={lang}
              theme={theme}
              cachedCount={getPostsFromLocalCache().length}
              bookmarkCount={bookmarks.length}
              isMobileFrame={isMobileFrame}
              onLanguageChange={handleLanguageChange}
              onThemeChange={handleThemeChange}
              onToggleMobileFrame={handleToggleMobileFrame}
              onClearCache={handleClearCache}
            />
          )}
        </main>

        {/* Fixed Mobile Bottom Tab Navigation */}
        <nav
          className="h-16 px-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-4 items-center shrink-0 z-30"
          role="navigation"
          aria-label="App Navigation"
        >
          {/* Tab 1: Home */}
          <button
            type="button"
            onClick={() => handleNavigateTab('home')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              activeTab === 'home'
                ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] tracking-tight">{t.navHome}</span>
          </button>

          {/* Tab 2: News */}
          <button
            type="button"
            onClick={() => handleNavigateTab('news')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              activeTab === 'news'
                ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Newspaper className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] tracking-tight">{t.navNews}</span>
          </button>

          {/* Tab 3: Calculators */}
          <button
            type="button"
            onClick={() => handleNavigateTab('calculators')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              activeTab === 'calculators'
                ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calculator className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] tracking-tight">{t.navCalculators}</span>
          </button>

          {/* Tab 4: Settings */}
          <button
            type="button"
            onClick={() => handleNavigateTab('settings')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              activeTab === 'settings'
                ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] tracking-tight">{t.navSettings}</span>
          </button>
        </nav>
      </div>

      {/* Article Detail Full Modal */}
      <ArticleDetailModal
        post={selectedArticle}
        lang={lang}
        isBookmarked={selectedArticle ? bookmarks.some((b) => b.id === selectedArticle.id) : false}
        onClose={() => setSelectedArticle(null)}
        onToggleBookmark={handleToggleBookmark}
        onShare={handleShareArticle}
      />
    </div>
  );
}
