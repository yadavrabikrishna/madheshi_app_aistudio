/**
 * Pure domain implementation of Age Calculator (CAL-005) for Madheshi App V1.
 * Applies the approved simplified borrowing algorithm (fixed 30-day / 12-month)
 * uniformly for both AD (Gregorian) and BS (Bikram Sambat) inputs.
 */

export interface DateTuple {
  year: number;
  month: number; // 1-12
  day: number; // 1-31 (or 1-32 for BS)
}

export interface AgeCalculationResult {
  calendarSystem: 'AD' | 'BS';
  years: number;
  months: number;
  days: number;
  totalDaysApprox: number;
  isSameDate: boolean;
  approximateNotice?: string;
}

export const NEPALI_BS_MONTHS = [
  { id: 1, en: 'Baishakh', ne: 'वैशाख' },
  { id: 2, en: 'Jestha', ne: 'जेठ' },
  { id: 3, en: 'Ashadh', ne: 'असार' },
  { id: 4, en: 'Shrawan', ne: 'साउन' },
  { id: 5, en: 'Bhadra', ne: 'भदौ' },
  { id: 6, en: 'Ashwin', ne: 'असोज' },
  { id: 7, en: 'Kartik', ne: 'कात्तिक' },
  { id: 8, en: 'Mangsir', ne: 'मंसिर' },
  { id: 9, en: 'Poush', ne: 'पुस' },
  { id: 10, en: 'Magh', ne: 'माघ' },
  { id: 11, en: 'Falgun', ne: 'फागुन' },
  { id: 12, en: 'Chaitra', ne: 'चैत' },
];

/**
 * Standard fixed 30/12 borrowing subtraction algorithm:
 * 1. Subtract start-day from end-day.
 * 2. If day result < 0, add exactly 30 days and subtract 1 from month.
 * 3. Subtract start-month from end-month, including borrow.
 * 4. If month result < 0, add exactly 12 months and subtract 1 from year.
 * 5. Subtract start-year from end-year.
 */
export function calculateAge(
  startDate: DateTuple,
  endDate: DateTuple,
  calendarSystem: 'AD' | 'BS' = 'AD'
): AgeCalculationResult {
  // Validate basic range
  if (
    startDate.year <= 0 ||
    startDate.month < 1 ||
    startDate.month > 12 ||
    startDate.day < 1 ||
    startDate.day > 32
  ) {
    throw new Error('Invalid start date values.');
  }

  if (
    endDate.year <= 0 ||
    endDate.month < 1 ||
    endDate.month > 12 ||
    endDate.day < 1 ||
    endDate.day > 32
  ) {
    throw new Error('Invalid end date values.');
  }

  // Check chronological order
  if (
    endDate.year < startDate.year ||
    (endDate.year === startDate.year && endDate.month < startDate.month) ||
    (endDate.year === startDate.year && endDate.month === startDate.month && endDate.day < startDate.day)
  ) {
    throw new Error('End date cannot be earlier than birth date.');
  }

  // Exact same-day check
  if (
    endDate.year === startDate.year &&
    endDate.month === startDate.month &&
    endDate.day === startDate.day
  ) {
    return {
      calendarSystem,
      years: 0,
      months: 0,
      days: 0,
      totalDaysApprox: 0,
      isSameDate: true,
      approximateNotice:
        calendarSystem === 'BS'
          ? 'BS results are approximate because actual BS months vary between 29 to 32 days, using the standard 30-day/12-month rule.'
          : undefined,
    };
  }

  let dayDiff = endDate.day - startDate.day;
  let monthBorrow = 0;

  if (dayDiff < 0) {
    dayDiff += 30; // Approved fixed 30-day borrow
    monthBorrow = 1;
  }

  let monthDiff = endDate.month - startDate.month - monthBorrow;
  let yearBorrow = 0;

  if (monthDiff < 0) {
    monthDiff += 12; // Approved fixed 12-month borrow
    yearBorrow = 1;
  }

  const yearDiff = endDate.year - startDate.year - yearBorrow;

  const totalDaysApprox = yearDiff * 365 + monthDiff * 30 + dayDiff;

  return {
    calendarSystem,
    years: yearDiff,
    months: monthDiff,
    days: dayDiff,
    totalDaysApprox,
    isSameDate: false,
    approximateNotice:
      calendarSystem === 'BS'
        ? 'BS results are approximate because actual BS months vary between 29 to 32 days, using the standard 30-day/12-month rule.'
        : undefined,
  };
}
