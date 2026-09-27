const bringItems = [
  'Water bottle',
  'Running shoes',
  'Water shoes / Crocs (optional)',
  'Clothes to get wet in',
  'Quarters for lockers',
];

export default function PracticesPage() {
  return (
    <main className="grid gap-6">
      <section className="bg-white/95 rounded-2xl p-8 shadow-2xl ring-1 ring-white/60">
        <div className="mb-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-primary">
          Training Plan
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900">Practices</h1>
        <p className="mt-3 max-w-3xl text-gray-700 leading-relaxed">
          The Victoria season uses one weekly dragonboat practice as the core team session, with optional outrigger canoe drop-ins for extra technique and small-group coaching.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="bg-white/95 rounded-2xl p-8 shadow-2xl ring-1 ring-white/60">
          <div className="mb-4 inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-green-700">
            Core team session
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Dragonboat practices</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Dragonboat practices are currently planned for Wednesdays from 7:15pm–8:45pm.
            </p>
            <p>
              These are the primary team training sessions and the main weekly commitment for the season.
            </p>
          </div>
        </article>

        <article className="bg-white/95 rounded-2xl p-8 shadow-2xl ring-1 ring-white/60">
          <div className="mb-4 inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
            Optional
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Outrigger canoe practices</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Optional outrigger canoe practices will run on Sunday mornings on a drop-in basis. The coach will be there for a few hours for small-group support.
            </p>
            <p>
              Paddlers need to book their own OCs at Sunnyside. As members, we get a discount on booking fees; interested folks can also get a Sunnyside membership.
            </p>
            <p>
              The core focus is paddling technique, paddling efficiency in the water, and a combination of distance and interval-based workouts.
            </p>
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="bg-white/95 rounded-2xl p-8 shadow-2xl ring-1 ring-white/60">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">What to bring</h2>
          <ul className="grid gap-3 text-gray-700">
            {bringItems.map((item) => (
              <li key={item} className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 font-semibold">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="bg-slate-950/45 backdrop-blur-md border border-white/30 rounded-2xl p-8 text-white shadow-2xl">
          <h2 className="text-2xl font-extrabold mb-4">What to expect</h2>
          <div className="space-y-4 text-white/85 leading-relaxed">
            <p>
              Practices typically start with on-land warmups, followed by an on-water warmup.
            </p>
            <p>
              From there, the team will work through a combination of technique drills and workouts, then finish with a team debrief.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
