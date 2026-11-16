'use client';

import React, { useState } from 'react';
import {
  LandSystem,
  teraiUnitToSqFt,
  sqFtToTeraiAll,
  sqFtToTeraiCompound,
  teraiCompoundToSqFt,
  hillUnitToSqFt,
  sqFtToHillAll,
  sqFtToHillCompound,
  hillCompoundToSqFt,
  formatLandValue,
} from '@/lib/land-calculator';
import { Language } from '@/lib/types';
import { getTranslation } from '@/lib/localization';
import {
  Copy,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface Props {
  lang: Language;
}

export default function LandCalculator({ lang }: Props) {
  const t = getTranslation(lang);

  const [system, setSystem] = useState<LandSystem>('terai');
  const [calculatorMode, setCalculatorMode] = useState<'single' | 'compound'>('single');

  // Single unit state
  const [inputValue, setInputValue] = useState<string>('1');
  const [teraiUnit, setTeraiUnit] = useState<'bigha' | 'katha' | 'dhur' | 'sqFt' | 'sqMeter'>('bigha');
  const [hillUnit, setHillUnit] = useState<'ropani' | 'aana' | 'paisa' | 'daam' | 'sqFt' | 'sqMeter'>('ropani');

  // Compound Terai state
  const [bighaInput, setBighaInput] = useState<string>('1');
  const [kathaInput, setKathaInput] = useState<string>('5');
  const [dhurInput, setDhurInput] = useState<string>('10');

  // Compound Hill state
  const [ropaniInput, setRopaniInput] = useState<string>('1');
  const [aanaInput, setAanaInput] = useState<string>('4');
  const [paisaInput, setPaisaInput] = useState<string>('2');
  const [daamInput, setDaamInput] = useState<string>('1');

  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Computations
  let totalSqFt = 0;
  try {
    if (calculatorMode === 'single') {
      const val = parseFloat(inputValue);
      if (isNaN(val) || val < 0) {
        throw new Error(t.errorLandPositive);
      }
      if (system === 'terai') {
        totalSqFt = teraiUnitToSqFt(val, teraiUnit);
      } else {
        totalSqFt = hillUnitToSqFt(val, hillUnit);
      }
    } else {
      if (system === 'terai') {
        const b = parseFloat(bighaInput) || 0;
        const k = parseFloat(kathaInput) || 0;
        const d = parseFloat(dhurInput) || 0;
        if (b < 0 || k < 0 || d < 0) throw new Error(t.errorLandPositive);
        totalSqFt = teraiCompoundToSqFt(b, k, d);
      } else {
        const r = parseFloat(ropaniInput) || 0;
        const a = parseFloat(aanaInput) || 0;
        const p = parseFloat(paisaInput) || 0;
        const dm = parseFloat(daamInput) || 0;
        if (r < 0 || a < 0 || p < 0 || dm < 0) throw new Error(t.errorLandPositive);
        totalSqFt = hillCompoundToSqFt(r, a, p, dm);
      }
    }
  } catch (err: any) {
    if (!error) setError(err?.message || 'Invalid input');
  }

  const teraiAll = sqFtToTeraiAll(Math.max(0, totalSqFt));
  const hillAll = sqFtToHillAll(Math.max(0, totalSqFt));
  const teraiCompound = sqFtToTeraiCompound(Math.max(0, totalSqFt));
  const hillCompound = sqFtToHillCompound(Math.max(0, totalSqFt));

  const copyResult = () => {
    let summary = '';
    if (system === 'terai') {
      summary = `
Madheshi App - ${t.teraiSystem}
${t.bigha}: ${formatLandValue(teraiAll.bigha)}
${t.katha}: ${formatLandValue(teraiAll.katha)}
${t.dhur}: ${formatLandValue(teraiAll.dhur)}
${t.compoundTab}: ${teraiCompound.bigha} Bigha, ${teraiCompound.katha} Katha, ${formatLandValue(teraiCompound.dhur, 2)} Dhur
${t.sqFt}: ${formatLandValue(teraiAll.sqFt, 2)} sq ft
${t.sqMeter}: ${formatLandValue(teraiAll.sqMeter, 2)} m²
      `.trim();
    } else {
      summary = `
Madheshi App - ${t.hillSystem}
${t.ropani}: ${formatLandValue(hillAll.ropani)}
${t.aana}: ${formatLandValue(hillAll.aana)}
${t.paisa}: ${formatLandValue(hillAll.paisa)}
${t.daam}: ${formatLandValue(hillAll.daam)}
${t.compoundTab}: ${hillCompound.ropani} Ropani, ${hillCompound.aana} Aana, ${hillCompound.paisa} Paisa, ${formatLandValue(hillCompound.daam, 2)} Daam
${t.sqFt}: ${formatLandValue(hillAll.sqFt, 2)} sq ft
${t.sqMeter}: ${formatLandValue(hillAll.sqMeter, 2)} m²
      `.trim();
    }

    navigator.clipboard?.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* System Selector: Terai vs Hill */}
      <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-1">
        <button
          type="button"
          onClick={() => {
            setSystem('terai');
            setError(null);
          }}
          className={`flex-1 py-2.5 px-3 text-xs md:text-sm font-semibold rounded-lg transition-all ${
            system === 'terai'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {t.teraiSystem}
        </button>
        <button
          type="button"
          onClick={() => {
            setSystem('hill');
            setError(null);
          }}
          className={`flex-1 py-2.5 px-3 text-xs md:text-sm font-semibold rounded-lg transition-all ${
            system === 'hill'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {t.hillSystem}
        </button>
      </div>

      {/* Mode Selector: Single Unit vs Compound Breakdown */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg max-w-sm">
        <button
          type="button"
          onClick={() => setCalculatorMode('single')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors ${
            calculatorMode === 'single'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {t.singleUnitTab}
        </button>
        <button
          type="button"
          onClick={() => setCalculatorMode('compound')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors ${
            calculatorMode === 'compound'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {t.compoundTab}
        </button>
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 space-y-4 shadow-xs">
        {calculatorMode === 'single' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t.enterValue}
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError(null);
                }}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-base font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t.selectUnit}
              </label>
              {system === 'terai' ? (
                <select
                  value={teraiUnit}
                  onChange={(e) => setTeraiUnit(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                >
                  <option value="bigha">{t.bigha} (विघा)</option>
                  <option value="katha">{t.katha} (कट्ठा)</option>
                  <option value="dhur">{t.dhur} (धुर)</option>
                  <option value="sqFt">{t.sqFt}</option>
                  <option value="sqMeter">{t.sqMeter}</option>
                </select>
              ) : (
                <select
                  value={hillUnit}
                  onChange={(e) => setHillUnit(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                >
                  <option value="ropani">{t.ropani} (रोपनी)</option>
                  <option value="aana">{t.aana} (आना)</option>
                  <option value="paisa">{t.paisa} (पैसा)</option>
                  <option value="daam">{t.daam} (दाम)</option>
                  <option value="sqFt">{t.sqFt}</option>
                  <option value="sqMeter">{t.sqMeter}</option>
                </select>
              )}
            </div>
          </div>
        ) : (
          /* Compound input */
          <div>
            {system === 'terai' ? (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.bigha}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={bighaInput}
                    onChange={(e) => setBighaInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.katha}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={kathaInput}
                    onChange={(e) => setKathaInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.dhur}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={dhurInput}
                    onChange={(e) => setDhurInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm tabular-nums"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.ropani}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={ropaniInput}
                    onChange={(e) => setRopaniInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.aana}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={aanaInput}
                    onChange={(e) => setAanaInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.paisa}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={paisaInput}
                    onChange={(e) => setPaisaInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.daam}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={daamInput}
                    onChange={(e) => setDaamInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm tabular-nums"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results Display */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="text-base font-semibold text-slate-900 dark:text-white">
              {t.convertedEquivalents}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {system === 'terai' ? t.teraiSystem : t.hillSystem}
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

        {/* Compound Representation Banner */}
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl">
          <span className="text-xs text-emerald-800 dark:text-emerald-400 font-medium block mb-1">
            {t.compoundTab} ({system === 'terai' ? 'विघा - कट्ठा - धुर' : 'रोपनी - आना - पैसा - दाम'})
          </span>
          <span className="text-lg md:text-xl font-bold text-emerald-950 dark:text-emerald-200 tabular-nums">
            {system === 'terai' ? (
              `${teraiCompound.bigha} ${t.bigha} · ${teraiCompound.katha} ${t.katha} · ${formatLandValue(teraiCompound.dhur, 2)} ${t.dhur}`
            ) : (
              `${hillCompound.ropani} ${t.ropani} · ${hillCompound.aana} ${t.aana} · ${hillCompound.paisa} ${t.paisa} · ${formatLandValue(hillCompound.daam, 2)} ${t.daam}`
            )}
          </span>
        </div>

        {/* Unit Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {system === 'terai' ? (
            <>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">{t.bigha}</span>
                <span className="text-base md:text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatLandValue(teraiAll.bigha)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">{t.katha}</span>
                <span className="text-base md:text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatLandValue(teraiAll.katha)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">{t.dhur}</span>
                <span className="text-base md:text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatLandValue(teraiAll.dhur)}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">{t.ropani}</span>
                <span className="text-base md:text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatLandValue(hillAll.ropani)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">{t.aana}</span>
                <span className="text-base md:text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatLandValue(hillAll.aana)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">{t.paisa}</span>
                <span className="text-base md:text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatLandValue(hillAll.paisa)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">{t.daam}</span>
                <span className="text-base md:text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatLandValue(hillAll.daam)}
                </span>
              </div>
            </>
          )}

          {/* Metric & Imperial Standards */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">{t.sqFt}</span>
            <span className="text-base md:text-lg font-bold text-slate-900 dark:text-white tabular-nums">
              {formatLandValue(totalSqFt, 2)}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">{t.sqMeter}</span>
            <span className="text-base md:text-lg font-bold text-slate-900 dark:text-white tabular-nums">
              {formatLandValue(totalSqFt * 0.09290304, 2)}
            </span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-[11px] text-slate-500 dark:text-slate-400">
          {t.officialBaselineNotice}
        </div>
      </div>
    </div>
  );
}
