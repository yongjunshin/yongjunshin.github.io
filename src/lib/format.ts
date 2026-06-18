const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** "2024-12-23" → "December 23, 2024". 형식이 다르면 원문 그대로 반환. */
export function formatPatentDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const month = MONTHS[Number.parseInt(m[2], 10) - 1];
  if (!month) return iso;
  return `${month} ${Number.parseInt(m[3], 10)}, ${m[1]}`;
}

/** 뉴스 날짜(Date) → "2026.06.17" (UTC 기준, 타임존 이동 방지). */
export function formatNewsDate(d: Date): string {
  const y = d.getUTCFullYear();
  const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
  const da = String(d.getUTCDate()).padStart(2, "0");
  return `${y}.${mo}.${da}`;
}
