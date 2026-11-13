export default function CostSummary({ option, isEditMode = false, onEditFlights = () => {} }) {
  const estimatedFlights = option.estimatedFlights || 'TBD';
  const destinationLabel = option.details || option.name || 'destination';

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
      <div className="flex flex-col gap-5 md:flex-row md:justify-between md:items-start mb-6 pb-6 border-b-2 border-gray-200">
        <div>
          <h2 className="font-display font-normal tracking-wide text-3xl text-gray-800">{option.details}</h2>
          <p className="text-gray-500 mt-2">Travel add-on and estimated flights are shown separately from the main season cost.</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">Team season cost: {option.totalCost}</div>
          <div className="text-4xl font-bold text-primary">{option.ppCost}</div>
          <div className="text-sm text-gray-500">per paddler before travel</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-sm text-gray-600 mb-1">Installment 1</div>
          <div className="text-2xl font-bold text-primary">{option.installments.regatta}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-sm text-gray-600 mb-1">Installment 2</div>
          <div className="text-2xl font-bold text-primary">{option.installments.practice}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <div className="text-sm text-gray-600 mb-1">Travel add-on</div>
          <div className="text-2xl font-bold text-gray-800">{option.travelPP || option.installments.travel}</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <div className="text-sm text-orange-700 mb-1">Estimated flights</div>
          <div className="text-2xl font-bold text-orange-700">{estimatedFlights}</div>
          <div className="text-xs text-orange-700/70 mt-1">Toronto → {destinationLabel}</div>
          {isEditMode && (
            <button
              type="button"
              onClick={onEditFlights}
              className="mt-3 rounded-lg bg-orange-500 px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
            >
              Edit flights
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
