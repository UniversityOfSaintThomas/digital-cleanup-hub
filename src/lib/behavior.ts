/**
 * Behavior savings calculator — emails not sent + camera-off hours.
 *
 * Returns a RANGE ONLY (no central): transmission/use estimates are not settled enough to justify
 * a point value. See behavior-constants.ts and docs/co2-methodology.md (Behavior addendum).
 *
 *   kg/yr avoided = per-week count × 52 × people × (grams per unit) / 1000
 */

import {
  EMAIL_G_PER_MESSAGE as EMAIL,
  VIDEO_CALL_G_PER_HOUR as VIDEO,
  CAMERA_OFF_FRACTION,
  WEEKS_PER_YEAR as WEEKS,
} from "./behavior-constants";

export interface BehaviorInput {
  /** Emails NOT sent, per person per week (unsubscribes, skipped Reply-All, fewer one-liners). */
  emailsAvoidedPerWeek?: number;
  /** Hours of video meetings per person per week spent with the camera OFF instead of on. */
  cameraOffHoursPerWeek?: number;
  /** Number of people. Default 1. */
  people?: number;
}

export interface Range {
  low: number;
  high: number;
}

export interface BehaviorSavings {
  /** kg CO2e/year avoided (range only). */
  low: number;
  high: number;
  unit: "kg CO2e/year";
  breakdown: { email: Range; video: Range };
  note: string;
}

export function estimateBehaviorSavings(input: BehaviorInput): BehaviorSavings {
  const people = input.people ?? 1;
  const emails = input.emailsAvoidedPerWeek ?? 0;
  const camHours = input.cameraOffHoursPerWeek ?? 0;

  for (const v of [people, emails, camHours]) {
    if (!Number.isFinite(v) || v < 0) {
      throw new RangeError(`behavior inputs must be finite numbers >= 0 (got ${v})`);
    }
  }

  const emailUnits = emails * WEEKS * people;
  const email: Range = {
    low: (emailUnits * EMAIL.low) / 1000,
    high: (emailUnits * EMAIL.high) / 1000,
  };

  const camUnits = camHours * WEEKS * people;
  const video: Range = {
    low: (camUnits * VIDEO.low * CAMERA_OFF_FRACTION) / 1000,
    high: (camUnits * VIDEO.high * CAMERA_OFF_FRACTION) / 1000,
  };

  return {
    low: email.low + video.low,
    high: email.high + video.high,
    unit: "kg CO2e/year",
    breakdown: { email, video },
    note:
      "Transmission/use estimates (email, video) are far less settled than storage \u2014 " +
      "order-of-magnitude only. Email per Berners-Lee (How Bad Are Bananas?, 2020 ed.); video per Obringer " +
      "et al. 2021 (newer studies are lower).",
  };
}
