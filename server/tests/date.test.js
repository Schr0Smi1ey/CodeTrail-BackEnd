import { describe, expect, it } from "vitest";
import {
  getTodayLocalDate,
  isLocalDateString,
  normalizeLocalDate,
  toDateRange,
} from "../utils/date.js";

describe("local date utilities", () => {
  it("accepts valid YYYY-MM-DD dates only", () => {
    expect(isLocalDateString("2026-05-28")).toBe(true);
    expect(isLocalDateString("2026-5-28")).toBe(false);
    expect(isLocalDateString("2026-02-31")).toBe(false);
  });

  it("normalizes Date values without timezone shifting", () => {
    expect(normalizeLocalDate(new Date(2026, 4, 28, 23, 30))).toBe("2026-05-28");
  });

  it("builds inclusive string date ranges", () => {
    expect(toDateRange({ date: "2026-05-28" })).toEqual({
      $gte: "2026-05-28",
      $lte: "2026-05-28",
    });
    expect(toDateRange({ startDate: "2026-05-01", endDate: "2026-05-31" })).toEqual({
      $gte: "2026-05-01",
      $lte: "2026-05-31",
    });
  });

  it("returns today as a local date string", () => {
    expect(getTodayLocalDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
