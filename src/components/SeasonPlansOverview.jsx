import { useState } from 'react';
import TeamSizeInput from './TeamSizeInput';
import { formatDate } from '../utils/calendarEvents';

function Stat({ label, value }) {
  return (
    <div className="bg-blue-50 rounded-xl p-3 text-center">
      <div className="text-2xl font-extrabold text-primary">{value}</div>
      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</div>
    </div>
  );
}

function formatCurrency(value) {
  const parsed = parseFloat(String(value || '').replace(/[$,\s]/g, ''));
  if (!Number.isFinite(parsed)) return value || '$0.00';
  return `$${parsed.toLocaleString('en-CA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).replace(/,/g, ' ')}`;
}

export default function SeasonPlansOverview({
  summaries,
  regattas,
  teamSize,
  onTeamSizeChange,
  onOpenPlan,
  isEditMode,
  onOpenAddPlan,
  onReorderPlans,
}) {
  const [draggedPlanId, setDraggedPlanId] = useState(null);

  const handleDrop = (targetPlanId) => {
    if (!isEditMode || !draggedPlanId || draggedPlanId === targetPlanId) return;
    onReorderPlans(draggedPlanId, targetPlanId);
    setDraggedPlanId(null);
  };

  return (
    <main className="space-y-8">
      <section className="bg-white/95 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.25em] text-primary mb-3">Season Plans</div>
            <h2 className="font-display font-normal tracking-wide text-4xl text-gray-900 mb-3">Compare the season options</h2>
            <p className="text-gray-600 max-w-3xl leading-relaxed">
              A high-level cross-section for admins to compare cost, regattas, practices, and travel at a glance.
              Click any plan to open the detailed season view.
            </p>
            {isEditMode && (
              <p className="text-sm text-gray-500 mt-3">Drag and drop plan cards to rearrange this dashboard.</p>
            )}
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <TeamSizeInput teamSize={teamSize} onTeamSizeChange={onTeamSizeChange} />
            {isEditMode && (
              <button
                type="button"
                onClick={onOpenAddPlan}
                className="bg-primary hover:bg-primary/90 text-white px-5 py-3 rounded-lg font-semibold shadow-lg"
              >
                + Add Season Plan
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {summaries.map((summary) => (
          <button
            type="button"
            key={summary.id}
            draggable={isEditMode}
            onDragStart={() => setDraggedPlanId(summary.id)}
            onDragEnd={() => setDraggedPlanId(null)}
            onDragOver={(e) => isEditMode && e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(summary.id);
            }}
            onClick={() => onOpenPlan(summary.id)}
            className={`h-full flex flex-col items-stretch justify-start bg-white rounded-2xl p-6 shadow-xl text-left hover:-translate-y-1 hover:shadow-2xl transition-all border focus:outline-none focus:ring-4 focus:ring-white/40 ${
              draggedPlanId === summary.id ? 'opacity-60 border-primary' : 'border-white/70'
            } ${isEditMode ? 'cursor-move' : ''}`}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900">{summary.details || summary.name}</h3>
                <div className="text-sm text-gray-500">{summary.regattaCount} regattas • {summary.practiceCount} practices</div>
                {summary.dateRangeLabel && (
                  <div className="text-sm font-semibold text-primary mt-1">{summary.dateRangeLabel}</div>
                )}
              </div>
              <div className="text-right shrink-0">
                <div className="text-3xl font-extrabold text-primary">{summary.totalWithTravelPP || summary.ppCost}</div>
                <div className="text-xs text-gray-500">per paddler, incl. travel</div>
              </div>
            </div>

            {summary.note && (
              <p className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-sm text-gray-700 mb-4 whitespace-pre-wrap">
                {summary.note}
              </p>
            )}

            <div className="grid grid-cols-3 gap-3 mb-4">
              <Stat label="Regattas" value={summary.regattaCount} />
              <Stat label="Practices" value={summary.practiceCount} />
              <Stat label="Afterburn" value={summary.afterburnCount} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 mb-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Total Team Expenditures</div>
                <div className="text-lg font-bold text-gray-900">{formatCurrency(summary.totalWithTravelCost || summary.totalCost)}</div>
                <div className="text-xs text-gray-500">team total, incl. travel add-on</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-1">Estimated flights</div>
                <div className="text-lg font-bold text-orange-700">{summary.estimatedFlights || 'TBD'}</div>
                <div className="text-xs text-orange-700/70">Toronto → {summary.details || summary.name}</div>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Included regattas</div>
              {summary.regattaDetails.length ? (
                <ul className="text-sm text-gray-700 space-y-1">
                  {summary.regattaDetails.map((regatta) => {
                    const dateLabel = formatDate(regatta.Dates);
                    return (
                      <li key={regatta.Item}>- {regatta.Item}{dateLabel ? `, ${dateLabel}` : ''}</li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-sm text-gray-500">No regattas</div>
              )}
            </div>
          </button>
        ))}
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-5">
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900">Regatta inclusion matrix</h3>
            <p className="text-gray-600">See which season plans include each possible race.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 pr-4 font-bold text-gray-700 sticky left-0 bg-white">Regatta</th>
                <th className="text-left py-3 px-3 font-bold text-gray-700">Date</th>
                {summaries.map((summary) => (
                  <th key={summary.id} className="text-center py-3 px-3 font-bold text-gray-700 whitespace-nowrap">
                    {summary.details || summary.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {regattas.map((regatta) => (
                <tr key={regatta.Item} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 pr-4 font-semibold text-gray-800 sticky left-0 bg-white">{regatta.Item}</td>
                  <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{formatDate(regatta.Dates)}</td>
                  {summaries.map((summary) => (
                    <td key={`${regatta.Item}-${summary.id}`} className="py-3 px-3 text-center">
                      {regatta[summary.id] === 'TRUE' ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700 font-bold">✓</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
