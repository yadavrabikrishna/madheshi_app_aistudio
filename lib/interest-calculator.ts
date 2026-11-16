/**
 * Pure domain implementation of Interest Calculator (CAL-001) for Madheshi App V1.
 * Supports Simple Interest (घरेलु ब्याज) and Compound Interest (साहु ब्याज).
 * Follows exact AD calendar anniversary counting, month-end clamping, partial-period
 * proration (remaining days / 30), annual compounding, and decimal round-half-up currency rounding.
 */

export interface InterestInput {
  principal: number;
  rateValue: number;
  rateMode: 'percent' | 'rupees_per_100'; // % per month or Rs. per 100 per month
  startDateStr: string; // YYYY-MM-DD
  endDateStr: string; // YYYY-MM-DD
  mode: 'simple' | 'compound';
}

export interface InterestResult {
  principal: number;
  monthlyRatePercent: number; // e.g. 2%
  nominalAnnualRatePercent: number; // e.g. 24%
  mode: 'simple' | 'compound';
  totalElapsedDays: number;
  completedMonths: number;
  remainingDays: number;
  totalTimeInMonths: number;
  // Compound-specific breakdown
  completedYears: number;
  remainingMonthsAfterYears: number;
  compoundedPrincipal: number;
  accruedIncompleteInterest: number;
  // Final outputs
  interest: number;
  totalAmount: number;
}

/**
 * Return the number of days in a specific Gregorian year & month (1-indexed month: 1=Jan, 12=Dec).
 */
export function getDaysInGregorianMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Decimal round-half-up to 2 decimal places for Nepalese Rupees.
 */
export function roundCurrency(val: number): number {
  if (!isFinite(val)) return 0;
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

/**
 * Calculate elapsed calendar period between two AD dates (start-exclusive, end-inclusive).
 * Anchors anniversaries to start day, clamping to the month's last day when necessary.
 */
export function calculateADElapsedPeriod(startDate: Date, endDate: Date): {
  totalDays: number;
  completedMonths: number;
  remainingDays: number;
  completedYears: number;
  remainingMonthsAfterYears: number;
} {
  const startY = startDate.getFullYear();
  const startM = startDate.getMonth() + 1; // 1-12
  const startD = startDate.getDate();

  // Total calendar days (end-inclusive, start-exclusive)
  const msPerDay = 1000 * 60 * 60 * 24;
  const utcStart = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const utcEnd = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  const totalDays = Math.max(0, Math.round((utcEnd - utcStart) / msPerDay));

  if (totalDays === 0) {
    return {
      totalDays: 0,
      completedMonths: 0,
      remainingDays: 0,
      completedYears: 0,
      remainingMonthsAfterYears: 0,
    };
  }

  // Iterate month by month to count completed calendar month anniversaries
  let completedMonths = 0;
  let lastAnniversaryDate = new Date(startY, startM - 1, startD);

  while (true) {
    const candidateMonthCount = completedMonths + 1;
    const targetTotalMonths = startM - 1 + candidateMonthCount;
    const targetYear = startY + Math.floor(targetTotalMonths / 12);
    const targetMonth = (targetTotalMonths % 12) + 1; // 1-12

    const maxDaysInTargetMonth = getDaysInGregorianMonth(targetYear, targetMonth);
    const targetDay = Math.min(startD, maxDaysInTargetMonth);

    const candidateAnniversary = new Date(targetYear, targetMonth - 1, targetDay);

    if (candidateAnniversary.getTime() <= endDate.getTime()) {
      completedMonths = candidateMonthCount;
      lastAnniversaryDate = candidateAnniversary;
    } else {
      break;
    }
  }

  // Remaining days after the last completed month anniversary
  const utcLastAnniv = Date.UTC(
    lastAnniversaryDate.getFullYear(),
    lastAnniversaryDate.getMonth(),
    lastAnniversaryDate.getDate()
  );
  const remainingDays = Math.max(0, Math.round((utcEnd - utcLastAnniv) / msPerDay));

  const completedYears = Math.floor(completedMonths / 12);
  const remainingMonthsAfterYears = completedMonths % 12;

  return {
    totalDays,
    completedMonths,
    remainingDays,
    completedYears,
    remainingMonthsAfterYears,
  };
}

/**
 * Perform Interest Calculation following CAL-001.
 */
export function calculateInterest(input: InterestInput): InterestResult {
  const { principal, rateValue, rateMode, startDateStr, endDateStr, mode } = input;

  if (principal < 0 || rateValue < 0) {
    throw new Error('Principal and rate must be non-negative.');
  }

  const [sY, sM, sD] = startDateStr.split('-').map(Number);
  const [eY, eM, eD] = endDateStr.split('-').map(Number);

  if (!sY || !sM || !sD || !eY || !eM || !eD) {
    throw new Error('Invalid date input format.');
  }

  const startDate = new Date(sY, sM - 1, sD);
  const endDate = new Date(eY, eM - 1, eD);

  if (endDate.getTime() < startDate.getTime()) {
    throw new Error('End date cannot be earlier than start date.');
  }

  // Rate normalization:
  // Rs. X per Rs. 100 per month = X% monthly
  const monthlyRatePercent = rateValue; // e.g. 2 for 2% or 2 Rs/100
  const monthlyRateDecimal = monthlyRatePercent / 100; // e.g. 0.02
  const nominalAnnualRatePercent = monthlyRatePercent * 12; // e.g. 24%

  const elapsed = calculateADElapsedPeriod(startDate, endDate);

  // Time in months with partial month proration (remaining days / 30)
  const totalTimeInMonths = elapsed.completedMonths + elapsed.remainingDays / 30;

  if (mode === 'simple') {
    // Simple Interest (घरेलु ब्याज)
    // Interest = Principal * monthlyRate * totalTimeInMonths
    const rawInterest = principal * monthlyRateDecimal * totalTimeInMonths;
    const rawTotal = principal + rawInterest;

    return {
      principal: roundCurrency(principal),
      monthlyRatePercent,
      nominalAnnualRatePercent,
      mode: 'simple',
      totalElapsedDays: elapsed.totalDays,
      completedMonths: elapsed.completedMonths,
      remainingDays: elapsed.remainingDays,
      totalTimeInMonths,
      completedYears: elapsed.completedYears,
      remainingMonthsAfterYears: elapsed.remainingMonthsAfterYears,
      compoundedPrincipal: roundCurrency(principal),
      accruedIncompleteInterest: roundCurrency(rawInterest),
      interest: roundCurrency(rawInterest),
      totalAmount: roundCurrency(rawTotal),
    };
  } else {
    // Compound Interest (साहु ब्याज)
    // Capitalize annually only after each completed 12-calendar-month anniversary!
    // Annual factor = (1 + monthlyRateDecimal * 12)
    const annualFactor = 1 + monthlyRateDecimal * 12;
    const rawCompoundedPrincipal = principal * Math.pow(annualFactor, elapsed.completedYears);

    // Incomplete period after the last completed 12-month anniversary:
    const incompleteTimeInMonths = elapsed.remainingMonthsAfterYears + elapsed.remainingDays / 30;
    const rawAccruedInterest = rawCompoundedPrincipal * monthlyRateDecimal * incompleteTimeInMonths;

    const rawTotal = rawCompoundedPrincipal + rawAccruedInterest;
    const rawTotalInterest = rawTotal - principal;

    return {
      principal: roundCurrency(principal),
      monthlyRatePercent,
      nominalAnnualRatePercent,
      mode: 'compound',
      totalElapsedDays: elapsed.totalDays,
      completedMonths: elapsed.completedMonths,
      remainingDays: elapsed.remainingDays,
      totalTimeInMonths,
      completedYears: elapsed.completedYears,
      remainingMonthsAfterYears: elapsed.remainingMonthsAfterYears,
      compoundedPrincipal: roundCurrency(rawCompoundedPrincipal),
      accruedIncompleteInterest: roundCurrency(rawAccruedInterest),
      interest: roundCurrency(rawTotalInterest),
      totalAmount: roundCurrency(rawTotal),
    };
  }
}
