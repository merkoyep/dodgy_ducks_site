import Calendar from './Calendar';
import { formatDate } from '../utils/calendarEvents';

function getRegattaDateLabel(item) {
  if (/canada dry victoria dbf/i.test(item.Item)) return 'Mid August - Date TBD';
  return formatDate(item.Dates);
}

function getRegattaDetail(item, seasonNote) {
  if (/victoria/i.test(item.Item)) {
    return seasonNote || 'Travel regatta selected by the team vote.';
  }

  if (/toronto island/i.test(item.Item)) {
    return 'Local core regatta weekend in Toronto.';
  }

  if (/christie lake/i.test(item.Item)) {
    return 'Late-season local core regatta.';
  }

  return item.Notes || 'Core regatta on the Victoria season schedule.';
}

export default function SeasonSchedule({ events, regattas, seasonNote }) {
  const scheduleEvents = Object.fromEntries(
    Object.entries(events || {})
      .map(([date, dayEvents]) => [date, dayEvents.filter((event) => event.type !== 'FeesDue')])
      .filter(([, dayEvents]) => dayEvents.length > 0)
  );

  return (
    <main className="grid gap-6">
      <section className="bg-white/95 rounded-2xl p-8 shadow-2xl ring-1 ring-white/60">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-primary">
              Victoria Season
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900">Season Schedule</h1>
            <p className="mt-3 max-w-3xl text-gray-700 leading-relaxed">
              The calendar below shows the planned season events, practices, holidays, and regattas for the Victoria plan.
            </p>
          </div>
        </div>
      </section>

      <Calendar events={scheduleEvents} isEditMode={false} />

      <section className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <div className="bg-white/95 rounded-2xl p-8 shadow-2xl ring-1 ring-white/60">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Regatta details</h2>
          <div className="grid gap-4">
            {regattas.map((item) => (
              <article key={item.Item} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{item.Item}</h3>
                    <p className="mt-2 text-gray-700 leading-relaxed">{getRegattaDetail(item, seasonNote)}</p>
                  </div>
                  {item.Dates && (
                    <div className="shrink-0 rounded-full bg-red-100 px-4 py-2 text-sm font-black text-red-700">
                      {getRegattaDateLabel(item)}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="bg-slate-950/45 backdrop-blur-md border border-white/30 rounded-2xl p-8 text-white shadow-2xl">
          <h2 className="text-2xl font-extrabold mb-4">Attendance expectations</h2>
          <div className="space-y-4 text-white/85 leading-relaxed">
            <p>
              Per the constitution, the expected in-season commitment is an average of at least one Team training session per week from May through September.
            </p>
            <p>
              The primary training session is dragonboat practice. If a member cannot attend that week’s dragonboat practice, a Team outrigger canoe practice may count toward the weekly participation expectation.
            </p>
            <p>
              Members are responsible for keeping availability current and communicating absences as soon as reasonably possible. Persistent inability to participate may affect practice or race rostering.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
