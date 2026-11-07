# CO₂-per-Storage Calculator — Methodology & Source of Truth

**Purpose:** This file defines the constants, formula, and defensible ranges used by the
storage-CO₂ calculator. It is the single source of truth. The numeric values are mirrored in
code (`src/lib/constants.ts`); **do not invent, round, or change any value here or in code
without updating both and citing the source.** Figures reflect sources current as of November 2026;
revisit annually.

---

## Formula

```
kg CO₂e per year  =  TB × R × ( E_op × CI + Emb )
```

Storage CO₂ is a **rate** (per TB *per year of retention*); multiply by retention years for a
cumulative total. The boundary is **operational energy + cooling (PUE) + amortized
manufacturing**. It **excludes data transfer and access**, which are a separate, access-driven
term (and can rival storage) — do not fold them into this number.

---

## Default constants and defensible ranges

| Symbol | Meaning | Default | Range | Basis |
|---|---|---|---|---|
| `E_op` | Operational energy, all‑in (includes PUE) | **8 kWh/TB/yr** | 5–15 | LBNL/Shehabi 2024 device power (~6.4 W/disk HDD, ~capacity‑independent) ⇒ ~0.4–1.2 W/TB at the storage‑system level × PUE 1.1–1.6 (Uptime: avg ~1.5, hyperscale ~1.1) |
| `CI` | Grid carbon intensity | **0.35 kg/kWh** | 0.05–0.70 | US grid average 0.35 (EPA eGRID2023, released 2025: 770.9 lb CO₂e/MWh; OWID ≈ 0.37). Use **0.55** to reflect where data centers actually sit (Guidi et al. 2024); near 0 for a renewable‑matched provider |
| `Emb` | Amortized embodied (manufacturing) carbon | **0.35 kg CO₂e/TB/yr** | 0.2–0.5 | Modern enterprise HDD ~1.2–2.5 kg CO₂e/TB one‑time (Seagate, Pure) ÷ ~4–5 yr service life |
| `R` | Replication / durability multiplier | **1** (physical TB) | 1–3 | Single‑region erasure coding ~1.35×; triple / cross‑region replication ~3× |

---

## Headline result

For **modern HDD‑based cloud storage, per physical TB, operational + amortized embodied:**

> **≈ 4 kg CO₂e per TB per year — defensible band 3–8 kg.**

Worked check: US‑average grid → `8 × 0.35 + 0.35 ≈ 3.2 kg`; data‑center‑weighted grid →
`8 × 0.55 + 0.35 ≈ 4.8 kg`. The 3–8 band covers both presets plus higher‑energy systems.
Institutional example: 10,000 accounts × 100 GB = 1,000 TB ≈ **3–5 t CO₂e/yr** across the two presets.

The HDD figure is robust because **operational energy dominates and embodied is a small
(~5–10%) add‑on**, so including embodied (which makes the number complete) barely moves it.

---

## The two levers that move the number

1. **Physical vs. logical TB (`R`).** The single most important design choice. If the user
   enters storage they *perceive* using (logical — what shows in their cloud account), the
   provider keeps more on disk for durability. For a consumer‑facing tool, either default `R`
   to ~2 or expose a toggle (1× raw disk / 1.35× erasure‑coded / 3× triple‑replicated). With a
   typical durability factor the logical‑TB headline is roughly **8–15 kg CO₂e/TB/yr**.
2. **Grid (`CI`).** A legitimate ~0.05–0.70 slider, not a fixed constant. Reasonable presets:
   "US average" (0.35), "where data centers tend to be" (0.55), "renewable‑matched provider"
   (≈0.05).

---

## SSD / hot‑tier caveat — do NOT use a single SSD number

For SSD‑backed storage, embodied carbon dominates **and published LCAs disagree by ~50×**:
Seagate's data implies ≈33 kg CO₂e/TB/yr embodied (30 TB SSD), while Pure Storage's implies
≈0.6 kg/TB/yr (modern high‑density SSD). Both are ISO‑14040‑based; they are vendors with
opposite incentives. There is no defensible single SSD value today.

**Design rule:** default the calculator to HDD / general cloud (where the vast majority of bulk
stored data lives). If you offer an SSD/hot‑tier option, present it as a clearly‑labeled wide
range or a "~2–6× the HDD figure" multiplier — never a point estimate.

---

## Calculator design rules

- Always display a **central value and a range**, never a single false‑precise figure.
- Expose at most ~3 inputs: replication (`R`), grid (`CI`), and optionally HDD/SSD. Use the
  defaults above for everything else.
- Show the boundary in a footnote: *operational energy + cooling + amortized manufacturing,
  per year of retention; excludes data transfer and access.*
- State the unit explicitly in the UI (physical vs. logical TB) so the result is interpretable.

---

## Rules for Claude (and other contributors)

- These constants are **authoritative**. Do not substitute values from training data, blog
  posts, or "common estimates."
- The numbers live in code at `src/lib/constants.ts`; a unit test asserts the formula and a
  sample output. If you change a constant, update **this doc, the source citation, the code,
  and the test** together.
- If asked for a figure this doc doesn't cover, say so and flag it rather than guessing.

---

## Behavior / transmission (rougher — order-of-magnitude only)

These cover *sending/use*, not storage, and are far less settled. Always show as a range.

| Lever | Coefficient | Range | Basis |
|---|---|---|---|
| Email sent | per short message | 0.03–0.3 g CO₂e | Berners-Lee 2020 (2nd ed.): spam caught by filter 0.03 g, short email 0.2 g (phone) / 0.3 g (laptop), long email 17 g, blast to 100 people 26 g. Supersedes the 2010 figures (4 g / 50 g). Avoided emails are short, so the lever uses 0.03–0.3 g. |
| Video call | per camera-on hour | 55–1,000 g CO₂e/hr | Obringer et al. 2021 (150–1,000 g/hr, "rough"); Carbon Trust 2021 far lower (low bound). |
| Camera off | saving | ~96% of the call | Obringer et al. 2021. |

kg/yr avoided = per-week count × 52 × people × (g per unit) ÷ 1000.
Network energy is largely fixed, not proportional to bitrate — treat as directional.

---

## Sources

1. Guidi, G., et al. (2024). *Environmental Burden of United States Data Centers in the AI Era.* Harvard T.H. Chan School of Public Health. arXiv:2411.09786. — data‑center‑weighted carbon intensity (548 g/kWh) and attributional method.
2. Shehabi, A., et al. (2024). *2024 United States Data Center Energy Usage Report.* Lawrence Berkeley National Laboratory (LBNL‑2024). — device power (HDD ~6.4 W/disk), PUE, bottom‑up methodology.
3. Tannu, S., & Nair, P. J. (2022). *The Dirty Secret of SSDs: Embodied Carbon.* HotCarbon '22 (ACM). arXiv:2207.10793. — operational + embodied lifecycle split; embodied dominates for SSD.
4. Seagate Technology (2025). *Decarbonizing Data* — HDD vs SSD life‑cycle assessment (vendor; HDD‑favorable).
5. Pure Storage (2025). *Comparing the Embodied Carbon of Flash to HDDs* — ISO 14040/14044‑based vendor data (SSD‑favorable).
6. Mytton, D., & Ashtine, M. (2022). *Sources of data center energy estimates: A comprehensive review.* Joule 6(9). doi:10.1016/j.joule.2022.07.011. — which estimates are credible (LBNL/Masanet, Borderstep).
7. Uptime Institute (2023). *Global Data Center Survey* — PUE (industry avg ~1.5; hyperscale ~1.1).
8. U.S. EPA, *Emissions & Generation Resource Integrated Database (eGRID)*, eGRID2023 (released 2025) — US average 770.9 lb CO₂e/MWh ≈ 0.35 kg/kWh. https://www.epa.gov/egrid/summary-data
9. Our World in Data (2024). *Carbon Intensity of Electricity* — US ≈ 369 g CO₂e/kWh.
10. *Resource‑aware Research on Universe and Matter* (2023). arXiv:2311.01169 — real‑world storage‑server measurement (~1.2 W/TB).
11. Berners‑Lee, M. *How Bad Are Bananas? The Carbon Footprint of Everything* (2nd ed. 2020) — per‑email footprints, as tabulated by the Carbon Literacy Project (2022), https://carbonliteracy.com/the-carbon-cost-of-an-email/
12. Obringer, R., et al. (2021). *The overlooked environmental footprint of increasing Internet use.* Resources, Conservation & Recycling 167, 105389 — video‑call footprint and camera‑off saving.
13. Carbon Trust (2021). *Carbon impact of video streaming* — lower‑bound streaming/transmission estimates.

---

## Other figures shown on the site (Why It Matters / Event tabs)

Not used by the calculators; listed so they can be re-checked each year.

| Figure on site | Source |
|---|---|
| Data centers ≈ 1.5% of global electricity, 485 TWh in 2025; ~950 TWh by 2030 | IEA (2026), *Key Questions on Energy and AI*, https://www.iea.org/reports/key-questions-on-energy-and-ai/executive-summary |
| ICT sector 1.8–3.9% of global GHG emissions | Freitag, C., et al. (2021). *The real climate and transformative impact of ICT.* Patterns 2(9). arXiv:2102.02622 |
| Large data centers use up to 5 million gal/day ≈ a town of 10,000–50,000 | EESI (June 2025), *Data Centers and Water Consumption*, https://www.eesi.org/articles/view/data-centers-and-water-consumption |
| ~52% of stored organizational data is "dark"; 5.8 Mt CO₂ in 2020 | Veritas Technologies (2020), vendor estimate — no newer primary figure found |
| Embodied carbon 40–50% of a data center's lifetime emissions | iMasons Climate Accord (Jan 2026), via Computer Weekly |
| Digital Cleanup Day 2026: 386K participants, 44 countries, 2.3M GB, ~932 t CO₂/yr | Digital Cleanup Day (May 2026), https://www.digitalcleanupday.org/blog/digital-cleanup-day-2026-results-announced-23-million-gigabytes-of-data-removed — organizers' estimate; implies ~0.4 kg/GB/yr, far above this doc's ~0.004 kg/GB/yr |
| Car equivalents: 4.6 t CO₂/yr, ~400 g/mile | U.S. EPA, *Greenhouse Gas Emissions from a Typical Passenger Vehicle* (updated June 2026) |
| Canvas default course quota 500 MB, user 50 MB | Instructure Community, *Canvas File Quotas* |
| New Outlook has no AutoArchive; use Settings → Accounts → Storage | Microsoft Support, *Archive older items automatically*; *Mailbox storage limits in Outlook* |
