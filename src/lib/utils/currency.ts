// DESIGN.md §6.3 — Toman currency formatting.
// Symbol always comes AFTER the number: ۱٬۲۰۰٬۰۰۰ تومان
// Persian thousands separator: ٬ (U+066C ARABIC THOUSANDS SEPARATOR)

import { formatNumber, bidiIsolate } from "./numbers";

// Full Toman format: e.g. 1200000 → "⁨۱٬۲۰۰٬۰۰۰⁩ تومان"
export function formatToman(value: number): string {
  return `${bidiIsolate(formatNumber(value))} تومان`;
}

// Compact Toman — for tight spaces: e.g. 1200000 → "۱٫۲ م تومان"
export function formatTomanCompact(value: number): string {
  let compact: string;
  if (Math.abs(value) >= 1_000_000_000) {
    compact = `${(value / 1_000_000_000).toFixed(1)} م`;
  } else if (Math.abs(value) >= 1_000_000) {
    compact = `${(value / 1_000_000).toFixed(1)} م`;
  } else if (Math.abs(value) >= 1_000) {
    compact = `${(value / 1_000).toFixed(0)} ه`;
  } else {
    compact = String(value);
  }
  // Replace dots with Persian decimal separator and digits
  compact = compact.replace(".", "٫").replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
  return `${bidiIsolate(compact)} تومان`;
}
