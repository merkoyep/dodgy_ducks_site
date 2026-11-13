const installments = [
  { label: 'Installment 1', due: 'March 1', key: 'regatta' },
  { label: 'Installment 2', due: 'May 1', key: 'practice' },
  { label: 'Installment 3', due: 'June 15', key: 'travel' },
];

function parseCurrency(value) {
  const amount = parseFloat(String(value || '').replace(/[$,]/g, ''));
  return Number.isFinite(amount) ? amount : 0;
}

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function lineAmount(item) {
  return item['Cost PP (24ppl)'] || item.Price || 'TBD';
}

function buildRoundedInstallments(option) {
  const roundedAmount = 205;
  const originalTotal = installments.reduce((sum, installment) => (
    sum + parseCurrency(option.installments?.[installment.key])
  ), 0);
  const roundedTotal = roundedAmount * installments.length;

  return {
    display: installments.reduce((acc, installment) => ({
      ...acc,
      [installment.key]: formatCurrency(roundedAmount),
    }), {}),
    incidentals: Math.max(0, roundedTotal - originalTotal),
  };
}

function buildPracticeFeeItems(practices) {
  const trainingCamp = practices.find((item) => item.Item === 'Training Camp');

  return practices
    .filter((item) => item.Item !== 'Training Camp')
    .map((item) => {
      if (item.Item !== 'Sunnyside Paddling Fee') return item;

      return {
        ...item,
        Item: 'Dragonboat practices',
        Notes: trainingCamp
          ? 'Includes weekly dragonboat practices and training camp.'
          : 'Includes weekly dragonboat practices.',
        _scheduleLabel: trainingCamp?._scheduleLabel
          ? `Training camp included: ${trainingCamp._scheduleLabel}`
          : item._scheduleLabel,
      };
    });
}

function buildAdditionalCostItems(travelItems, incidentals) {
  return [
    ...travelItems.map((item) => ({
      ...item,
      Item: item.Item === 'Travel 2 nights' ? 'Hotel costs' : item.Item,
    })),
    ...(incidentals > 0
      ? [{ Item: 'Incidentals', 'Cost PP (24ppl)': formatCurrency(incidentals) }]
      : []),
  ];
}

function FeeList({ title, items, emptyText }) {
  return (
    <article className="bg-white/95 rounded-2xl p-8 shadow-2xl ring-1 ring-white/60">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-5">{title}</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.Item} className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div>
                <div className="font-bold text-gray-900">{item.Item}</div>
                {item.Notes && <div className="mt-1 text-sm text-gray-600">{item.Notes}</div>}
                {item._scheduleLabel && <div className="mt-1 text-sm text-gray-600">{item._scheduleLabel}</div>}
              </div>
              <div className="shrink-0 text-right text-lg font-extrabold text-primary">{lineAmount(item)}</div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export default function TeamFees({ option }) {
  const roundedInstallments = buildRoundedInstallments(option);

  return (
    <main className="grid gap-6">
      <section className="bg-white/95 rounded-2xl p-8 shadow-2xl ring-1 ring-white/60">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display font-normal tracking-wide text-4xl text-gray-900">Team Fees</h1>
            <p className="mt-3 max-w-3xl text-gray-700 leading-relaxed">
              Fees are split into three installments: regatta fees, practice fees, and additional costs.
            </p>
          </div>
          <div className="rounded-2xl bg-primary/10 px-6 py-4 text-right">
            <div className="text-sm font-bold uppercase tracking-wider text-primary/80">Total cost</div>
            <div className="text-3xl font-extrabold text-primary">$615.00</div>
            <div className="text-sm text-primary/70">per paddler (based on 24 paddlers)</div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {installments.map((installment) => (
          <article key={installment.label} className="bg-white/95 rounded-2xl p-6 text-center shadow-2xl ring-1 ring-white/60">
            <div className="text-sm font-black uppercase tracking-[0.18em] text-gray-500">{installment.label}</div>
            <div className="mt-2 text-lg font-bold text-gray-800">Due {installment.due}</div>
            <div className="mt-4 text-3xl font-extrabold text-primary">{roundedInstallments.display[installment.key]}</div>
          </article>
        ))}
      </section>

    </main>
  );
}
