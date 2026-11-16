'use client';

import React from 'react';
import { CalculatorType, Language } from '@/lib/types';
import { getTranslation } from '@/lib/localization';
import InterestCalculator from '../calculators/InterestCalculator';
import AgeCalculator from '../calculators/AgeCalculator';
import LandCalculator from '../calculators/LandCalculator';
import { Coins, CalendarDays, Compass } from 'lucide-react';

interface Props {
  lang: Language;
  activeCalculator: CalculatorType;
  onChangeCalculator: (calc: CalculatorType) => void;
}

export default function CalculatorsTab({
  lang,
  activeCalculator,
  onChangeCalculator,
}: Props) {
  const t = getTranslation(lang);

  return (
    <div className="space-y-5 pb-6">
      {/* 3-way Segmented Calculator Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-2xl flex items-center gap-1 shadow-xs">
        <button
          type="button"
          onClick={() => onChangeCalculator('interest')}
          className={`flex-1 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeCalculator === 'interest'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Coins className="w-4 h-4 shrink-0" />
          <span className="truncate">{t.interestTitle}</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeCalculator('age')}
          className={`flex-1 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeCalculator === 'age'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CalendarDays className="w-4 h-4 shrink-0" />
          <span className="truncate">{t.ageTitle}</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeCalculator('land')}
          className={`flex-1 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeCalculator === 'land'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4 shrink-0" />
          <span className="truncate">{t.landTitle}</span>
        </button>
      </div>

      {/* Render Active Sub-Calculator */}
      <div>
        {activeCalculator === 'interest' && <InterestCalculator lang={lang} />}
        {activeCalculator === 'age' && <AgeCalculator lang={lang} />}
        {activeCalculator === 'land' && <LandCalculator lang={lang} />}
      </div>
    </div>
  );
}
