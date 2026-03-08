export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const getPolicyMinDate = (reference: Date): Date => {
  const minDate = new Date(reference.getTime());
  minDate.setMonth(minDate.getMonth() - 5);
  return minDate;
};

export const clampCreatedAtToPolicy = (
  date: Date,
  reference: Date = new Date(),
): Date => {
  const now = reference;
  const minDate = getPolicyMinDate(reference);

  if (date.getTime() > now.getTime()) return now;
  if (date.getTime() < minDate.getTime()) return minDate;
  return date;
};

export const formatCreatedAtDisplay = (date: Date): string => {
  const safeDate = clampCreatedAtToPolicy(date);
  const day = String(safeDate.getDate()).padStart(2, "0");
  const month = MONTHS[safeDate.getMonth()];
  const rawHour = safeDate.getHours();
  const minute = String(safeDate.getMinutes()).padStart(2, "0");
  const suffix = rawHour >= 12 ? "PM" : "AM";
  const hour12 = rawHour % 12 === 0 ? 12 : rawHour % 12;
  const hour = String(hour12).padStart(2, "0");

  return `${day} ${month}, ${hour}:${minute} ${suffix}`;
};

export const parseCreatedAtDisplay = (CreatedAt: string): number => {
  const match = CreatedAt.match(
    /^(\d{2})\s([A-Za-z]{3}),\s(\d{2}):(\d{2})\s(AM|PM)$/,
  );

  if (!match) return Number.NEGATIVE_INFINITY;

  const [, dayRaw, monthRaw, hourRaw, minuteRaw, suffix] = match;
  const monthIndex = MONTHS.indexOf(monthRaw as (typeof MONTHS)[number]);
  if (monthIndex < 0) return Number.NEGATIVE_INFINITY;

  const day = Number(dayRaw);
  const minute = Number(minuteRaw);
  const hour12 = Number(hourRaw);

  if (hour12 < 1 || hour12 > 12 || minute < 0 || minute > 59) {
    return Number.NEGATIVE_INFINITY;
  }

  const hour24 = suffix === "PM" ? (hour12 % 12) + 12 : hour12 % 12;
  const now = new Date();
  const currentYear = now.getFullYear();
  let candidate = new Date(currentYear, monthIndex, day, hour24, minute, 0, 0);

  if (candidate.getMonth() !== monthIndex || candidate.getDate() !== day) {
    return Number.NEGATIVE_INFINITY;
  }

  if (candidate.getTime() > now.getTime()) {
    candidate = new Date(
      currentYear - 1,
      monthIndex,
      day,
      hour24,
      minute,
      0,
      0,
    );
  }

  candidate = clampCreatedAtToPolicy(candidate, now);
  return candidate.getTime();
};

export const createCreatedAtFromMinutesAgo = (
  minutesAgo: number,
  reference: Date = new Date(),
): string => {
  const safeMinutesAgo = Math.max(0, Math.floor(minutesAgo));
  const rawDate = new Date(reference.getTime() - safeMinutesAgo * 60_000);
  return formatCreatedAtDisplay(rawDate);
};
