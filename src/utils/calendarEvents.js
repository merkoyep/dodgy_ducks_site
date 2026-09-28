export const MONTHS_DATA = [
  { name: 'January', days: 31, startDay: 5 },
  { name: 'February', days: 28, startDay: 1 },
  { name: 'March', days: 31, startDay: 1 },
  { name: 'April', days: 30, startDay: 4 },
  { name: 'May', days: 31, startDay: 6 },
  { name: 'June', days: 30, startDay: 2 },
  { name: 'July', days: 31, startDay: 4 },
  { name: 'August', days: 31, startDay: 0 },
  { name: 'September', days: 30, startDay: 3 },
  { name: 'October', days: 31, startDay: 5 },
  { name: 'November', days: 30, startDay: 1 },
];

export function formatDate(dateStr) {
  if (!dateStr) return '';

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const multiDay = dateStr.match(/(\d+)\/(\d+)\s+(\d+)\/(\d+)/) || dateStr.match(/(\d+)\/(\d+)-(?:\d+\/)?(\d+)/);
  if (multiDay) {
    const month = parseInt(multiDay[1]);
    const day1 = parseInt(multiDay[2]);
    const day2 = parseInt(multiDay[4] || multiDay[3]);
    return `${monthNames[month - 1]} ${day1}-${day2}`;
  }

  const singleDay = dateStr.match(/(\d+)\/(\d+)/);
  if (singleDay) {
    const month = parseInt(singleDay[1]);
    const day = parseInt(singleDay[2]);
    return `${monthNames[month - 1]} ${day}`;
  }

  return dateStr;
}

export function buildCalendarEventsFromRows(calendarRows, selectedOption) {
  const eventsByDate = {};
  const removalKeys = new Set();

  (calendarRows || []).forEach((row) => {
    if (!row.Date || row.Date === 'Date') return;
    if (!(row.Option === selectedOption || row.Option === 'ALL' || row.Option === '*')) return;
    if (row.Source === 'removed') {
      removalKeys.add(`${row.Option}:${row.Date}:${row.EventName}:${row.Type}`);
    }
  });

  (calendarRows || []).forEach((row) => {
    if (!row.Date || row.Date === 'Date') return;
    if (!(row.Option === selectedOption || row.Option === 'ALL' || row.Option === '*')) return;
    if (row.Source === 'removed') return;

    const removalKey = `${row.Option}:${row.Date}:${row.EventName}:${row.Type}`;
    if (removalKeys.has(removalKey)) return;

    const key = row.Date;
    if (!eventsByDate[key]) eventsByDate[key] = [];

    eventsByDate[key].push({
      name: row.EventName,
      type: row.Type,
      fullName: row.Notes ? `${row.EventName} (${row.Notes})` : row.EventName,
      source: row.Source || 'sheet',
      notes: row.Notes || ''
    });
  });

  Object.keys(eventsByDate).forEach((key) => {
    eventsByDate[key].sort((a, b) => {
      const order = { FeesDue: 0, Holiday: 1, Regatta: 2, Practice: 3, Travel: 4 };
      return (order[a.type] ?? 99) - (order[b.type] ?? 99);
    });
  });

  return eventsByDate;
}

function parseDateKeys(dateStr) {
  const matches = dateStr?.match(/(\d+)\/(\d+)/g) || [];
  return matches.map((match) => {
    const [month, day] = match.split('/').map(Number);
    return { key: `${month}-${day}`, month, day };
  });
}

function getLastRegattaValue(items) {
  let last = null;
  items.forEach((item) => {
    if (item.Type !== 'Regatta') return;
    parseDateKeys(item.Dates).forEach(({ month, day }) => {
      const value = month * 100 + day;
      if (last === null || value > last) last = value;
    });
  });
  return last;
}

function push(rows, row) {
  rows.push(row);
}

export function seededStaticRows() {
  return [
    ['3-1', 'Fees Due', 'FeesDue', 'ALL', 'generated', 'Installment 1'],
    ['5-1', 'Fees Due', 'FeesDue', 'ALL', 'generated', 'Installment 2'],
    ['6-15', 'Fees Due', 'FeesDue', 'ALL', 'generated', 'Installment 3'],
    ['1-1', "New Year’s Day", 'Holiday', 'ALL', 'generated', 'Ontario Holiday'],
    ['2-15', 'Family Day', 'Holiday', 'ALL', 'generated', 'Ontario Holiday'],
    ['4-2', 'Good Friday', 'Holiday', 'ALL', 'generated', 'Ontario Holiday'],
    ['5-24', 'Victoria Day', 'Holiday', 'ALL', 'generated', 'Ontario Holiday'],
    ['7-1', 'Canada Day', 'Holiday', 'ALL', 'generated', 'Ontario Holiday'],
    ['8-2', 'Civic Holiday', 'Holiday', 'ALL', 'generated', 'Ontario Holiday'],
    ['9-6', 'Labour Day', 'Holiday', 'ALL', 'generated', 'Ontario Holiday'],
    ['10-11', 'Thanksgiving', 'Holiday', 'ALL', 'generated', 'Ontario Holiday'],
  ];
}

export function generateSeedCalendarRowsForOption(optionId, optionItems) {
  const rows = [];
  const lastRegattaValue = getLastRegattaValue(optionItems);

  const allDbPracticeWednesdays = [
    ['5-5', 505], ['5-12', 512], ['5-19', 519], ['5-26', 526],
    ['6-2', 602], ['6-9', 609], ['6-16', 616], ['6-23', 623], ['6-30', 630],
    ['7-7', 707], ['7-14', 714], ['7-21', 721], ['7-28', 728],
    ['8-4', 804], ['8-11', 811], ['8-18', 818], ['8-25', 825],
    ['9-1', 901], ['9-8', 908], ['9-15', 915], ['9-22', 922], ['9-29', 929],
  ];

  const allOutriggerSundays = [
    ['5-2', 502], ['5-9', 509], ['5-16', 516], ['5-23', 523], ['5-30', 530],
    ['6-6', 606], ['6-13', 613], ['6-20', 620], ['6-27', 627],
    ['7-4', 704], ['7-11', 711], ['7-18', 718], ['7-25', 725],
    ['8-1', 801], ['8-8', 808], ['8-15', 815], ['8-22', 822], ['8-29', 829],
    ['9-5', 905], ['9-12', 912],
  ];

  const regattaDates = new Set();
  optionItems
    .filter((item) => item.Type === 'Regatta')
    .forEach((item) => {
      parseDateKeys(item.Dates).forEach(({ key }) => {
        regattaDates.add(key);
        push(rows, [key, item.Item, 'Regatta', optionId, 'generated', formatDate(item.Dates)]);
      });
    });

  optionItems
    .filter((item) => item.Type === 'Practice' && item.Item === 'Afterburn')
    .forEach((item) => {
      ['1-3', '1-10', '1-17', '1-24', '1-31', '2-7', '2-14', '2-21', '2-28', '3-7', '3-14', '3-21', '3-28', '4-4', '4-11', '4-18', '4-25'].forEach((key) => {
        push(rows, [key, 'Afterburn', 'Practice', optionId, 'generated', 'Sundays Jan-Apr']);
      });
    });

  optionItems
    .filter((item) => item.Type === 'Practice' && item.Item !== 'Afterburn' && item.Item !== 'Sunnyside Paddling Fee' && item.Item !== 'Sunnyside Membership' && item.Item !== 'Sunnyside Paddling Fee: Partner')
    .forEach((item) => {
      parseDateKeys(item.Dates).forEach(({ key }) => {
        push(rows, [key, item.Item, 'Practice', optionId, 'generated', formatDate(item.Dates)]);
      });
    });

  const practicesAfterLastRegatta = lastRegattaValue
    ? allDbPracticeWednesdays.filter(([, value]) => value > lastRegattaValue).length
    : 0;

  allDbPracticeWednesdays.forEach(([key, value]) => {
    if (lastRegattaValue && value > lastRegattaValue) return;
    push(rows, [key, 'Dragonboat Practice', 'Practice', optionId, 'generated', 'Wednesdays 7:15pm–8:45pm @ Sunnyside']);
  });

  const replaceableSundays = allOutriggerSundays.filter(([, value]) => !lastRegattaValue || value < lastRegattaValue);
  let replaced = 0;
  for (let i = replaceableSundays.length - 1; i >= 0 && replaced < practicesAfterLastRegatta; i--) {
    const [key] = replaceableSundays[i];
    if (regattaDates.has(key)) continue;
    push(rows, [key, 'Dragonboat Practice', 'Practice', optionId, 'generated', 'Replacement for Outrigger']);
    replaced += 1;
  }

  allOutriggerSundays.forEach(([key]) => {
    if (regattaDates.has(key)) return;
    const hasDragonboat = rows.some((row) => row[0] === key && row[1] === 'Dragonboat Practice' && row[3] === optionId);
    if (!hasDragonboat) {
      push(rows, [key, 'Outrigger Practice', 'Practice', optionId, 'generated', 'Sundays May-Sep']);
    }
  });

  return rows;
}

export function convertSeedRowsToObjects(rows) {
  return rows.map(([Date, EventName, Type, Option, Source, Notes]) => ({
    Date,
    EventName,
    Type,
    Option,
    Source,
    Notes,
  }));
}
