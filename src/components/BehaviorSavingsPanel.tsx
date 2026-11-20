import { useId, useMemo, useState, type ReactNode } from "react";
import { Activity, Info } from "lucide-react";
import { estimateBehaviorSavings } from "../lib/behavior";

/**
 * Behavior / "sends-avoided" panel. Transmission-side levers (fewer emails, camera-off), scalable
 * by people. Range-only by design — these estimates are rougher than storage. See
 * docs/co2-methodology.md (Behavior addendum).
 */

const METHODOLOGY_URL =
  "https://github.com/UniversityOfSaintThomas/digital-cleanup-hub/blob/main/docs/co2-methodology.md";

function rangeDisplay(low: number, high: number): { text: string; unit: string } {
  const t = high >= 1000;
  const f = (k: number) => {
    const v = t ? k / 1000 : k;
    if (v === 0) return "0";
    if (v < 1) return v.toFixed(2);
    if (v < 10) return v.toFixed(1);
    return Math.round(v).toString();
  };
  return { text: `${f(low)}\u2013${f(high)}`, unit: `${t ? "t" : "kg"} CO\u2082e / year` };
}

function kgRange(low: number, high: number): string {
  const f = (k: number) => {
    if (k >= 1000) return `${(k / 1000).toFixed(1)} t`;
    if (k === 0) return "0";
    if (k < 1) return `${k.toFixed(2)}`;
    if (k < 10) return `${k.toFixed(1)}`;
    return `${Math.round(k)}`;
  };
  return `${f(low)}\u2013${f(high)} kg`;
}

export default function BehaviorSavingsPanel() {
  const [emails, setEmails] = useState(10);
  const [camHours, setCamHours] = useState(5);
  const [institution, setInstitution] = useState(false);
  const [accounts, setAccounts] = useState(10000);

  const people = institution ? Math.max(1, accounts) : 1;

  const r = useMemo(
    () =>
      estimateBehaviorSavings({
        emailsAvoidedPerWeek: emails,
        cameraOffHoursPerWeek: camHours,
        people,
      }),
    [emails, camHours, people]
  );

  const total = rangeDisplay(r.low, r.high);

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl">
      <div className="flex items-center gap-2 mb-1">
        <Activity className="w-5 h-5 text-plum-600" aria-hidden="true" />
        <h3 className="text-xl font-bold tracking-tight">Behavior Savings (avoided costs)</h3>
      </div>
      <p className="text-sm text-muted mb-6">
        Usually a bigger lever than storage: not sending, and camera-off. These are
        transmission/use estimates &mdash; rougher than storage, so shown as a wide range.
      </p>

      <Slider label="Fewer emails / person / week" value={emails} min={0} max={100} suffix=" emails" onChange={setEmails} />
      <Slider label="Camera-off hours / person / week" value={camHours} min={0} max={40} suffix=" hrs" onChange={setCamHours} />

      {/* Institutional multiplier */}
      <div className="mt-2 mb-6">
        <div className="text-sm font-medium text-ink mb-2">Scale</div>
        <div role="group" aria-label="Scale" className="flex flex-wrap items-center gap-2">
          <PillButton active={!institution} onClick={() => setInstitution(false)}>Just me</PillButton>
          <PillButton active={institution} onClick={() => setInstitution(true)}>Whole institution</PillButton>
          {institution && (
            <>
              <input
                type="number"
                min={1}
                value={accounts}
                onChange={(e) => setAccounts(Math.max(1, parseInt(e.target.value || "1", 10)))}
                className="w-28 px-3 py-2 rounded-lg border border-line bg-white text-sm tabular-nums"
                aria-label="Number of people"
              />
              <span className="text-xs text-muted">people</span>
            </>
          )}
        </div>
      </div>

      {/* Result */}
      <div className="pt-5 border-t border-tone">
        <div className="text-sm font-bold text-ink">Estimated avoided / year</div>
        <div className="text-3xl font-bold text-plum-700 mt-1">
          {total.text} <span className="text-lg text-muted font-normal">{total.unit}</span>
        </div>
        <div className="text-sm text-muted mt-1">
          email {kgRange(r.breakdown.email.low, r.breakdown.email.high)} &middot; camera-off{" "}
          {kgRange(r.breakdown.video.low, r.breakdown.video.high)}
        </div>
        <div className="flex items-start gap-2 mt-4 text-xs text-muted">
          <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span>
            {r.note}{" "}
            <a href={METHODOLOGY_URL} target="_blank" rel="noreferrer" className="underline hover:text-plum-600">
              Sources
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  onChange: (n: number) => void;
}) {
  const id = useId();
  return (
    <div className="mb-4">
      <div className="flex justify-between items-baseline mb-2">
        <label htmlFor={id} className="text-sm font-medium text-ink">{label}</label>
        <span className="text-sm tabular-nums text-muted">
          {value}
          {suffix ?? ""}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full accent-plum-600"
      />
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
        "px-3.5 py-2 rounded-full text-sm border transition-colors " +
        (active ? "bg-plum-700 text-white border-plum-700" : "bg-tone text-ink border-transparent hover:bg-plum-100")
      }
    >
      {children}
    </button>
  );
}
