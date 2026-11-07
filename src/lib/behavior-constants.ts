/**
 * BEHAVIOR / TRANSMISSION constants (email, video calls).
 *
 * IMPORTANT: these are SEND/USE footprints, not storage, and they are far less settled than the
 * storage numbers in constants.ts. Treat everything here as ORDER-OF-MAGNITUDE and always show a
 * range, never a point estimate. Kept in a separate file on purpose. Sources in
 * docs/co2-methodology.md (Behavior addendum).
 */

/**
 * EMAIL — footprint of SENDING one message (device + network + some data center). grams CO2e.
 * Berners-Lee, "How Bad Are Bananas?" 2nd ed. (2020), which supersedes the 2010 figures (4 g
 * standard / 50 g attachment): spam caught by filters 0.03 g, short email phone 0.2 g / laptop
 * 0.3 g, long email (10 min to write) 17 g, blast to 100 people 26 g. The long-email figures are
 * mostly the sender's/reader's device time, not the send itself. The emails this lever avoids are
 * short (unsubscribes, skipped Reply-All, one-liners), so we use the 0.03-0.3 g band.
 */
export const EMAIL_G_PER_MESSAGE = { low: 0.03, high: 0.3 } as const;

/**
 * VIDEO CALL — footprint per hour of a camera-on call. grams CO2e/hour.
 * Obringer et al. 2021 (Resources, Conservation & Recycling): 150-1000 g/hr (authors call the
 * estimates "rough"). Newer work (Carbon Trust 2021) puts streaming far lower (~tens of g/hr in
 * Europe), and network energy is largely fixed rather than proportional to bitrate, so the true
 * value is highly uncertain. The low bound reflects the newer, lower estimates.
 */
export const VIDEO_CALL_G_PER_HOUR = { low: 55, high: 1000 } as const;

/**
 * Fraction of a video call's footprint avoided by turning the camera OFF.
 * Obringer et al. 2021: ~96%.
 */
export const CAMERA_OFF_FRACTION = 0.96;

/** Weeks per year, for annualizing per-week behavior inputs. */
export const WEEKS_PER_YEAR = 52;
