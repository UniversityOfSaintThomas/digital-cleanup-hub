import { useState } from 'react';
import { Cloud, HardDrive, Calculator, Repeat, Calendar, Mail, FolderOpen, Users, GraduationCap, Video, PlayCircle, Check, ExternalLink, AlertCircle, TrendingDown, Lightbulb, Copy, ArrowRight } from 'lucide-react';
import StorageImpactCalculator from './StorageImpactCalculator';
import BehaviorSavingsPanel from './BehaviorSavingsPanel';

export default function EarthDayHub() {
  const [activeSection, setActiveSection] = useState('why');
  const [activePlatform, setActivePlatform] = useState('outlook');
  const [copied, setCopied] = useState<string | null>(null);

  const sections = [
    { id: 'why', label: 'Why It Matters', icon: Cloud },
    { id: 'cleanup', label: 'Cleanup Guides', icon: HardDrive },
    { id: 'tools', label: 'Impact Tools', icon: Calculator },
    { id: 'behavior', label: 'Behavior Change', icon: Repeat },
    { id: 'event', label: 'Running the Event', icon: Calendar },
  ];

  const platforms = [
    { id: 'outlook', label: 'Outlook', icon: Mail },
    { id: 'onedrive', label: 'OneDrive', icon: FolderOpen },
    { id: 'sharepoint', label: 'SharePoint & Teams', icon: Users },
    { id: 'canvas', label: 'Canvas', icon: GraduationCap },
    { id: 'zoom', label: 'Zoom', icon: Video },
    { id: 'panopto', label: 'Panopto', icon: PlayCircle },
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={`${import.meta.env.BASE_URL}sustainability-shield.png`} alt="Sustainable St. Thomas shield" className="h-12 w-auto" />
            <div>
              <h1 className="font-semibold text-plum-700 leading-tight">Digital Cleanup Hub</h1>
              <p className="text-xs text-stone-500">Cloud storage cleanup for Higher Ed</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-stone-500">
            <div className="w-2 h-2 rounded-full bg-leaf"></div>
            ITS Sustainability · Office of Sustainability Initiatives
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <nav className="hidden md:block w-56 flex-shrink-0">
          <div className="sticky top-24 space-y-1">
            {sections.map((s, i) => {
              const Icon = s.icon;
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                    active
                      ? 'bg-plum-50 text-plum-900 font-medium'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span className={`text-xs w-5 ${active ? 'text-plum-600' : 'text-stone-400'}`}>0{i + 1}</span>
                  <Icon className="w-4 h-4" />
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Mobile nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-10">
          <div className="flex overflow-x-auto">
            {sections.map((s) => {
              const Icon = s.icon;
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 text-xs ${
                    active ? 'text-plum-600' : 'text-stone-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {s.label.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 pb-20 md:pb-0">

          {/* SECTION 1: WHY */}
          {activeSection === 'why' && (
            <div className="space-y-8">
              <div className="bg-plum-50 border border-plum-200 p-5 rounded-xl">
                <p className="text-sm text-plum-700 leading-relaxed">
                  <span className="font-semibold">Host your own Digital Cleanup event.</span> This hub grew out of an Earth Day workshop hosted by the ITS Sustainability Team and the Office of Sustainability Initiatives (OSI) at the University of St. Thomas. In one hour, participants learned to understand their digital carbon footprint, cleaned up their biggest "digital landfills," and adopted habits to avoid creating more digital waste. Everything you need to run the same event — facts, per-platform guides, calculators, and templates — is here.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-plum-600 font-medium mb-2">Part 01</p>
                <h2 className="text-3xl font-semibold text-stone-900 mb-3">Why cloud storage has a carbon cost</h2>
                <p className="text-stone-600 leading-relaxed">The core facts attendees need to trust the premise — grounded in current research from IEA, iMasons, and peer-reviewed studies.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white p-5 rounded-lg border border-stone-200">
                  <div className="text-2xl font-semibold text-stone-900">1–1.5%</div>
                  <div className="text-xs text-stone-500 mt-1">Global electricity from data centers (IEA)</div>
                </div>
                <div className="bg-white p-5 rounded-lg border border-stone-200">
                  <div className="text-2xl font-semibold text-stone-900">2–3.7%</div>
                  <div className="text-xs text-stone-500 mt-1">Global GHG emissions incl. full ICT sector</div>
                </div>
                <div className="bg-white p-5 rounded-lg border border-stone-200">
                  <div className="text-2xl font-semibold text-stone-900">~2×</div>
                  <div className="text-xs text-stone-500 mt-1">Projected growth in data center energy by 2026</div>
                </div>
                <div className="bg-plum-600 text-white p-5 rounded-lg">
                  <div className="text-2xl font-semibold">&gt;50%</div>
                  <div className="text-xs text-plum-50 mt-1">Of stored data is never used again ("dark data")</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Three drivers of the footprint</h3>
                <div className="space-y-3">
                  {[
                    { num: '1', color: 'bg-amber-100 text-amber-700', title: 'Operational electricity', body: 'Power for servers, storage, networking, and cooling. Depends heavily on the local grid — a query routed to hydro-powered Norway has a dramatically lower footprint than one routed to a coal-heavy grid.' },
                    { num: '2', color: 'bg-rose-100 text-rose-700', title: 'Embodied carbon', body: 'Emissions from manufacturing hardware. Per the iMasons Climate Accord (Jan 2026), this now accounts for 40–50% of a data center\'s lifetime emissions as grids decarbonize.' },
                    { num: '3', color: 'bg-sky-100 text-sky-700', title: 'Water consumption', body: 'Chilled water for cooling. Some U.S. facilities use 3–5 million gallons per day — comparable to a city of 30,000–50,000 people. Increasingly controversial in drought-affected regions.' },
                  ].map((d) => (
                    <div key={d.num} className="bg-white p-5 rounded-lg border border-stone-200">
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full ${d.color} flex items-center justify-center text-sm font-medium flex-shrink-0`}>{d.num}</div>
                        <div>
                          <h4 className="font-medium text-stone-900 mb-1">{d.title}</h4>
                          <p className="text-sm text-stone-600 leading-relaxed">{d.body}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

             <div>
  <h3 className="text-lg font-semibold mb-2">Rules of thumb for your slides</h3>
  <p className="text-sm text-stone-500 mb-4">Defensible starting figures — storage is well-grounded; email and video are order-of-magnitude. Cite as estimates; studies vary.</p>
  <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
    <div className="divide-y divide-stone-100">
      {[
        { a: 'Storing 100 GB for one year', b: '~0.3–0.8 kg CO₂e', sub: 'U.S. grid average · operational + manufacturing' },
        { a: 'Storing 1 TB for one year', b: '~3–8 kg CO₂e', sub: 'U.S. grid average · operational + manufacturing' },
        { a: '10,000 accounts × 100 GB each', b: '~5 tonnes CO₂e / year', sub: 'At institutional scale — ~half never accessed again' },
        { a: 'Spam email', b: '~0.3 g CO₂e', sub: 'Per message (Berners-Lee 2010)' },
        { a: 'Standard text email', b: '~4 g CO₂e', sub: 'Per message (Berners-Lee 2010; 2020 ed. lower)' },
        { a: 'Email with large attachment', b: 'Up to 50 g CO₂e', sub: '≈ five plastic carrier bags' },
        { a: 'One-hour HD video call (2 people)', b: 'Up to ~1 kg CO₂e', sub: 'vs ~40 g audio-only; newer studies far lower' },
      ].map((r, i) => (
        <div key={i} className="px-5 py-3.5 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-stone-900">{r.a}</div>
            {r.sub && <div className="text-xs text-stone-500 mt-0.5">{r.sub}</div>}
          </div>
          <div className="text-sm font-mono text-plum-700 flex-shrink-0 text-right">{r.b}</div>
        </div>
      ))}
    </div>
  </div>
</div>

              <div className="bg-gradient-to-br from-plum-600 to-plum-700 text-white p-6 rounded-xl">
                <div className="flex items-start gap-4">
                  <TrendingDown className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">The "dark data" problem</h3>
                    <p className="text-plum-50 text-sm leading-relaxed mb-3">
                      More than half of data collected by typical organizations is collected, processed, and never used again. Globally, dark data generates an estimated <span className="font-semibold text-white">5.8 million tonnes of CO₂ per year — roughly 1.2 million cars.</span>
                    </p>
                    <p className="text-plum-100 text-sm leading-relaxed">
                      This is your single most powerful workshop framing: most of what we store we never touch again, but it keeps drawing power 24/7 and driving demand for new hardware. Deleting it costs nothing and actually makes digital life better.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: CLEANUP */}
          {activeSection === 'cleanup' && (
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-plum-600 font-medium mb-2">Part 02</p>
                <h2 className="text-3xl font-semibold text-stone-900 mb-3">Per-platform cleanup guides</h2>
                <p className="text-stone-600 leading-relaxed">Teachable workflows for each platform. Each includes what counts toward storage, the gotchas users trip over, and step-by-step instructions.</p>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0">
                {platforms.map((p) => {
                  const Icon = p.icon;
                  const active = activePlatform === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setActivePlatform(p.id)}
                      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                        active
                          ? 'bg-stone-900 text-white'
                          : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {p.label}
                    </button>
                  );
                })}
              </div>

              {activePlatform === 'outlook' && (
                <PlatformCard
                  title="Microsoft Outlook / Exchange"
                  counts={[
                    'Inbox, Sent, Drafts, Deleted Items, and Junk all count toward mailbox quota',
                    'The Deleted Items folder counts — deletion only moves items; footprint continues until folder is emptied and the 14–30 day "Recoverable Items" retention elapses',
                    'Archive mailboxes (online archive) do NOT count toward pooled storage for M365 Education tenants',
                  ]}
                  gotchas={[
                    'Archiving ≠ deleting. Archives still store data; for carbon, deletion is stronger.',
                    'Mailing-list bloat: a message to 500 people is stored 500 times.',
                    'A single email with a 10 MB attachment ≈ the footprint of 12 text-only emails.',
                  ]}
                  workflow={[
                    { title: 'Sort by size', detail: 'View → Arrange By → Size. Delete the top 20 largest messages you no longer need.' },
                    { title: 'Search old attachments', detail: 'folder:inbox AND hasattachments:yes AND received:<1/1/2024' },
                    { title: 'Unsubscribe (don\'t delete)', detail: 'Use the Unsubscribe link Outlook surfaces at the top of promotional mail.' },
                    { title: 'Empty Deleted Items and Junk', detail: 'Right-click each folder → Empty Folder.' },
                    { title: 'Set AutoArchive', detail: 'File → Options → Advanced → AutoArchive so it doesn\'t accumulate again.' },
                  ]}
                  timeEstimate="15 minutes"
                />
              )}
              {activePlatform === 'onedrive' && (
                <PlatformCard
                  title="Microsoft OneDrive"
                  counts={[
                    'Every file in your OneDrive, including "Shared with me" items you\'ve added',
                    'File version history — SharePoint/OneDrive keep up to 500 versions by default. A 15 MB PowerPoint with 77 saved versions uses ~1.1 GB.',
                    'Two-stage recycle bins — items sit up to 93 days before storage is actually released',
                    'M365 Education now uses pooled tenant storage (100 TB base + per-license). Many universities cap at 50–100 GB per user.',
                  ]}
                  gotchas={[
                    'Deletion does not immediately free tenant storage — you must empty both recycle bins (or wait 93 days).',
                    'Files under legal hold move to Preservation Hold Library and keep consuming storage until the hold expires.',
                    'Reducing version limits does NOT retroactively trim old versions — these must be explicitly trimmed.',
                    'Shortcut folders from shared drives can silently cause sync issues at 300,000+ items.',
                  ]}
                  workflow={[
                    { title: 'Find your largest files', detail: 'Go to https://[yourtenant]-my.sharepoint.com/largestfiles (enabled by default at many universities).' },
                    { title: 'Sort by date modified', detail: 'Oldest first. Anything untouched in 2+ years is a cleanup candidate.' },
                    { title: 'Empty both recycle bins', detail: 'Recycle Bin, then Second-Stage Recycle Bin. Storage won\'t drop without this step.' },
                    { title: 'Trim version history', detail: 'For large files you edit often, use "Delete previous versions" in the version history panel.' },
                    { title: 'Remove unused shortcuts', detail: 'Clean up Shared with me shortcuts that still pull sync overhead.' },
                  ]}
                  timeEstimate="20 minutes"
                />
              )}
              {activePlatform === 'sharepoint' && (
                <PlatformCard
                  title="SharePoint & Microsoft Teams"
                  counts={[
                    'Every Teams channel has a backing SharePoint site — files in Teams live in SharePoint',
                    'Teams meeting recordings live in OneDrive (non-channel) or SharePoint (channel meetings) — typically the largest files in any tenant',
                    'Teams chat messages are stored in each participant\'s mailbox in a hidden folder',
                    'Orphaned SharePoint sites from ended projects/courses often hold the majority of "zombie" storage',
                  ]}
                  gotchas={[
                    'Teams recordings default to keeping every meeting forever without a retention policy.',
                    'Broad permissions ("Everyone except external") can spread content across many OneDrives — fixing the source doesn\'t fix the copies.',
                    'SharePoint sites have a 25 TB hard ceiling — individual sites can go read-only before the tenant does.',
                  ]}
                  workflow={[
                    { title: 'Identify stale sites', detail: 'M365 Admin Center storage reports → find sites with no access in 12+ months.' },
                    { title: 'Archive cold sites', detail: 'Use Microsoft 365 Archive for sites that must be retained but don\'t need to be hot.' },
                    { title: 'Set recording retention', detail: '60 days is a common default for Teams meeting recordings.' },
                    { title: 'Review version history settings', detail: 'Per library — 500 versions is almost never needed. 10–50 is plenty.' },
                    { title: 'Remember the 93-day clock', detail: 'After any deletion, storage isn\'t released until both recycle bins clear.' },
                  ]}
                  timeEstimate="For site owners & admins"
                />
              )}
              {activePlatform === 'canvas' && (
                <PlatformCard
                  title="Canvas LMS"
                  counts={[
                    'Each Canvas course has a 2 GB file quota by default (configurable per institution)',
                    'Personal Files ("My Files") has its own quota, often ~50 MB',
                    'Course copies duplicate every file — 10 sections of a 1.5 GB course = 15 GB',
                    'Canvas Studio recordings count against quota; Panopto embeds do not',
                  ]}
                  gotchas={[
                    'Canvas does NOT deduplicate across courses — 100 sections with the same 300 MB reading pack = 30 GB.',
                    'Canvas is not a video CDN. Most institutional agreements charge for media overage.',
                    'Instructors commonly re-upload syllabi and slide decks each term rather than linking to a shared source.',
                  ]}
                  workflow={[
                    { title: 'Check quota usage', detail: 'Files → 3-dot menu → Usage Rights & Storage to see what\'s consuming quota.' },
                    { title: 'Replace in-Canvas video', detail: 'Use Panopto/Kaltura embeds or links instead of uploading MP4s.' },
                    { title: 'Centralize readings', detail: 'Host once in SharePoint or library e-reserves; link from Canvas instead of re-uploading per section.' },
                    { title: 'Selective course import', detail: 'When copying courses, use "Select specific content" rather than copying everything.' },
                    { title: 'Archive at term end', detail: 'Conclude or delete old courses via the institution\'s standard process.' },
                  ]}
                  timeEstimate="For instructors"
                />
              )}
              {activePlatform === 'zoom' && (
                <PlatformCard
                  title="Zoom Cloud Recordings"
                  counts={[
                    'MP4 video, audio-only M4A, chat transcript .txt, and VTT caption file — all four per recording',
                    'If Zoom routes recordings to Panopto automatically, files hit both systems briefly',
                    'Enterprise education agreements typically have per-user or pooled caps; exceeding triggers overage',
                  ]}
                  gotchas={[
                    'Default retention varies — often 150 days, but some institutions keep indefinitely. Check your setting.',
                    'A one-hour HD meeting = ~500 MB–1 GB. A year of weekly committee meetings = 25–50 GB for one committee.',
                    'Trash keeps recordings for 30 more days after user deletion, still consuming the quota.',
                  ]}
                  workflow={[
                    { title: 'Open cloud recordings', detail: 'Log into yourinstitution.zoom.us → Recordings → Cloud Recordings.' },
                    { title: 'Sort and delete', detail: 'Oldest first. Delete anything you won\'t reference again.' },
                    { title: 'Empty the Trash', detail: 'Otherwise the 30-day timer holds the quota.' },
                    { title: 'Record locally when possible', detail: 'For personal reference, record to your device rather than the cloud.' },
                    { title: 'Set Panopto as canonical', detail: 'For class recordings, route automatically — don\'t keep duplicates.' },
                    { title: 'Skip recording routine meetings', detail: 'The highest-leverage habit change in a video-heavy institution.' },
                  ]}
                  timeEstimate="10 minutes"
                />
              )}
              {activePlatform === 'panopto' && (
                <PlatformCard
                  title="Panopto"
                  counts={[
                    'Every video in every folder, including personal "My Folder" uploads',
                    'Imported Zoom recordings — often in auto-generated "Meeting Recordings" subfolders with no retention policy',
                    'Multiple transcoded resolutions per source video',
                  ]}
                  gotchas={[
                    'Panopto markets "unlimited" storage but most higher-ed contracts cap it. UB, Northwestern, and others have run cleanup campaigns.',
                    'Archived videos are recoverable but don\'t play on demand until restored (48–72 hours). Users often panic when links break.',
                    'Personal My Folder content is invisible to admins by default — a common hiding place for years-old recordings.',
                  ]}
                  workflow={[
                    { title: 'Meeting recordings', detail: 'Archive after 6 months of no views.' },
                    { title: 'Personal My Folder content', detail: 'Archive after 12 months of no views.' },
                    { title: 'Zero-view old videos', detail: 'Any video older than 3 years with zero views in the past year — archive ahead of schedule.' },
                    { title: 'Course content', detail: 'Align with course lifecycle. Archive at end of term + retention window.' },
                    { title: 'Review every 6 months', detail: 'Admins confirm before bulk actions on shared folders.' },
                  ]}
                  timeEstimate="Retention model"
                />
              )}
            </div>
          )}

          {/* SECTION 3: TOOLS */}
          {activeSection === 'tools' && (
            <div className="space-y-8">
              <div>
                <p className="text-xs uppercase tracking-wider text-plum-600 font-medium mb-2">Part 03</p>
                <h2 className="text-3xl font-semibold text-stone-900 mb-3">Tools to estimate impact</h2>
                <p className="text-stone-600 leading-relaxed">No single perfect calculator exists for higher-ed cloud footprints. Use a mix of tools plus back-of-envelope formulas.</p>
              </div>

              <StorageImpactCalculator />
              <BehaviorSavingsPanel />

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <h3 className="font-semibold text-stone-900 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-plum-600" />
                    For individual end users
                  </h3>
                  <div className="space-y-2">
                    <ToolLink name="Digital Storage Carbon Footprint Calculator" desc="Simple web tool — GB in, CO₂e out. Good for live demos." url="https://agentcalc.com/digital-storage-carbon-footprint-calculator" displayUrl="agentcalc.com/digital-storage-carbon-footprint-calculator" />
                    <ToolLink name="Digital Carbon Footprint (Öko-Institut)" desc="Lifestyle calculator from Öko-Institut (Germany)." url="https://www.digitalcarbonfootprint.eu/" displayUrl="digitalcarbonfootprint.eu" />
                    <ToolLink name="EcoSend Carbon Calculator" desc="Quick email carbon estimator. Useful for before/after metrics." url="https://ecosend.io/carbon-calculator" displayUrl="ecosend.io/carbon-calculator" />
                    <ToolLink name="Carbon Equivalent Calculator" desc="Convert CO₂e savings into relatable metrics (trees, miles, flights)." url="https://www.arbor.eco/carbon-equivalent-calculator" displayUrl="arbor.eco/carbon-equivalent-calculator" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 mb-3 flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-plum-600" />
                    For administrators
                  </h3>
                  <div className="space-y-2">
                    <ToolLink name="Cloud Carbon Footprint" desc="Open-source (Thoughtworks). Most defensible methodology." url="https://www.cloudcarbonfootprint.org/" displayUrl="cloudcarbonfootprint.org" />
                    <ToolLink name="Microsoft Emissions Impact Dashboard" desc="Native M365/Azure tool. Scope 1/2/3 tied to your tenant." url="https://www.microsoft.com/en-us/sustainability/emissions-impact-dashboard" displayUrl="microsoft.com/sustainability" />
                    <ToolLink name="Google Cloud Carbon Footprint" desc="Free for GCP customers. GHG Protocol-compliant." url="https://cloud.google.com/carbon-footprint" displayUrl="cloud.google.com/carbon-footprint" />
                    <ToolLink name="AWS Customer Carbon Footprint Tool" desc="Baseline only — criticized as least transparent of the three." url="https://aws.amazon.com/aws-cost-management/aws-customer-carbon-footprint-tool/" displayUrl="aws.amazon.com" />
                    <ToolLink name="Data Carbon Ladder" desc="Loughborough University research tool — full data lifecycle carbon." url="https://www.lboro.ac.uk/research/news/2022/october/data-carbon-ladder/" displayUrl="lboro.ac.uk" />
                  </div>
                </div>
              </div>

              <div className="bg-stone-900 text-stone-100 p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-semibold text-white">Back-of-envelope formulas</h3>
                </div>
                <p className="text-sm text-stone-400 mb-5">Quick mental math — and a reminder of where the carbon actually is.</p>
                <div className="space-y-4 font-mono text-sm">
                  {[
                    { label: 'STORAGE', note: '≈ 3–8 kg CO₂e per TB·year (operational + amortized manufacturing, grid ~0.4 kg/kWh).', highlight: '1 TB ≈ 3–8 kg · 100 GB ≈ 0.3–0.8 kg.' },
                    { label: 'AT SCALE', note: 'Per person it’s small; per institution it adds up.', highlight: '10,000 accounts × 100 GB ≈ 5 tonnes/year — ~half never accessed again.' },
                    { label: 'EMAIL', note: 'Storing mail is negligible. The ~4 g often quoted is the cost of sending one (device + network) — already spent.', highlight: 'Lever: send less, unsubscribe, skip Reply-All.' },
                    { label: 'VIDEO', note: 'Recordings barely cost anything to store (~1 GB/hr). The carbon is in streaming & recording; 1 hr audio ≈ 4% of HD video.', highlight: 'Lever: don’t record what won’t be rewatched.' },
                    { label: 'PHOTOS', note: '25 GB of duplicates ≈ ~0.1 kg/year to store — tiny each, but it’s disk that had to be manufactured.', highlight: 'Lever: trim duplicates; the win is less storage hardware at scale.' },
                  ].map((f, i, arr) => (
                    <div key={f.label} className={`flex items-start gap-3 pb-4 ${i < arr.length - 1 ? 'border-b border-stone-800' : ''}`}>
                      <span className="text-plum-400 flex-shrink-0 w-20">{f.label}</span>
                      <span className="text-stone-300">{f.note} <span className="text-white">{f.highlight}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: BEHAVIOR */}
          {activeSection === 'behavior' && (
            <div className="space-y-8">
              <div>
                <p className="text-xs uppercase tracking-wider text-plum-600 font-medium mb-2">Part 04</p>
                <h2 className="text-3xl font-semibold text-stone-900 mb-3">Behaviors that make cleanup stick</h2>
                <p className="text-stone-600 leading-relaxed">Cleanup events create a one-time deletion spike. Habits create ongoing reduction. Build the workshop around both.</p>
              </div>

              <div>
                <h3 className="font-semibold text-stone-900 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-plum-600" />
                  Daily hygiene — for individual users
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { t: 'Empty trash weekly', d: 'Deleted Items, Trash, and Recycle Bins. Without this, deletion is theater.' },
                    { t: 'Unsubscribe, don\'t delete', d: 'One unsubscribe prevents hundreds of future emails.' },
                    { t: 'Link, don\'t attach', d: 'Share OneDrive/SharePoint links instead of attaching files in email.' },
                    { t: 'Avoid Reply All', d: 'Each unnecessary recipient multiplies storage and transmission.' },
                    { t: 'Skip the acknowledgment', d: '"Thanks!" and "Got it!" replies carry carbon cost with no information.' },
                    { t: 'Audio-only when possible', d: '1-hr audio call ≈ 4% of the emissions of HD video.' },
                    { t: 'Turn down video quality', d: 'SD vs HD for multi-party calls cuts bandwidth significantly.' },
                    { t: 'Don\'t record unless you\'ll watch', d: 'Most recorded meetings are never viewed.' },
                    { t: 'Be specific with AI prompts', d: 'Vague prompt + 5 follow-ups uses 6x the energy of one good question.' },
                    { t: 'Trim photos monthly', d: 'Deleting blurry shots and duplicates saves embodied carbon.' },
                  ].map((h, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg border border-stone-200">
                      <div className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-leaf flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm text-stone-900">{h.t}</div>
                          <div className="text-xs text-stone-500 mt-1 leading-relaxed">{h.d}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {[
                {
                  icon: Users,
                  heading: 'Procedural — for teams and departments',
                  items: [
                    { t: 'One canonical copy', d: 'Adopt a shared-drive convention. Never "email the attached."' },
                    { t: 'Explicit retention policies', d: 'Choose what to keep, for how long, and why — let the system enforce it.' },
                    { t: 'Cap version history', d: 'Default 500 versions is overkill. 10–50 is almost always enough.' },
                    { t: 'Green email footer', d: '"Please consider the environment before replying. Use links rather than attachments when possible."' },
                    { t: 'Quarterly site reviews', d: 'Archive shared sites / Teams / groups no one is active in.' },
                    { t: 'Recording default OFF', d: 'Flip the default for recurring committee meetings to opt-in.' },
                    { t: 'Offboarding checklist', d: 'Every departing employee\'s OneDrive should be transferred and deleted — not left orphaned.' },
                  ],
                },
                {
                  icon: GraduationCap,
                  heading: 'For instructors',
                  items: [
                    { t: 'Reuse, don\'t re-upload', d: 'Host course materials in library e-reserves or department SharePoint; link from each term\'s course shell.' },
                    { t: 'Transcripts over video', d: 'When content doesn\'t require visual demonstration, prefer slides + transcripts.' },
                    { t: 'Archive old courses', d: 'Concluded courses still consume storage — archive or delete per institutional policy.' },
                    { t: 'Videos in Panopto, not Canvas', d: 'Canvas isn\'t a video CDN. Most Canvas licenses charge for large media overage.' },
                    { t: 'Retire large-upload assignments', d: 'Route student video projects to Panopto or a similar platform.' },
                  ],
                },
                {
                  icon: HardDrive,
                  heading: 'Institutional levers — for IT / enterprise apps teams',
                  items: [
                    { t: 'Publish a retention schedule', d: 'By data type and tier. Make keep-vs-delete a policy decision, not a user decision.' },
                    { t: 'Automate orphan cleanup', d: 'Playbooks to identify and remediate OneDrives/sites from departed users.' },
                    { t: 'Use M365 Archive for cold SharePoint sites', d: 'Recoverable for 4 years; doesn\'t draw on active pooled storage.' },
                    { t: 'Segment by consumption', d: 'Top 1,000 consumers typically account for most usage. Targeted outreach > mass email.' },
                    { t: 'Leverage archive mailboxes', d: 'They don\'t count toward pooled Education storage — a free release valve.' },
                    { t: 'Request green regions', d: 'Hyperscale facilities can be 25% more efficient. Grid carbon intensity varies hugely.' },
                    { t: 'Report progress publicly', d: 'Monthly/quarterly "storage saved" → convert to flights avoided, trees planted equivalent.' },
                  ],
                },
              ].map((section) => {
                const Icon = section.icon;
                return (
                  <div key={section.heading}>
                    <h3 className="font-semibold text-stone-900 mb-3 flex items-center gap-2">
                      <Icon className="w-4 h-4 text-plum-600" />
                      {section.heading}
                    </h3>
                    <div className="bg-white rounded-lg border border-stone-200 divide-y divide-stone-100">
                      {section.items.map((h, i) => (
                        <div key={i} className="p-4 flex items-start gap-3">
                          <ArrowRight className="w-4 h-4 text-plum-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-sm text-stone-900">{h.t}</div>
                            <div className="text-xs text-stone-500 mt-0.5">{h.d}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SECTION 5: EVENT */}
          {activeSection === 'event' && (
            <div className="space-y-8">
              <div>
                <p className="text-xs uppercase tracking-wider text-plum-600 font-medium mb-2">Part 05</p>
                <h2 className="text-3xl font-semibold text-stone-900 mb-3">Running the event</h2>
                <p className="text-stone-600 leading-relaxed">Suggested agenda, communications templates, and success metrics for your workshop.</p>
              </div>

              <div className="bg-plum-50 border border-plum-200 p-5 rounded-xl">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-plum-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-plum-900 mb-1">Tie it to Digital Cleanup Day</h3>
                    <p className="text-sm text-plum-800 leading-relaxed">
                      Join the global initiative by Let's Do It World. The 2023 campaign saw 380,000+ participants across 105 countries delete 12.7 million GB — preventing an estimated 1,742 tonnes of CO₂. Joining a recognized effort gives credibility, promotional assets, and peer benchmarks.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Suggested 60-minute agenda</h3>
                <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                  {[
                    { time: '0:00 – 0:07', title: 'Framing', detail: 'Why the cloud has a carbon cost. Use the per-activity table. Anchor with the dark-data statistic (5.8M tonnes/year ≈ 1.2M cars).', color: 'bg-amber-500' },
                    { time: '0:07 – 0:15', title: 'Baseline', detail: 'Participants check their own storage: OneDrive, mailbox, Zoom/Panopto folders. Each writes down their starting number.', color: 'bg-sky-500' },
                    { time: '0:15 – 0:45', title: 'Hands-on cleanup', detail: 'Walk through per-platform workflows in order. Participants clean as you teach. Keep the pace brisk — prioritize Outlook and OneDrive if time runs short.', color: 'bg-plum-500' },
                    { time: '0:45 – 0:53', title: 'Results & conversion', detail: 'Each participant records their new number. Convert total GB saved to CO₂e. Post the aggregate as a live scoreboard.', color: 'bg-violet-500' },
                    { time: '0:53 – 1:00', title: 'Habits & commitment', detail: 'Each participant picks 3 habits to adopt. Send a follow-up email in 30 days checking on adoption.', color: 'bg-rose-500' },
                  ].map((slot, i) => (
                    <div key={i} className="flex gap-5 p-5 border-b border-stone-100 last:border-b-0">
                      <div className="flex-shrink-0 w-28">
                        <div className="text-xs font-mono text-stone-500">{slot.time}</div>
                      </div>
                      <div className={`w-1 ${slot.color} rounded-full flex-shrink-0`}></div>
                      <div className="flex-1">
                        <div className="font-medium text-stone-900 mb-1">{slot.title}</div>
                        <div className="text-sm text-stone-600 leading-relaxed">{slot.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Pre-event checklist</h3>
                <div className="bg-white rounded-lg border border-stone-200 divide-y divide-stone-100">
                  {[
                    { t: 'Send prep email 1 week before', d: 'Ask attendees NOT to pre-clean — the live session is more impactful.' },
                    { t: 'Confirm temporary quota headroom', d: 'Ensure IT has increased quota for participants over-quota so they can empty recycle bins.' },
                    { t: 'Confirm admin demo access', d: 'For storage reports, large file reports, and any live visualizations.' },
                    { t: 'Recruit table helpers', d: '2–3 per 20 attendees. Cleanup is highly individualized and people get stuck.' },
                  ].map((item, i) => (
                    <div key={i} className="p-4 flex items-start gap-3">
                      <div className="w-5 h-5 rounded border-2 border-stone-300 flex-shrink-0 mt-0.5"></div>
                      <div>
                        <div className="font-medium text-sm text-stone-900">{item.t}</div>
                        <div className="text-xs text-stone-500 mt-0.5">{item.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Communications templates</h3>
                <div className="space-y-3">
                  <TemplateCard
                    title="Pre-event invitation"
                    subject="Earth Day 2026: Clean your cloud, cut your carbon"
                    body={`Hi [Name],\n\nFor Earth Day this year, we're hosting a 90-minute Data Detox workshop — a hands-on session where you'll clean up your cloud storage and see the carbon impact in real time.\n\nWhen: [Date, Time]\nWhere: [Location / Zoom link]\nBring: A laptop and your university credentials\n\nYou don't need to pre-clean anything. The live session is designed to walk you through Outlook, OneDrive, Teams, Zoom, and Panopto in order. Expect to reclaim several GB in the first 30 minutes.\n\nDid you know? Over half of the data organizations store is never used again — but it keeps drawing power 24/7. Globally, that "dark data" generates 5.8 million tonnes of CO₂ per year, roughly equivalent to 1.2 million cars.\n\nRegister here: [Link]\n\n[Your name]`}
                    onCopy={handleCopy}
                    id="invite"
                    copied={copied}
                  />
                  <TemplateCard
                    title="30-day follow-up"
                    subject="How's the cleanup holding up?"
                    body={`Hi [Name],\n\nIt's been 30 days since the Data Detox workshop — quick check-in:\n\n1. Have the 3 habits you picked stuck?\n2. Has your storage held steady, or crept back up?\n3. Any workflow questions we can help with?\n\nThe rebound effect is real. If you've noticed old patterns returning, hit reply and let us know which platform is tripping you up — we'll send specific guidance.\n\nCombined workshop results so far: [X] GB deleted across [Y] participants, equivalent to [Z] kg CO₂e per year.\n\nThanks for being part of this,\n[Your name]`}
                    onCopy={handleCopy}
                    id="followup"
                    copied={copied}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Success metrics</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { t: 'Total GB deleted', d: 'Sum of individual self-reports during the session.' },
                    { t: 'Total CO₂e avoided', d: 'GB × emission factor. Convert to relatable metrics (cars off road, flights avoided).' },
                    { t: 'Retention policies set', d: 'Count of participants who configured at least one retention policy during the session.' },
                    { t: 'Users at manageable quota', d: 'Number brought within institutional limits by event end.' },
                    { t: '30-day follow-up', d: 'Did storage stay down? Rebound is the failure mode to watch for.' },
                    { t: '90-day follow-up', d: 'The true measure of habit adoption vs one-time event effect.' },
                  ].map((m, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg border border-stone-200">
                      <div className="font-medium text-sm text-stone-900">{m.t}</div>
                      <div className="text-xs text-stone-500 mt-1 leading-relaxed">{m.d}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">Acknowledge these at the workshop</h3>
                    <ul className="text-sm text-amber-900 space-y-1.5 leading-relaxed">
                      <li>• Estimates vary widely. Present ranges, not false precision — honesty builds credibility.</li>
                      <li>• Individual digital carbon is small vs flights, driving, heating, diet. Say so, to stay motivated for bigger changes elsewhere.</li>
                      <li>• Rebound effects are real. Deleting 50 GB but streaming 5 more hours of video per week = net negative.</li>
                      <li>• Some content must be retained for legal, accreditation, or research reasons. "Clean up" ≠ "delete everything."</li>
                      <li>• Cloud providers are decarbonizing. Per-GB footprint is declining — biggest wins now come from behavior and retention policies.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-plum-700 text-white mt-12">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 pb-24 md:pb-10">
          <div className="flex flex-col items-center md:items-start gap-3">
            <img src={`${import.meta.env.BASE_URL}ust-signature-white.png`} alt="University of St. Thomas" className="h-10 w-auto" />
            <p className="text-xs text-plum-200">
              ITS Sustainability · Office of Sustainability Initiatives (OSI)
            </p>
          </div>
          <div className="text-xs text-plum-200 text-center md:text-right leading-relaxed max-w-sm">
            A resource for anyone who wants to host a Digital Cleanup event.
            <br />Reduce your digital carbon footprint — one hour at a time.
          </div>
        </div>
      </footer>
    </div>
  );
}

interface WorkflowStep {
  title: string;
  detail: string;
}

interface PlatformCardProps {
  title: string;
  counts: string[];
  gotchas: string[];
  workflow: WorkflowStep[];
  timeEstimate: string;
}

function PlatformCard({ title, counts, gotchas, workflow, timeEstimate }: PlatformCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-stone-200">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-semibold text-stone-900">{title}</h3>
        <span className="text-xs px-3 py-1 bg-plum-100 text-plum-700 rounded-full font-medium">{timeEstimate}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-xs uppercase tracking-wider text-stone-500 font-medium mb-3">What counts toward storage</h4>
          <ul className="space-y-2">
            {counts.map((c, i) => (
              <li key={i} className="text-sm text-stone-700 leading-relaxed flex items-start gap-2">
                <span className="text-plum-600 flex-shrink-0 mt-1">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-wider text-stone-500 font-medium mb-3">Gotchas</h4>
          <ul className="space-y-2">
            {gotchas.map((g, i) => (
              <li key={i} className="text-sm text-stone-700 leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-100 pt-5">
        <h4 className="text-xs uppercase tracking-wider text-stone-500 font-medium mb-3">Teachable workflow</h4>
        <div className="space-y-2">
          {workflow.map((step, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-plum-600 text-white flex items-center justify-center text-xs font-medium flex-shrink-0">{i + 1}</div>
              <div>
                <div className="font-medium text-sm text-stone-900">{step.title}</div>
                <div className="text-xs text-stone-600 mt-0.5 leading-relaxed">{step.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ToolLinkProps {
  name: string;
  desc: string;
  url: string;
  displayUrl?: string;
}

function ToolLink({ name, desc, url, displayUrl }: ToolLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white p-3 rounded-lg border border-stone-200 hover:border-plum-400 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium text-sm text-stone-900 group-hover:text-plum-700 transition-colors">{name}</div>
          <div className="text-xs text-stone-500 mt-0.5 leading-relaxed">{desc}</div>
          {(displayUrl || url) && <div className="text-xs text-plum-600 mt-1 font-mono">{displayUrl || url}</div>}
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-stone-400 flex-shrink-0 mt-1 group-hover:text-plum-600 transition-colors" />
      </div>
    </a>
  );
}

interface TemplateCardProps {
  title: string;
  subject: string;
  body: string;
  onCopy: (text: string, id: string) => void;
  id: string;
  copied: string | null;
}

function TemplateCard({ title, subject, body, onCopy, id, copied }: TemplateCardProps) {
  return (
    <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-stone-100 bg-stone-50">
        <div>
          <div className="font-medium text-sm text-stone-900">{title}</div>
          <div className="text-xs text-stone-500 mt-0.5">Subject: {subject}</div>
        </div>
        <button
          onClick={() => onCopy(`Subject: ${subject}\n\n${body}`, id)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-md hover:border-plum-300 transition-colors"
        >
          {copied === id ? <><Check className="w-3 h-3 text-plum-600" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
        </button>
      </div>
      <div className="p-5">
        <pre className="text-xs text-stone-700 leading-relaxed whitespace-pre-wrap font-sans">{body}</pre>
      </div>
    </div>
  );
}
