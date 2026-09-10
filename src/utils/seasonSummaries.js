import { buildCalendarEventsFromRows, convertSeedRowsToObjects, generateSeedCalendarRowsForOption, seededStaticRows, MONTHS_DATA } from './calendarEvents';
import { recalculateItemCosts, recalculateTotals } from './costCalculator';

function optionCalendarEvents(dataItems, calendarRows, optionId) {
  const optionItems = dataItems.filter((item) => item[optionId] === 'TRUE');
  const generatedRows = convertSeedRowsToObjects([
    ...seededStaticRows(),
    ...generateSeedCalendarRowsForOption(optionId, optionItems),
  ]);
  const manualRows = (calendarRows || []).filter((row) => row.Source !== 'generated');

  return buildCalendarEventsFromRows([...generatedRows, ...manualRows], optionId);
}

function dateValueFromKey(key) {
  const [month, day] = String(key).split('-').map(Number);
  if (!Number.isFinite(month) || !Number.isFinite(day)) return null;
  return { key, month, day, value: month * 100 + day };
}

function formatDateKey(key) {
  const parsed = dateValueFromKey(key);
  if (!parsed) return '';
  return `${MONTHS_DATA[parsed.month - 1]?.name || parsed.month} ${parsed.day}`;
}

function getDateRangeLabel(calendarEvents) {
  const eventDates = [];

  Object.entries(calendarEvents || {}).forEach(([key, events]) => {
    const hasSeasonEvent = (events || []).some((event) => !['FeesDue', 'Holiday'].includes(event.type));
    if (!hasSeasonEvent) return;

    const parsed = dateValueFromKey(key);
    if (parsed) eventDates.push(parsed);
  });

  if (eventDates.length === 0) return '';

  eventDates.sort((a, b) => a.value - b.value);
  const first = eventDates[0].key;
  const last = eventDates[eventDates.length - 1].key;

  return first === last
    ? formatDateKey(first)
    : `${formatDateKey(first)} to ${formatDateKey(last)}`;
}

function itemDateValue(item) {
  const match = item?.Dates?.match(/(\d+)\/(\d+)/);
  if (!match) return Number.MAX_SAFE_INTEGER;
  return parseInt(match[1], 10) * 100 + parseInt(match[2], 10);
}

export function buildSeasonSummary(option, dataItems, calendarRows, teamSize) {
  const calendarEvents = optionCalendarEvents(dataItems, calendarRows, option.id);
  const calculatedItems = recalculateItemCosts(dataItems, option.id, teamSize, calendarEvents);
  const selectedItems = calculatedItems.filter((item) => item[option.id] === 'TRUE');
  const totals = recalculateTotals(calculatedItems, option.id, teamSize, calendarEvents);
  const regattaDetails = selectedItems
    .filter((item) => item.Type === 'Regatta')
    .sort((a, b) => itemDateValue(a) - itemDateValue(b) || a.Item.localeCompare(b.Item));
  const regattas = regattaDetails.map((item) => item.Item);
  const travelItems = selectedItems
    .filter((item) => item.Type === 'Travel')
    .map((item) => item.Item);

  return {
    ...option,
    ...totals,
    dateRangeLabel: getDateRangeLabel(calendarEvents),
    regattaCount: regattas.length,
    regattas,
    regattaDetails,
    travelItems,
  };
}

export function buildSeasonSummaries(options, dataItems, calendarRows, teamSize) {
  return (options || []).map((option) => buildSeasonSummary(option, dataItems || [], calendarRows || [], teamSize));
}
