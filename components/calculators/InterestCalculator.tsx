'use client';

import React, { useState } from 'react';
import {
  calculateInterest,
  InterestResult,
} from '@/lib/interest-calculator';
import { Language } from '@/lib/types';
import { getTranslation } from '@/lib/localization';
import {
  Calendar,
  Percent,
  CheckCircle2,
  Copy,
  RotateCcw,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface Props {
  lang: Language;
}

export default function InterestCalculator({ lang }: Props) {
  const t = getTranslation(lang);

  // Form states
  const [mode, setMode] = useState<'simple' | 'compound'>('simple');
  const [rateMode, setRateMode] = useState<'percent' | 'rupees_per_100'>('rupees_per_100');
  const [principal, setPrincipal] = useState<string>('100000');
  const [rateValue, setRateValue] = useState<string>('2'); // 2 Rs per 100 or 2%
  
  // Default to 1 year prior to today
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const formatDateInput = (d: Date) => d.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState<string>(formatDateInput(oneYearAgo));
  const [endDate, setEndDate] = useState<string>(formatDateInput(today));

  const [result, setResult] = useState<InterestResult | null>(() => {
    try {
      return calculateInterest({
        principal: 100000,
        rateValue: 2,
        rateMode: 'rupees_per_100',
        startDateStr: formatDateInput(oneYearAgo),
        endDateStr: formatDateInput(today),
        mode: 'simple',
      });
    } catch {
      return null;
    }
  });

  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const p = parseFloat(principal);
    const r = parseFloat(rateValue);

    if (isNaN(p) || p <= 0) {
      setError(t.errorPrincipal);
      return;
    }
    if (isNaN(r) || r < 0) {
      setError(t.errorRate);
      return;
    }
    if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
      setError(t.errorDates);
      return;
    }

    try {
      const res = calculateInterest({
        principal: p,
        rateValue: r,
        rateMode,
        startDateStr: startDate,
        endDateStr: endDate,
        mode,
      });
      setResult(res);
    } catch (err: any) {
      setError(err?.message || 'Error calculating interest');
    }
  };

  // Quick preset helpers
  const applyPresetPeriod = (months: number) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(start.getMonth() + months);
    setEndDate(formatDateInput(end));
    setTimeout(() => handleCalculate(), 50);
  };

  const copyResult = () => {
    if (!result) return;
    const text = `
Madheshi App - ${mode === 'simple' ? t.simpleInterestMode : t.compoundInterestMode}
${t.principalAmount}: Rs. ${result.principal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
${t.rateLabel}: ${result.monthlyRatePercent}% / mo (${t.nominalAnnualRate}: ${result.nominalAnnualRatePercent}%)
${t.startDate}: ${startDate}
${t.endDate}: ${endDate}
${t.durationSummary}: ${result.completedMonths} months, ${result.remainingDays} days (${result.totalElapsedDays} days)
${mode === 'compound' ? `${t.compoundingCycles}: ${result.completedYears} yr(s)\n${t.compoundedPrincipal}: Rs. ${result.compoundedPrincipal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n` : ''}
${t.totalInterest}: Rs. ${result.interest.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
${t.totalPayable}: Rs. ${result.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
    `.trim();

    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Mode Selector - Functional segmented control */}
      <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-1">
        <button
          type="button"
          onClick={() => {
            setMode('simple');
            setTimeout(() => handleCalculate(), 20);
          }}
          className={`flex-1 py-2.5 px-3 text-xs md:text-sm font-semibold rounded-lg transition-all ${
            mode === 'simple'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {t.simpleInterestMode}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('compound');
            setTimeout(() => handleCalculate(), 20);
          }}
          className={`flex-1 py-2.5 px-3 text-xs md:text-sm font-semibold rounded-lg transition-all ${
            mode === 'compound'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {t.compoundInterestMode}
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleCalculate} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 space-y-4 shadow-xs">
        {/* Principal Input */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            {t.principalAmount}
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
              Rs.
            </span>
            <input
              type="number"
              step="any"
              min="0"
              required
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="100000"
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-base font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 tabular-nums"
            />
          </div>
        </div>

        {/* Rate & Rate Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">
                {t.rateLabel}
              </label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {rateMode === 'percent' ? t.rateModeHintPercent : t.rateModeHintRupees}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0"
                required
                value={rateValue}
                onChange={(e) => setRateValue(e.target.value)}
                placeholder="2"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-base font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 tabular-nums"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                {rateMode === 'percent' ? '% / mo' : 'Rs/100'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {lang === 'ne' ? 'दर प्रविष्टि ढाँचा' : 'Rate Entry Format'}
            </label>
            <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-1 h-[44px]">
              <button
                type="button"
                onClick={() => setRateMode('rupees_per_100')}
                className={`flex-1 h-full text-xs font-medium rounded-lg transition-colors ${
                  rateMode === 'rupees_per_100'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {t.rateModeRupees}
              </button>
              <button
                type="button"
                onClick={() => setRateMode('percent')}
                className={`flex-1 h-full text-xs font-medium rounded-lg transition-colors ${
                  rateMode === 'percent'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {t.rateModePercent}
              </button>
            </div>
          </div>
        </div>

        {/* Date Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {t.startDate}
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">
                {t.endDate}
              </label>
              <button
                type="button"
                onClick={() => setEndDate(formatDateInput(new Date()))}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {t.setToday}
              </button>
            </div>
            <div className="relative">
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Quick Period Presets */}
        <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
          <span className="text-slate-500 dark:text-slate-400">{lang === 'ne' ? 'द्रुत अवधि:' : 'Quick Presets:'}</span>
          <button
            type="button"
            onClick={() => applyPresetPeriod(6)}
            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md transition-colors"
          >
            6 {lang === 'ne' ? 'महिना' : 'Months'}
          </button>
          <button
            type="button"
            onClick={() => applyPresetPeriod(12)}
            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md transition-colors"
          >
            1 {lang === 'ne' ? 'वर्ष' : 'Year'}
          </button>
          <button
            type="button"
            onClick={() => applyPresetPeriod(24)}
            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md transition-colors"
          >
            2 {lang === 'ne' ? 'वर्ष' : 'Years'}
          </button>
          <button
            type="button"
            onClick={() => applyPresetPeriod(36)}
            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md transition-colors"
          >
            3 {lang === 'ne' ? 'वर्ष' : 'Years'}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm rounded-xl shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          {t.calculateBtn}
        </button>
      </form>

      {/* Results Display */}
      {result && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                {t.resultsSummary}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {mode === 'simple' ? t.simpleInterestMode : t.compoundInterestMode} · {result.monthlyRatePercent}% / mo ({result.nominalAnnualRatePercent}% nominal/yr)
              </p>
            </div>
            <button
              type="button"
              onClick={copyResult}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'ne' ? 'प्रतिलिपि भयो' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{lang === 'ne' ? 'प्रतिलिपि' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>

          {/* Primary Metric Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                {t.principalAmount}
              </span>
              <span className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                Rs. {result.principal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-xs text-emerald-800 dark:text-emerald-400 font-medium block mb-1">
                {t.totalInterest}
              </span>
              <span className="text-lg md:text-xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                Rs. {result.interest.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="p-3.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl">
              <span className="text-xs text-slate-300 block mb-1">
                {t.totalPayable}
              </span>
              <span className="text-lg md:text-xl font-bold text-white tabular-nums">
                Rs. {result.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Detailed Breakdown List */}
          <div className="pt-2 divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
            <div className="py-2.5 flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span>{t.durationSummary}</span>
              <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                {result.completedMonths} {lang === 'ne' ? 'महिना' : 'months'}, {result.remainingDays} {lang === 'ne' ? 'दिन' : 'days'} ({result.totalElapsedDays} {lang === 'ne' ? 'कुल दिन' : 'total days'})
              </span>
            </div>

            {mode === 'compound' && (
              <>
                <div className="py-2.5 flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>{t.compoundingCycles}</span>
                  <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                    {result.completedYears} {lang === 'ne' ? 'वार्षिक चक्र (१२ महिना)' : 'annual cycles (12 mo)'}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>{t.compoundedPrincipal}</span>
                  <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                    Rs. {result.compoundedPrincipal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>{lang === 'ne' ? 'बाँकी अवधिको ब्याज' : 'Incomplete Period Interest'}</span>
                  <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                    Rs. {result.accruedIncompleteInterest.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </>
            )}

            <div className="py-2.5 flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span>{t.nominalAnnualRate}</span>
              <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                {result.nominalAnnualRatePercent}% {lang === 'ne' ? 'सालाना' : 'per annum'}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-[11px] text-slate-500 dark:text-slate-400">
            {t.adDateNotice}
          </div>
        </div>
      )}
    </div>
  );
}
