const SHEET_ID = '1qv0NRdDo0dzK-E2BhnlhNZBfJOgqXBu8LbkN-2KYVCk';
import { generateSeedCalendarRowsForOption } from '../src/utils/calendarEvents.js';

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    rows.push(row);
  }
  return rows;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') inQuotes = !inQuotes;
    else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else current += char;
  }
  result.push(current.trim());
  return result;
}

const dataText = await fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Data`).then(r => r.text());
const dataItems = parseCSV(dataText);

const staticRows = [
  ['Date','EventName','Type','Option','Source','Notes'],
  ['1-1','Fees Due','FeesDue','ALL','generated','Installment 1'],
  ['4-15','Fees Due','FeesDue','ALL','generated','Installment 2'],
  ['6-1','Fees Due','FeesDue','ALL','generated','Installment 3'],
  ['1-1',"New Year’s Day",'Holiday','ALL','generated','Ontario Holiday'],
  ['2-15','Family Day','Holiday','ALL','generated','Ontario Holiday'],
  ['4-2','Good Friday','Holiday','ALL','generated','Ontario Holiday'],
  ['5-24','Victoria Day','Holiday','ALL','generated','Ontario Holiday'],
  ['7-1','Canada Day','Holiday','ALL','generated','Ontario Holiday'],
  ['8-2','Civic Holiday','Holiday','ALL','generated','Ontario Holiday'],
  ['9-6','Labour Day','Holiday','ALL','generated','Ontario Holiday'],
  ['10-11','Thanksgiving','Holiday','ALL','generated','Ontario Holiday'],
];

const baseCols = ['Item','Price','Type','Early Bird deadline','Dates','Notes','Raw Price (CAD)','Math','Total Cost','Cost PP (24ppl)'];
const optionColumns = Object.keys(dataItems[0]).filter((k) => !baseCols.includes(k));

const rows = [...staticRows];
for (const optionId of optionColumns) {
  const optionItems = dataItems.filter((item) => item[optionId] === 'TRUE');
  const seeded = generateSeedCalendarRowsForOption(optionId, optionItems);
  rows.push(...seeded);
}

const csv = rows.map((row) => row.map((cell) => {
  const s = String(cell ?? '');
  return s.includes(',') ? `"${s.replace(/"/g, '""')}"` : s;
}).join(',')).join('\n');

process.stdout.write(csv);
