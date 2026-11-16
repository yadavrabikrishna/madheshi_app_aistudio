/**
 * Pure domain implementation of Land Calculator (CAL-004) for Madheshi App V1.
 * Standardized on official Government of Nepal square-foot conversion factors.
 * Terai and Hill families are grouped separately with exact canonical constants.
 */

export type LandSystem = 'terai' | 'hill';

export interface TeraiUnits {
  bigha: number;
  katha: number;
  dhur: number;
  sqFt: number;
  sqMeter: number;
}

export interface HillUnits {
  ropani: number;
  aana: number;
  paisa: number;
  daam: number;
  sqFt: number;
  sqMeter: number;
}

// Canonical Constants (Exact Square Feet)
export const SQFT_PER_SQM = 1 / 0.09290304;
export const SQM_PER_SQFT = 0.09290304;

// Terai Family Factors
export const TERAI_FACTORS = {
  bigha: 72900,
  katha: 3645,
  dhur: 182.25,
} as const;

// Hill Family Factors
export const HILL_FACTORS = {
  ropani: 5476,
  aana: 342.25,
  paisa: 85.5625,
  daam: 21.390625,
} as const;

/**
 * Format land numbers to maximum 4 decimal places using round-half-up,
 * trimming redundant trailing zeros.
 */
export function formatLandValue(val: number, maxDecimals: number = 4): string {
  if (!isFinite(val) || isNaN(val)) return '0';
  if (val === 0) return '0';

  const factor = Math.pow(10, maxDecimals);
  const rounded = Math.round((val + Number.EPSILON) * factor) / factor;

  // Format and strip trailing zeroes
  const str = rounded.toFixed(maxDecimals);
  return str.replace(/\.?0+$/, '');
}

/**
 * Convert any single Terai unit into total square feet.
 */
export function teraiUnitToSqFt(value: number, unit: keyof typeof TERAI_FACTORS | 'sqFt' | 'sqMeter'): number {
  if (value < 0) throw new Error('Land area cannot be negative.');
  if (unit === 'sqFt') return value;
  if (unit === 'sqMeter') return value / SQM_PER_SQFT;
  return value * TERAI_FACTORS[unit];
}

/**
 * Convert total square feet into all Terai individual equivalents.
 */
export function sqFtToTeraiAll(sqFt: number): TeraiUnits {
  if (sqFt < 0) throw new Error('Land area cannot be negative.');
  return {
    bigha: sqFt / TERAI_FACTORS.bigha,
    katha: sqFt / TERAI_FACTORS.katha,
    dhur: sqFt / TERAI_FACTORS.dhur,
    sqFt,
    sqMeter: sqFt * SQM_PER_SQFT,
  };
}

/**
 * Compound Terai decomposition: Bigha - Katha - Dhur
 */
export function sqFtToTeraiCompound(sqFt: number): {
  bigha: number;
  katha: number;
  dhur: number;
} {
  if (sqFt < 0) throw new Error('Land area cannot be negative.');
  const bigha = Math.floor(sqFt / TERAI_FACTORS.bigha);
  const rem1 = sqFt - bigha * TERAI_FACTORS.bigha;

  const katha = Math.floor(rem1 / TERAI_FACTORS.katha);
  const rem2 = rem1 - katha * TERAI_FACTORS.katha;

  const dhur = rem2 / TERAI_FACTORS.dhur;

  return { bigha, katha, dhur };
}

/**
 * Recombine Terai compound values (Bigha, Katha, Dhur) into total square feet.
 */
export function teraiCompoundToSqFt(bigha: number, katha: number, dhur: number): number {
  return (
    Math.max(0, bigha) * TERAI_FACTORS.bigha +
    Math.max(0, katha) * TERAI_FACTORS.katha +
    Math.max(0, dhur) * TERAI_FACTORS.dhur
  );
}

/**
 * Convert any single Hill unit into total square feet.
 */
export function hillUnitToSqFt(value: number, unit: keyof typeof HILL_FACTORS | 'sqFt' | 'sqMeter'): number {
  if (value < 0) throw new Error('Land area cannot be negative.');
  if (unit === 'sqFt') return value;
  if (unit === 'sqMeter') return value / SQM_PER_SQFT;
  return value * HILL_FACTORS[unit];
}

/**
 * Convert total square feet into all Hill individual equivalents.
 */
export function sqFtToHillAll(sqFt: number): HillUnits {
  if (sqFt < 0) throw new Error('Land area cannot be negative.');
  return {
    ropani: sqFt / HILL_FACTORS.ropani,
    aana: sqFt / HILL_FACTORS.aana,
    paisa: sqFt / HILL_FACTORS.paisa,
    daam: sqFt / HILL_FACTORS.daam,
    sqFt,
    sqMeter: sqFt * SQM_PER_SQFT,
  };
}

/**
 * Compound Hill decomposition: Ropani - Aana - Paisa - Daam
 */
export function sqFtToHillCompound(sqFt: number): {
  ropani: number;
  aana: number;
  paisa: number;
  daam: number;
} {
  if (sqFt < 0) throw new Error('Land area cannot be negative.');
  const ropani = Math.floor(sqFt / HILL_FACTORS.ropani);
  const rem1 = sqFt - ropani * HILL_FACTORS.ropani;

  const aana = Math.floor(rem1 / HILL_FACTORS.aana);
  const rem2 = rem1 - aana * HILL_FACTORS.aana;

  const paisa = Math.floor(rem2 / HILL_FACTORS.paisa);
  const rem3 = rem2 - paisa * HILL_FACTORS.paisa;

  const daam = rem3 / HILL_FACTORS.daam;

  return { ropani, aana, paisa, daam };
}

/**
 * Recombine Hill compound values (Ropani, Aana, Paisa, Daam) into total square feet.
 */
export function hillCompoundToSqFt(ropani: number, aana: number, paisa: number, daam: number): number {
  return (
    Math.max(0, ropani) * HILL_FACTORS.ropani +
    Math.max(0, aana) * HILL_FACTORS.aana +
    Math.max(0, paisa) * HILL_FACTORS.paisa +
    Math.max(0, daam) * HILL_FACTORS.daam
  );
}
