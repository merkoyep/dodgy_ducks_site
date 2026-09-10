import plannerData from '../data/plannerData.json';

export const NON_OPTION_COLUMNS = [
  'Item',
  'Price',
  'Type',
  'Early Bird deadline',
  'Dates',
  'Notes',
  'Raw Price (CAD)',
  'Math',
  'Total Cost',
  'Cost PP (24ppl)',
];

const OPTION_ALIASES = {
  'New York': ['new york', 'nyc'],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function extractOptionColumns(dataItems) {
  const firstItem = dataItems?.[0];
  if (!firstItem) return [];

  return Object.keys(firstItem).filter((key) => !NON_OPTION_COLUMNS.includes(key));
}

function normalize(value = '') {
  return String(value).trim().toLowerCase();
}

function totalMatchesOption(total, optionName) {
  const normalizedOption = normalize(optionName);
  const aliases = [normalizedOption, ...(OPTION_ALIASES[optionName] || [])];
  const totalOption = normalize(total.Option);
  const planKey = normalize(total.PlanKey || total['Plan Key'] || total.Id || total.id);
  const details = normalize(total.Details);

  return aliases.some((alias) => (
    planKey === alias ||
    totalOption === alias ||
    details === alias ||
    details.includes(alias)
  ));
}

function findTotalForOption(totalsData, optionName) {
  return (totalsData || []).find((total) => totalMatchesOption(total, optionName)) || {};
}

function orderOptionsByTotalsData(optionColumns, totalsData = []) {
  const remaining = [...optionColumns];
  const ordered = [];

  totalsData.forEach((total) => {
    const idx = remaining.findIndex((optionName) => totalMatchesOption(total, optionName));
    if (idx === -1) return;
    ordered.push(remaining[idx]);
    remaining.splice(idx, 1);
  });

  return [...ordered, ...remaining];
}

export async function fetchPlannerData() {
  const snapshot = clone(plannerData);
  return {
    dataItems: snapshot.dataItems || [],
    totalsData: snapshot.totalsData || [],
    calendarRows: snapshot.calendarRows || [],
    metadata: snapshot.metadata || {},
  };
}

export function processData(dataItems, totalsData) {
  return orderOptionsByTotalsData(extractOptionColumns(dataItems), totalsData).map((col) => {
    const total = findTotalForOption(totalsData, col);

    return {
      id: col,
      name: col,
      details: total.Details || col,
      totalCost: total['Total Team cost'] || 'N/A',
      ppCost: total['PP Cost (24)'] || 'N/A',
      estimatedFlights: total['Estimated: Flights'] || '',
      note: total.Note || total.Notes || total['Season Note'] || '',
      installments: {
        regatta: total['Installment 1: Regatta Fees'] || '0',
        practice: total['Installment 2: Practice Fees'] || '0',
        travel: total['Installment 3: Travel Fees'] || '0',
      },
    };
  });
}

export function buildTotalsDataFromOptions(options, previousTotalsData = []) {
  return (options || []).map((option) => {
    const existing = findTotalForOption(previousTotalsData, option.id);

    return {
      ...existing,
      Option: existing.Option || option.id,
      PlanKey: option.id,
      Details: option.details || option.name || option.id,
      'Total Team cost': option.totalCost || existing['Total Team cost'] || '$0.00',
      'PP Cost (24)': option.ppCost || existing['PP Cost (24)'] || '$0.00',
      'Estimated: Flights': Object.prototype.hasOwnProperty.call(option, 'estimatedFlights')
        ? option.estimatedFlights
        : existing['Estimated: Flights'] || '',
      Note: Object.prototype.hasOwnProperty.call(option, 'note')
        ? option.note
        : existing.Note || existing.Notes || existing['Season Note'] || '',
      'Installment 1: Regatta Fees': option.installments?.regatta || existing['Installment 1: Regatta Fees'] || '$0.00',
      'Installment 2: Practice Fees': option.installments?.practice || existing['Installment 2: Practice Fees'] || '$0.00',
      'Installment 3: Travel Fees': option.installments?.travel || existing['Installment 3: Travel Fees'] || '$0.00',
    };
  });
}

export function buildPlannerDataSnapshot({ dataItems, options, calendarRows, previousData = plannerData }) {
  return {
    version: previousData.version || 1,
    metadata: {
      ...(previousData.metadata || {}),
      updatedAt: new Date().toISOString(),
      notes: 'Production uses this local JSON file as read-only data. Local Vite development can update this file via the edit-mode save API.',
    },
    dataItems: clone(dataItems || []),
    totalsData: buildTotalsDataFromOptions(options || [], previousData.totalsData || []),
    calendarRows: clone(calendarRows || []),
  };
}

export async function savePlannerDataSnapshot(snapshot) {
  if (!import.meta.env.DEV) {
    return { success: false, error: new Error('Local JSON saves are only available while running the Vite dev server.') };
  }

  try {
    const response = await fetch('/api/planner-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snapshot),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return { success: true, ...(await response.json()) };
  } catch (error) {
    console.error('Error saving local planner data:', error);
    return { success: false, error };
  }
}
