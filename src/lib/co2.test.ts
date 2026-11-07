/**
 * Tests for the CO2-per-storage calculator.
 * Runner: Vitest (`describe/it/expect`). Jest-compatible — for Jest, delete the import line
 * below (Jest provides these as globals) and rename to *.test.ts under your Jest roots.
 */

import { describe, it, expect } from "vitest";
import { estimateAnnualCO2, perTbYear } from "./co2";
import {
  OPERATIONAL_ENERGY_KWH_PER_TB_YR as E,
  CARBON_INTENSITY_KG_PER_KWH as CI,
  EMBODIED_KG_PER_TB_YR as EMB,
  REPLICATION as REP,
  SSD_MULTIPLIER as SSD,
  HEADLINE_KG_PER_TB_YR as HEADLINE,
} from "./constants";

describe("constants are internally consistent", () => {
  const ranges = [
    ["operational energy", E],
    ["carbon intensity", CI],
    ["embodied", EMB],
    ["replication", REP],
  ] as const;

  it("defaults fall within their own min/max", () => {
    for (const [, c] of ranges) {
      expect(c.default).toBeGreaterThanOrEqual(c.min);
      expect(c.default).toBeLessThanOrEqual(c.max);
    }
  });

  it("SSD is a range, with min < max", () => {
    expect(SSD.min).toBeLessThan(SSD.max);
  });
});

describe("formula: kg CO2e/yr = TB x R x (E_op x CI + Emb)", () => {
  it("per-TB term matches E_op x CI + Emb", () => {
    expect(perTbYear(8, 0.4, 0.35)).toBeCloseTo(3.55, 10);
  });

  it("1 TB HDD at US-average grid uses documented central inputs", () => {
    const r = estimateAnnualCO2({ storageTB: 1 }); // medium hdd, R=1, CI=0.35 by default
    // 1 x 1 x (8 x 0.35 + 0.35) = 3.15
    expect(r.central).toBeCloseTo(3.15, 10);
    expect(r.medium).toBe("hdd");
    expect(r.unit).toBe("kg CO2e/year");
  });

  it("low/high bound the central at the chosen grid intensity", () => {
    const r = estimateAnnualCO2({ storageTB: 1 });
    // low  = (5 x 0.35 + 0.2) = 1.95 ; high = (15 x 0.35 + 0.5) = 5.75
    expect(r.low).toBeCloseTo(1.95, 10);
    expect(r.high).toBeCloseTo(5.75, 10);
    expect(r.low).toBeLessThanOrEqual(r.central as number);
    expect(r.central as number).toBeLessThanOrEqual(r.high);
  });

  it("data-center-weighted grid (0.55) raises the central", () => {
    const r = estimateAnnualCO2({ storageTB: 1, carbonIntensity: CI.presets.dataCenterWeighted });
    // 8 x 0.55 + 0.35 = 4.75
    expect(r.central).toBeCloseTo(4.75, 10);
  });
});

describe("scaling and levers", () => {
  it("scales linearly with storage", () => {
    const one = estimateAnnualCO2({ storageTB: 1 }).central as number;
    const ten = estimateAnnualCO2({ storageTB: 10 }).central as number;
    expect(ten).toBeCloseTo(one * 10, 10);
  });

  it("triple replication triples the result", () => {
    const physical = estimateAnnualCO2({ storageTB: 1, replication: REP.presets.physical }).central as number;
    const triple = estimateAnnualCO2({ storageTB: 1, replication: REP.presets.tripleReplicated }).central as number;
    expect(triple).toBeCloseTo(physical * 3, 10);
  });

  it("higher grid intensity yields higher emissions (monotonic)", () => {
    const clean = estimateAnnualCO2({ storageTB: 1, carbonIntensity: CI.presets.renewableMatched }).central as number;
    const dirty = estimateAnnualCO2({ storageTB: 1, carbonIntensity: CI.max }).central as number;
    expect(dirty).toBeGreaterThan(clean);
  });
});

describe("SSD is range-only (no point estimate)", () => {
  it("returns central = null and a range = HDD bounds x SSD multiplier", () => {
    const r = estimateAnnualCO2({ storageTB: 1, medium: "ssd" });
    expect(r.central).toBeNull();
    // hddLow 1.95 x 2 = 3.9 ; hddHigh 5.75 x 6 = 34.5
    expect(r.low).toBeCloseTo(3.9, 10);
    expect(r.high).toBeCloseTo(34.5, 10);
    expect(r.high).toBeGreaterThan(r.low);
    expect(r.note).toMatch(/SSD/);
  });
});

describe("drift guard: code stays consistent with the documented headline", () => {
  it("per-TB HDD central stays within the documented 3-8 band at both grid presets", () => {
    const usAvg = estimateAnnualCO2({ storageTB: 1, carbonIntensity: CI.presets.usAverage }).central as number;
    const dcWtd = estimateAnnualCO2({ storageTB: 1, carbonIntensity: CI.presets.dataCenterWeighted }).central as number;
    for (const v of [usAvg, dcWtd]) {
      expect(v).toBeGreaterThanOrEqual(HEADLINE.low);
      expect(v).toBeLessThanOrEqual(HEADLINE.high);
    }
  });

  it("documented headline central sits inside its own band", () => {
    expect(HEADLINE.central).toBeGreaterThanOrEqual(HEADLINE.low);
    expect(HEADLINE.central).toBeLessThanOrEqual(HEADLINE.high);
  });
});

describe("input validation", () => {
  it("throws on negative or non-finite storage", () => {
    expect(() => estimateAnnualCO2({ storageTB: -1 })).toThrow(RangeError);
    expect(() => estimateAnnualCO2({ storageTB: Number.NaN })).toThrow(RangeError);
  });

  it("zero storage yields zero", () => {
    const r = estimateAnnualCO2({ storageTB: 0 });
    expect(r.central).toBe(0);
    expect(r.low).toBe(0);
    expect(r.high).toBe(0);
  });
});
