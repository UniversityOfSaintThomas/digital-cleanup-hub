import { useMemo, useState, type ReactNode } from "react";
import { Calculator, Info } from "lucide-react";
import { estimateAnnualCO2, type StorageMedium } from "../lib/co2";
import {
  CARBON_INTENSITY_KG_PER_KWH as CI,
  REPLICATION as REP,
} from "../lib/constants";

/**
 * Storage footprint estimator (Option B + institutional "x accounts" multiplier).
 * Powered by the audited engine in src/lib/co2.ts. Storage only — operational + amortized
 * embodied, per year of retention. Email/video live in BehaviorSavingsPanel.
 */

// EPA reference figures for relatable equivalents:
const KG_PER_CAR_MILE = 0.4; // ~0.4 kg CO2 per mile, typical passenger vehicle
const KG_PER_CAR_YEAR = 4600; // ~4.6 t CO2 / year, typical passenger vehicle

const METHODOLOGY_URL =
  "https://github.com/UniversityOfSaintThomas/digital-cleanup-hub/blob/main/docs/co2-methodology.md";

type GridKey = keyof typeof CI.presets;
type RepKey = keyof typeof REP.presets;
type Option<K extends string> = { key: K; label: string; hint?: string };

const MEDIA_OPTIONS: Option<StorageMedium>[] = [
  { key: "hdd", label: "HDD (bulk cloud)", hint: "Default. Most stored data lives on hard drives." },
  { key: "ssd", label: "SSD (hot tier)", hint: "Embodied carbon dominates and is uncertain — range only." },
];
const GRID_OPTIONS: Option<GridKey>[] = [
  { key: "usAverage", label: "U.S. average", hint: "~0.35 kg CO\u2082e/kWh (EPA eGRID 2023)" },
  { key: "dataCenterWeighted", label: "Where data centers sit", hint: "~0.55 kg/kWh (Guidi et al. 2024)" },
  { key: "renewableMatched", label: "Renewable-matched", hint: "~0.05 kg/kWh provider" },
];
const REP_OPTIONS: Option<RepKey>[] = [
  { key: "physical", label: "Raw disk", hint: "Physical TB only (1\u00D7)" },
  { key: "erasureCoded", label: "Erasure-coded", hint: "Single-region durability (~1.35\u00D7)" },
  { key: "tripleReplicated", label: "3 copies", hint: "Triple / cross-region (3\u00D7)" },
];

/** Big-number value + unit (switches to tonnes when large). */
function splitMass(kg: number): { value: string; unit: string } {
  if (kg >= 1000) {
    const t = kg / 1000;
    return { value: t < 10 ? t.toFixed(1) : Math.round(t).toString(), unit: "t CO\u2082e / year" };
  }
  if (kg === 0) return { value: "0", unit: "kg CO\u2082e / year" };
  if (kg < 1) return { value: kg.toFixed(2), unit: "kg CO\u2082e / year" };
  if (kg < 10) return { value: kg.toFixed(1), unit: "kg CO\u2082e / year" };
  return { value: Math.round(kg).toString(), unit: "kg CO\u2082e / year" };
}

/** Inline range like "2.2–6.5 kg" or "1.2–3.6 t". */
function rangeStr(low: number, high: number): string {
  const t = high >= 1000;
  const f = (k: number) => {
    const v = t ? k / 1000 : k;
    if (v === 0) return "0";
    if (v < 1) return v.toFixed(2);
    if (v < 10) return v.toFixed(1);
    return Math.round(v).toString();
  };
  return `${f(low)}\u2013${f(high)} ${t ? "t" : "kg"}`;
}

function equiv(kg: number): string {
  if (kg >= KG_PER_CAR_YEAR) {
    const cars = kg / KG_PER_CAR_YEAR;
    return `\u2248 ${cars < 10 ? cars.toFixed(1) : Math.round(cars)} cars off the road for a year`;
  }
  return `\u2248 ${Math.round(kg / KG_PER_CAR_MILE)} car-miles`;
}

export default function StorageImpactCalculator() {
  const [gb, setGb] = useState(100);
  const [medium, setMedium] = useState<StorageMedium>("hdd");
  const [grid, setGrid] = useState<GridKey>("usAverage");
  const [rep, setRep] = useState<RepKey>("physical");
  const [institution, setInstitution] = useState(false);
  const [accounts, setAccounts] = useState(10000);

  const people = institution ? Math.max(1, accounts) : 1;

  const est = useMemo(
    () =>
      estimateAnnualCO2({
        storageTB: (gb / 1000) * people,
        medium,
        carbonIntensity: CI.presets[grid],
        replication: REP.presets[rep],
      }),
    [gb, people, medium, grid, rep]
  );

  const headline = est.central ?? est.high;

  return (
    <div className="bg-white p-6 rounded-xl border border-stone-200">
      <div className="flex items-center gap-2 mb-1">
        <Calculator className="w-5 h-5 text-plum-600" />
        <h3 className="text-lg font-semibold">Storage footprint estimator</h3>
      </div>
      <p className="text-sm text-stone-500 mb-6">
        Operational energy + cooling + amortized manufacturing, per year of retention. Shown as a
        range on purpose &mdash; there is no single exact figure. Excludes transfer &amp; access.
      </p>

      {/* Storage slider */}
      <div className="mb-6">
        <div className="flex justify-between items-baseline mb-2">
          <label className="text-sm font-medium text-stone-700">
            Cloud storage{institution ? " / account" : ""}
          </label>
          <span className="text-sm font-mono text-stone-500">
            {gb} GB{gb >= 1000 ? ` \u00B7 ${(gb / 1000).toFixed(2)} TB` : ""}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={2000}
          step={10}
          value={gb}
          onChange={(e) => setGb(parseInt(e.target.value, 10))}
          className="w-full accent-plum-600"
        />
      </div>

      {/* Toggles */}
      <div className="space-y-4 mb-6">
        <ToggleRow label="Storage type" options={MEDIA_OPTIONS} value={medium} onChange={setMedium} />
        <ToggleRow label="Electricity grid" options={GRID_OPTIONS} value={grid} onChange={setGrid} />
        <ToggleRow label="Counting" options={REP_OPTIONS} value={rep} onChange={setRep} />

        {/* Institutional multiplier */}
        <div>
          <div className="text-sm font-medium text-stone-700 mb-2">Scale</div>
          <div className="flex flex-wrap items-center gap-2">
            <PillButton active={!institution} onClick={() => setInstitution(false)}>Just me</PillButton>
            <PillButton active={institution} onClick={() => setInstitution(true)}>Whole institution</PillButton>
            {institution && (
              <>
                <input
                  type="number"
                  min={1}
                  value={accounts}
                  onChange={(e) => setAccounts(Math.max(1, parseInt(e.target.value || "1", 10)))}
                  className="w-28 px-2 py-1.5 rounded-lg border border-stone-200 text-sm font-mono"
                  aria-label="Number of accounts"
                />
                <span className="text-xs text-stone-500">accounts</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="pt-5 border-t border-stone-100">
        <div className="text-xs text-stone-500 uppercase tracking-wide">Estimated footprint</div>

        {est.central != null ? (
          <>
            <div className="text-3xl font-semibold text-plum-700 mt-1">
              {splitMass(est.central).value}{" "}
              <span className="text-lg text-stone-500 font-normal">{splitMass(est.central).unit}</span>
            </div>
            <div className="text-sm text-stone-500 mt-1">
              range {rangeStr(est.low, est.high)} &middot; {equiv(headline)}
            </div>
          </>
        ) : (
          <>
            <div className="text-3xl font-semibold text-plum-700 mt-1">
              {rangeStr(est.low, est.high)}{" "}
              <span className="text-lg text-stone-500 font-normal">CO&#8322;e / year</span>
            </div>
            <div className="text-sm text-stone-500 mt-1">
              range only (no single defensible SSD value) &middot; {equiv(headline)}
            </div>
          </>
        )}

        {institution && est.central != null && (
          <div className="text-xs text-stone-400 mt-1">
            {splitMass(est.central / people).value} {splitMass(est.central / people).unit} per account
            {" \u00B7 "}roughly half of stored data is typically never accessed again.
          </div>
        )}

        <div className="flex items-start gap-2 mt-4 text-xs text-stone-500">
          <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <span>
            {est.note}{" "}
            <a href={METHODOLOGY_URL} target="_blank" rel="noreferrer" className="underline hover:text-plum-600">
              How this is calculated
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

function PillButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        "px-3 py-1.5 rounded-lg text-sm border transition-colors " +
        (active ? "bg-plum-600 text-white border-plum-600" : "bg-white text-stone-600 border-stone-200 hover:border-plum-300")
      }
    >
      {children}
    </button>
  );
}

function ToggleRow<K extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Option<K>[];
  value: K;
  onChange: (key: K) => void;
}) {
  return (
    <div>
      <div className="text-sm font-medium text-stone-700 mb-2">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <PillButton key={o.key} active={o.key === value} onClick={() => onChange(o.key)}>
            <span title={o.hint}>{o.label}</span>
          </PillButton>
        ))}
      </div>
    </div>
  );
}
