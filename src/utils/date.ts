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

const MINUTE_IN_MS = 60_000;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
const DAY_IN_MS = 24 * HOUR_IN_MS;

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
  const year = safeDate.getFullYear();
  const rawHour = safeDate.getHours();
  const minute = String(safeDate.getMinutes()).padStart(2, "0");
  const second = String(safeDate.getSeconds()).padStart(2, "0");
  const suffix = rawHour >= 12 ? "PM" : "AM";
  const hour12 = rawHour % 12 === 0 ? 12 : rawHour % 12;
  const hour = String(hour12).padStart(2, "0");

  return `${day} ${month} ${year}, ${hour}:${minute}:${second} ${suffix}`;
};

export const parseCreatedAtDisplay = (CreatedAt: string): number => {
  const match = CreatedAt.match(
    /^(\d{2})\s([A-Za-z]{3})(?:\s(\d{4}))?,\s(\d{2}):(\d{2})(?::(\d{2}))?\s(AM|PM)$/,
  );

  if (!match) return Number.NEGATIVE_INFINITY;

  const [, dayRaw, monthRaw, yearRaw, hourRaw, minuteRaw, secondRaw, suffix] =
    match;
  const monthIndex = MONTHS.indexOf(monthRaw as (typeof MONTHS)[number]);
  if (monthIndex < 0) return Number.NEGATIVE_INFINITY;

  const day = Number(dayRaw);
  const parsedYear = yearRaw ? Number(yearRaw) : undefined;
  const minute = Number(minuteRaw);
  const second = secondRaw ? Number(secondRaw) : 0;
  const hour12 = Number(hourRaw);

  if (
    hour12 < 1 ||
    hour12 > 12 ||
    minute < 0 ||
    minute > 59 ||
    second < 0 ||
    second > 59 ||
    (parsedYear !== undefined && Number.isNaN(parsedYear))
  ) {
    return Number.NEGATIVE_INFINITY;
  }

  const hour24 = suffix === "PM" ? (hour12 % 12) + 12 : hour12 % 12;
  const now = new Date();
  let candidate = new Date(
    parsedYear ?? now.getFullYear(),
    monthIndex,
    day,
    hour24,
    minute,
    second,
    0,
  );

  if (candidate.getMonth() !== monthIndex || candidate.getDate() !== day) {
    return Number.NEGATIVE_INFINITY;
  }

  if (parsedYear === undefined && candidate.getTime() > now.getTime()) {
    candidate = new Date(
      now.getFullYear() - 1,
      monthIndex,
      day,
      hour24,
      minute,
      second,
      0,
    );
  }

  if (parsedYear !== undefined) {
    return candidate.getTime();
  }

  candidate = clampCreatedAtToPolicy(candidate, now);
  return candidate.getTime();
};

export const parseDateValue = (dateString: string): Date | null => {
  const createdAtTimestamp = parseCreatedAtDisplay(dateString);
  if (Number.isFinite(createdAtTimestamp)) {
    return new Date(createdAtTimestamp);
  }

  const fallbackTimestamp = new Date(dateString).getTime();
  if (Number.isNaN(fallbackTimestamp)) {
    return null;
  }

  return new Date(fallbackTimestamp);
};

export type RelativeCreatedAtKey =
  | "thisMonth"
  | "twoWeeksAgo"
  | "oneDayAgo"
  | "manyDaysAgo"
  | "oneHourAgo"
  | "manyHoursAgo"
  | "oneMinuteAgo"
  | "manyMinutesAgo"
  | "oneSecondAgo"
  | "manySecondsAgo";

export type RelativeCreatedAtTranslator = (
  key: RelativeCreatedAtKey,
  values?: { count: number },
) => string;

const getStartOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const formatRelativeCreatedAt = (
  dateString: string,
  t: RelativeCreatedAtTranslator,
): string => {
  const now = new Date();
  const past = parseDateValue(dateString);

  if (!past) return "-";

  const safePast = past.getTime() > now.getTime() ? now : past;
  const elapsedMs = now.getTime() - safePast.getTime();
  const elapsedSeconds = Math.floor(elapsedMs / 1000);

  const daysDiff = Math.floor(
    (getStartOfDay(now).getTime() - getStartOfDay(safePast).getTime()) /
      DAY_IN_MS,
  );

  if (daysDiff > 21) return t("thisMonth", { count: 0 });
  if (daysDiff >= 14) return t("twoWeeksAgo", { count: 2 });

  if (daysDiff >= 1) {
    if (daysDiff === 1) return t("oneDayAgo", { count: 1 });
    return t("manyDaysAgo", { count: daysDiff });
  }

  const hoursDiff = Math.floor(elapsedSeconds / 3_600);
  if (hoursDiff >= 1) {
    if (hoursDiff === 1) return t("oneHourAgo", { count: 1 });
    return t("manyHoursAgo", { count: hoursDiff });
  }

  const minutesDiff = Math.floor(elapsedSeconds / 60);
  if (minutesDiff >= 1) {
    if (minutesDiff === 1) return t("oneMinuteAgo", { count: 1 });
    return t("manyMinutesAgo", { count: minutesDiff });
  }

  const safeSeconds = Math.max(1, elapsedSeconds);
  if (safeSeconds === 1) return t("oneSecondAgo", { count: 1 });
  return t("manySecondsAgo", { count: safeSeconds });
};

export type CreatedAtOffsetParts = {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

const normalizeOffsetPart = (value: number | undefined): number => {
  if (value === undefined || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
};

const getOffsetInMilliseconds = (
  offset: number | CreatedAtOffsetParts,
): number => {
  if (typeof offset === "number") {
    return normalizeOffsetPart(offset) * MINUTE_IN_MS;
  }

  const days = normalizeOffsetPart(offset.days);
  const hours = normalizeOffsetPart(offset.hours);
  const minutes = normalizeOffsetPart(offset.minutes);
  const seconds = normalizeOffsetPart(offset.seconds);

  return (((days * 24 + hours) * 60 + minutes) * 60 + seconds) * 1_000;
};

export const createCreatedAtFromMinutesAgo = (
  minutesAgo: number | CreatedAtOffsetParts,
  reference: Date = new Date(),
): string => {
  const offsetInMilliseconds = getOffsetInMilliseconds(minutesAgo);
  const rawDate = new Date(reference.getTime() - offsetInMilliseconds);
  return formatCreatedAtDisplay(rawDate);
};

export const createCreatedAtFromTimeAgo = (
  offset: CreatedAtOffsetParts,
  reference: Date = new Date(),
): string => createCreatedAtFromMinutesAgo(offset, reference);
