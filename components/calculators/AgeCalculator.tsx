'use client';

import React, { useState } from 'react';
import {
  calculateAge,
  AgeCalculationResult,
  NEPALI_BS_MONTHS,
  DateTuple,
} from '@/lib/age-calculator';
import { Language } from '@/lib/types';
import { getTranslation } from '@/lib/localization';
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Info,
} from 'lucide-react';

interface Props {
  lang: Language;
}

export default function AgeCalculator({ lang }: Props) {
  const t = getTranslation(lang);

  const [calendarSystem, setCalendarSystem] = useState<'AD' | 'BS'>('AD');

  // AD Dates
  const today = new Date();
  const defaultBirthAD = new Date(1998, 0, 15);
  const formatDateInput = (d: Date) => d.toISOString().split('T')[0];

  const [startAD, setStartAD] = useState<string>(formatDateInput(defaultBirthAD));
  const [endAD, setEndAD] = useState<string>(formatDateInput(today));

  // BS Dates (e.g. 2055-10-02)
  const [startBS, setStartBS] = useState<DateTuple>({ year: 2055, month: 10, day: 2 });
  const [endBS, setEndBS] = useState<DateTuple>({ year: 2083, month: 7, day: 23 });

  const [result, setResult] = useState<AgeCalculationResult | null>(() => {
    try {
      const [sY, sM, sD] = formatDateInput(defaultBirthAD).split('-').map(Number);
      const [eY, eM, eD] = formatDateInput(today).split('-').map(Number);
      return calculateAge(
        { year: sY, month: sM, day: sD },
        { year: eY, month: eM, day: eD },
        'AD'
      );
    } catch {
      return null;
    }
  });

  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    try {
      if (calendarSystem === 'AD') {
        const [sY, sM, sD] = startAD.split('-').map(Number);
        const [eY, eM, eD] = endAD.split('-').map(Number);
        const res = calculateAge(
          { year: sY, month: sM, day: sD },
          { year: eY, month: eM, day: eD },
          'AD'
        );
        setResult(res);
      } else {
        const res = calculateAge(startBS, endBS, 'BS');
        setResult(res);
      }
    } catch (err: any) {
      setError(err?.message || 'Error calculating age');
    }
  };

  const copyResult = () => {
    if (!result) return;
    const text = `
Madheshi App - ${t.ageTitle} (${calendarSystem})
${t.ageResult}: ${result.years} ${t.yearsLabel}, ${result.months} ${t.monthsLabel}, ${result.days} ${t.daysLabel}
${t.totalDaysApprox}: ~${result.totalDaysApprox} ${t.daysLabel}
    `.trim();

    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Calendar System Switcher */}
      <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-1">
        <button
          type="button"
          onClick={() => {
            setCalendarSystem('AD');
            setTimeout(() => handleCalculate(), 20);
          }}
          className={`flex-1 py-2.5 px-3 text-xs md:text-sm font-semibold rounded-lg transition-all ${
            calendarSystem === 'AD'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {t.adSystem}
        </button>
        <button
          type="button"
          onClick={() => {
            setCalendarSystem('BS');
            setTimeout(() => handleCalculate(), 20);
          }}
          className={`flex-1 py-2.5 px-3 text-xs md:text-sm font-semibold rounded-lg transition-all ${
            calendarSystem === 'BS'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {t.bsSystem}
        </button>
      </div>

      {/* Date Input Card */}
      <form onSubmit={handleCalculate} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 space-y-4 shadow-xs">
        {calendarSystem === 'AD' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t.birthDate}
              </label>
              <input
                type="date"
                required
                value={startAD}
                onChange={(e) => setStartAD(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.targetDate}
                </label>
                <button
                  type="button"
                  onClick={() => setEndAD(formatDateInput(new Date()))}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {t.setToday}
                </button>
              </div>
              <input
                type="date"
                required
                value={endAD}
                onChange={(e) => setEndAD(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Start BS Date */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t.birthDate} (वि.सं.)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">{t.yearsLabel}</label>
                  <input
                    type="number"
                    min="1900"
                    max="2150"
                    value={startBS.year}
                    onChange={(e) => setStartBS({ ...startBS, year: parseInt(e.target.value, 10) || 2050 })}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">{t.monthsLabel}</label>
                  <select
                    value={startBS.month}
                    onChange={(e) => setStartBS({ ...startBS, month: parseInt(e.target.value, 10) })}
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                  >
                    {NEPALI_BS_MONTHS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {lang === 'ne' ? m.ne : m.en} ({m.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">{t.daysLabel}</label>
                  <input
                    type="number"
                    min="1"
                    max="32"
                    value={startBS.day}
                    onChange={(e) => setStartBS({ ...startBS, day: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm tabular-nums"
                  />
                </div>
              </div>
            </div>

            {/* End BS Date */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.targetDate} (वि.सं.)
                </label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">{t.yearsLabel}</label>
                  <input
                    type="number"
                    min="1900"
                    max="2150"
                    value={endBS.year}
                    onChange={(e) => setEndBS({ ...endBS, year: parseInt(e.target.value, 10) || 2083 })}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">{t.monthsLabel}</label>
                  <select
                    value={endBS.month}
                    onChange={(e) => setEndBS({ ...endBS, month: parseInt(e.target.value, 10) })}
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                  >
                    {NEPALI_BS_MONTHS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {lang === 'ne' ? m.ne : m.en} ({m.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">{t.daysLabel}</label>
                  <input
                    type="number"
                    min="1"
                    max="32"
                    value={endBS.day}
                    onChange={(e) => setEndBS({ ...endBS, day: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm tabular-nums"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

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
          {t.calculateAgeBtn}
        </button>
      </form>

      {/* Results Card */}
      {result && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                {t.ageResult}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {calendarSystem === 'BS' ? t.bsSystem : t.adSystem} · 30-Day/12-Month Rule
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

          {/* 3 Metric Card Grid */}
          <div className="grid grid-cols-3 gap-2.5 md:gap-4">
            <div className="p-3 md:p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center border border-slate-100 dark:border-slate-800">
              <span className="block text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {result.years}
              </span>
              <span className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 block">
                {t.yearsLabel}
              </span>
            </div>

            <div className="p-3 md:p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center border border-slate-100 dark:border-slate-800">
              <span className="block text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {result.months}
              </span>
              <span className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 block">
                {t.monthsLabel}
              </span>
            </div>

            <div className="p-3 md:p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center border border-slate-100 dark:border-slate-800">
              <span className="block text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {result.days}
              </span>
              <span className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 block">
                {t.daysLabel}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>{t.totalDaysApprox}</span>
            <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
              ~{result.totalDaysApprox.toLocaleString()} {t.daysLabel}
            </span>
          </div>

          {/* BS Approximate notice */}
          {result.approximateNotice && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
              <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>{t.bsAccuracyNotice}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
