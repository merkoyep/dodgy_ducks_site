import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const SHEET_ID = process.env.SHEET_ID || '1qv0NRdDo0dzK-E2BhnlhNZBfJOgqXBu8LbkN-2KYVCk';
const OUTPUT_PATH = resolve('src/data/plannerData.json');
const BASE_COLUMNS = new Set([
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
]);

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).filter(Boolean).map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce((row, header, index) => {
      row[header] = values[index] || '';
      return row;
    }, {});
  });
}

async function fetchSheet(sheet) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${sheet}: ${response.status} ${response.statusText}`);
  }

  return parseCsv(await response.text());
}

const dataItems = await fetchSheet('Data');
const totalsData = await fetchSheet('Totals');
const allCalendarRows = await fetchSheet('CalendarEvents');
const optionColumns = Object.keys(dataItems[0] || {}).filter((column) => !BASE_COLUMNS.has(column));
const validCalendarOptions = new Set([...optionColumns, 'ALL', '*']);
const calendarRows = allCalendarRows.filter((row) => row.Source !== 'generated' && validCalendarOptions.has(row.Option));

const snapshot = {
  version: 1,
  metadata: {
    source: 'Google Sheets snapshot',
    sourceSheetId: SHEET_ID,
    pulledAt: new Date().toISOString(),
    notes: 'Production uses this local JSON file as read-only data. Local Vite development can update this file via the edit-mode save API.',
  },
  dataItems,
  totalsData,
  calendarRows,
};

await writeFile(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
console.log(`Wrote ${OUTPUT_PATH}`);
console.log(`Data rows: ${dataItems.length}`);
console.log(`Totals rows: ${totalsData.length}`);
console.log(`Calendar override rows: ${calendarRows.length} (from ${allCalendarRows.length})`);
