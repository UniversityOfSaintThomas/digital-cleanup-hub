import { describe, it, expect } from "vitest";
import { estimateBehaviorSavings } from "./behavior";
import {
  EMAIL_G_PER_MESSAGE as EMAIL,
  VIDEO_CALL_G_PER_HOUR as VIDEO,
  CAMERA_OFF_FRACTION,
  WEEKS_PER_YEAR as WEEKS,
} from "./behavior-constants";

describe("behavior constants are sane", () => {
  it("ranges have low < high and camera-off fraction in (0,1]", () => {
    expect(EMAIL.low).toBeLessThan(EMAIL.high);
    expect(VIDEO.low).toBeLessThan(VIDEO.high);
    expect(CAMERA_OFF_FRACTION).toBeGreaterThan(0);
    expect(CAMERA_OFF_FRACTION).toBeLessThanOrEqual(1);
    expect(WEEKS).toBe(52);
  });
});

describe("email lever", () => {
  it("10 emails/person/week for 1 person = 0.0156-0.156 kg/yr", () => {
    const r = estimateBehaviorSavings({ emailsAvoidedPerWeek: 10 });
    // 10 * 52 * 1 = 520 messages ; x0.03g/1000 = 0.0156 ; x0.3g/1000 = 0.156
    expect(r.breakdown.email.low).toBeCloseTo(0.0156, 6);
    expect(r.breakdown.email.high).toBeCloseTo(0.156, 6);
    expect(r.breakdown.video.low).toBe(0);
  });
});

describe("camera-off lever", () => {
  it("5 hrs/person/week for 1 person uses the 96% saving", () => {
    const r = estimateBehaviorSavings({ cameraOffHoursPerWeek: 5 });
    // 5 * 52 = 260 hrs ; low 260*55*0.96/1000 = 13.728 ; high 260*1000*0.96/1000 = 249.6
    expect(r.breakdown.video.low).toBeCloseTo(13.728, 3);
    expect(r.breakdown.video.high).toBeCloseTo(249.6, 3);
  });
});

describe("aggregation and scaling", () => {
  it("total is the sum of breakdowns", () => {
    const r = estimateBehaviorSavings({ emailsAvoidedPerWeek: 10, cameraOffHoursPerWeek: 5 });
    expect(r.low).toBeCloseTo(r.breakdown.email.low + r.breakdown.video.low, 6);
    expect(r.high).toBeCloseTo(r.breakdown.email.high + r.breakdown.video.high, 6);
    expect(r.low).toBeLessThan(r.high);
  });

  it("scales linearly with people (institutional multiplier)", () => {
    const one = estimateBehaviorSavings({ emailsAvoidedPerWeek: 10, cameraOffHoursPerWeek: 5, people: 1 });
    const many = estimateBehaviorSavings({ emailsAvoidedPerWeek: 10, cameraOffHoursPerWeek: 5, people: 10000 });
    expect(many.low).toBeCloseTo(one.low * 10000, 3);
    expect(many.high).toBeCloseTo(one.high * 10000, 3);
  });
});

describe("validation and zero", () => {
  it("no inputs => zero", () => {
    const r = estimateBehaviorSavings({});
    expect(r.low).toBe(0);
    expect(r.high).toBe(0);
  });
  it("throws on negative input", () => {
    expect(() => estimateBehaviorSavings({ emailsAvoidedPerWeek: -1 })).toThrow(RangeError);
    expect(() => estimateBehaviorSavings({ people: Number.NaN })).toThrow(RangeError);
  });
});
