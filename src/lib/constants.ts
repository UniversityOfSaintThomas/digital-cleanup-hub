/**
 * CO2-per-storage calculator — AUTHORITATIVE CONSTANTS (in-code source of truth).
 *
 * Mirror of docs/co2-methodology.md. These values are authoritative: do not substitute
 * figures from training data, blog posts, or "common estimates." If you change a value,
 * update this file, docs/co2-methodology.md, the source citation, AND co2.test.ts together.
 *
 * Units are encoded in each name. Figures current as of mid-2026; revisit annually.
 */

/**
 * Operational energy, all-in (includes cooling / PUE), per physical TB per year. kWh/TB/yr.
 * Basis: LBNL/Shehabi 2024 (~6.4 W/disk HDD, ~capacity-independent) => ~0.4-1.2 W/TB at the
 * storage-system level x PUE 1.1-1.6 (Uptime: avg ~1.5, hyperscale ~1.1).
 */
export const OPERATIONAL_ENERGY_KWH_PER_TB_YR = {
  default: 8,
  min: 5,
  max: 15,
} as const;

/**
 * Grid carbon intensity. kg CO2e/kWh. A real lever, not a fixed constant.
 * Basis: US grid average 0.35 (EPA eGRID2023, released 2025: 770.9 lb CO2e/MWh; OWID ~0.37);
 * data-center-weighted ~0.55 (Guidi et al. 2024); ~0.05 for a renewable-matched provider.
 */
export const CARBON_INTENSITY_KG_PER_KWH = {
  default: 0.35,
  min: 0.05,
  max: 0.7,
  presets: {
    usAverage: 0.35,
    dataCenterWeighted: 0.55,
    renewableMatched: 0.05,
  },
} as const;

/**
 * Amortized embodied (manufacturing) carbon, HDD, per TB per year. kg CO2e/TB/yr.
 * Basis: modern enterprise HDD ~1.2-2.5 kg CO2e/TB one-time (Seagate, Pure) / ~4-5 yr life.
 */
export const EMBODIED_KG_PER_TB_YR = {
  default: 0.35,
  min: 0.2,
  max: 0.5,
} as const;

/**
 * Replication / durability multiplier R (dimensionless). Converts logical TB -> physical TB.
 * Default 1 = physical (raw disk). Single-region erasure coding ~1.35x; triple/cross-region ~3x.
 */
export const REPLICATION = {
  default: 1,
  min: 1,
  max: 3,
  presets: {
    physical: 1,
    erasureCoded: 1.35,
    tripleReplicated: 3,
  },
} as const;

/**
 * SSD / hot-tier multiplier applied to the HDD figure.
 * METHODOLOGY RULE: SSD embodied carbon dominates and published LCAs disagree ~50x, so there is
 * NO defensible single SSD value. SSD is modeled as a RANGE only (never a point estimate).
 */
export const SSD_MULTIPLIER = {
  min: 2,
  max: 6,
} as const;

/**
 * Documented headline for physical-TB, modern HDD, operational + embodied. kg CO2e/TB/yr.
 * Used as a drift guard in tests: the computed per-TB central must stay within [low, high].
 */
export const HEADLINE_KG_PER_TB_YR = {
  central: 4,
  low: 3,
  high: 8,
} as const;
