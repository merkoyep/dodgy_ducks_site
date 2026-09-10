import TeamSizeInput from './TeamSizeInput';

export default function PlanSelector({
  option,
  teamSize,
  onTeamSizeChange,
  isEditMode,
  onBack,
  onOpenAddPlan,
  onDeletePlan,
  onEditTitle,
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
      <div className="flex flex-wrap items-end gap-4">
        <button
          type="button"
          onClick={onBack}
          className="bg-white/15 hover:bg-white/25 text-white px-5 py-3 rounded-lg font-semibold border border-white/40 shadow-lg"
        >
          ← Back to plans
        </button>
        <div>
          <div className="block text-white text-lg font-semibold mb-2">Season Plan</div>
          <div className="bg-white rounded-lg border-2 border-white px-5 py-3 min-w-[300px] shadow-lg flex items-center justify-between gap-4">
            <div className="text-base font-bold text-gray-900">{option?.details || option?.name}</div>
            {isEditMode && (
              <button
                type="button"
                onClick={onEditTitle}
                className="text-sm font-bold text-primary hover:text-primary/80 whitespace-nowrap"
              >
                Edit title
              </button>
            )}
          </div>
        </div>
        <TeamSizeInput teamSize={teamSize} onTeamSizeChange={onTeamSizeChange} light />
      </div>

      {isEditMode && (
        <div className="flex gap-3">
          <button
            onClick={onOpenAddPlan}
            className="bg-white/15 hover:bg-white/25 text-white px-5 py-3 rounded-lg font-semibold border border-white/40 shadow-lg"
          >
            + Add Season Plan
          </button>
          <button
            onClick={onDeletePlan}
            className="bg-red-500/90 hover:bg-red-600 text-white px-5 py-3 rounded-lg font-semibold border border-white/20 shadow-lg"
          >
            Delete Plan
          </button>
        </div>
      )}
    </div>
  );
}
