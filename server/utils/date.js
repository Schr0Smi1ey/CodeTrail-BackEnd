const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const BST_TIMEZONE = "Asia/Dhaka"; // Bangladesh Standard Time

export function pad2(value) {
  return String(value).padStart(2, "0");
}

export function getDateInTimezone(date, timezone) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find((p) => p.type === "year").value;
  const month = parts.find((p) => p.type === "month").value;
  const day = parts.find((p) => p.type === "day").value;
  return `${year}-${month}-${day}`;
}

export function getTodayLocalDate() {
  return normalizeLocalDate(new Date());
}

export function isLocalDateString(value) {
  if (!DATE_RE.test(String(value))) return false;
  const [year, month, day] = String(value).split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function normalizeLocalDate(value) {
  if (!value) return getTodayLocalDate();
  if (typeof value === "string") {
    if (!isLocalDateString(value)) throw new Error("Date must be YYYY-MM-DD");
    return value;
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid date");
  return getDateInTimezone(date, BST_TIMEZONE);
}

export function toDateRange({ date, startDate, endDate }) {
  if (date) {
    const day = normalizeLocalDate(date);
    return { $gte: day, $lte: day };
  }
  const range = {};
  if (startDate) range.$gte = normalizeLocalDate(startDate);
  if (endDate) range.$lte = normalizeLocalDate(endDate);
  return Object.keys(range).length ? range : undefined;
}

export function getWeekRangeLocal(baseDate = new Date()) {
  const date = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
  );
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const start = new Date(date);
  start.setDate(date.getDate() + diffToMonday);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return {
    startDate: normalizeLocalDate(start),
    endDate: normalizeLocalDate(end),
  };
}
