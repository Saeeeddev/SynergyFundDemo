// NUMERAL SYSTEM DECISION (T0.9, DESIGN.md §3.3):
// This app uses PERSIAN digits (۰۱۲۳۴۵۶۷۸۹) for all UI display values.
// Latin digits are only used inside charts for technical axis labels
// where tabular alignment is critical (Highcharts handles that separately).
// This decision is applied app-wide — do not mix numeral systems.

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const PERSIAN_THOUSANDS_SEP = "٬";

// Convert a Latin digit string to Persian digits.
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

// Format a number with Persian thousands separator.
// e.g. 1200000 → "۱٬۲۰۰٬۰۰۰"
export function formatNumber(value: number, decimals = 0): string {
  const parts = value.toFixed(decimals).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, PERSIAN_THOUSANDS_SEP);
  const joined = parts.join(".");
  return toPersianDigits(joined);
}

// Format a percentage. e.g. 8.2 → "+۸٫۲٪" or "-۳٫۱٪"
export function formatPercent(value: number, decimals = 1): string {
  const sign = value >= 0 ? "+" : "";
  const formatted = value.toFixed(decimals).replace(".", "٫"); // Persian decimal separator
  return bidiIsolate(`${sign}${toPersianDigits(formatted)}٪`);
}

// Wrap a numeric string in Unicode bidi isolation so it stays LTR inside RTL text.
// [D §6.3], [M §9] — every numeric value in the UI must use this.
export function bidiIsolate(value: string): string {
  return `⁨${value}⁩`;
}

// Watt unit formatter — returns value + «وات» with bidi isolation.
// e.g. 5500 → "‪۵٬۵۰۰‬ وات"  (ready for gold accent in JSX context)
export function formatWatts(watts: number): string {
  return `${bidiIsolate(formatNumber(watts))} وات`;
}

// Compact number (K/M) — for chart axis labels where space is tight.
// Still returns Persian digits.
export function formatCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return toPersianDigits((value / 1_000_000).toFixed(1)) + " م";
  }
  if (Math.abs(value) >= 1_000) {
    return toPersianDigits((value / 1_000).toFixed(0)) + " ه";
  }
  return toPersianDigits(String(value));
}
