import { describe, expect, it } from 'vitest';
import {
  buildPlannerDataSnapshot,
  buildTotalsDataFromOptions,
  extractOptionColumns,
  fetchPlannerData,
  processData,
} from './dataFetcher';

describe('local planner data', () => {
  it('loads cloned local JSON data', async () => {
    const first = await fetchPlannerData();
    const second = await fetchPlannerData();

    first.dataItems[0].Item = 'Mutated';
    expect(second.dataItems[0].Item).not.toBe('Mutated');
    expect(second.dataItems.length).toBeGreaterThan(0);
    expect(second.calendarRows.every((row) => row.Source !== 'generated')).toBe(true);
  });

  it('extracts season plan columns and processes display metadata', () => {
    const dataItems = [{
      Item: 'Uniforms',
      Price: '$50 PP',
      Type: 'Jersey',
      Dates: '',
      Notes: '',
      'Total Cost': '1200',
      Local: 'TRUE',
      'New York': 'FALSE',
    }];
    const totalsData = [
      { Option: 'A', Details: 'Local Only', 'Total Team cost': '$1200.00', 'PP Cost (24)': '$50.00', 'Estimated: Flights': '$0.00' },
      { Option: 'F', Details: 'NYC', 'Total Team cost': '$2400.00', 'PP Cost (24)': '$100.00', 'Estimated: Flights': '$500.00' },
    ];

    expect(extractOptionColumns(dataItems)).toEqual(['Local', 'New York']);
    expect(processData(dataItems, totalsData)).toEqual([
      expect.objectContaining({ id: 'Local', details: 'Local Only', totalCost: '$1200.00', estimatedFlights: '$0.00' }),
      expect.objectContaining({ id: 'New York', details: 'NYC', totalCost: '$2400.00', estimatedFlights: '$500.00' }),
    ]);
  });

  it('builds a savable JSON snapshot that preserves plan details', () => {
    const options = [
      { id: 'Local', name: 'Local', details: 'Local Only', totalCost: '$10.00', ppCost: '$1.00', estimatedFlights: '$0.00', installments: { regatta: '$1.00', practice: '$2.00', travel: '$3.00' } },
      { id: 'New Plan', name: 'New Plan', details: 'Experimental Plan', totalCost: '$0.00', ppCost: '$0.00', installments: {} },
    ];

    const totalsData = buildTotalsDataFromOptions(options, []);
    expect(totalsData).toContainEqual(expect.objectContaining({ Option: 'New Plan', Details: 'Experimental Plan' }));
    expect(totalsData).toContainEqual(expect.objectContaining({ PlanKey: 'Local', 'Estimated: Flights': '$0.00' }));

    const snapshot = buildPlannerDataSnapshot({
      dataItems: [{ Item: 'Uniforms', Local: 'TRUE', 'New Plan': 'FALSE' }],
      options,
      calendarRows: [{ Date: '5-6', EventName: 'Afterburn', Type: 'Practice', Option: 'Local', Source: 'manual', Notes: '' }],
      previousData: { version: 7, metadata: { source: 'test' }, totalsData: [] },
    });

    expect(snapshot.version).toBe(7);
    expect(snapshot.metadata).toMatchObject({ source: 'test' });
    expect(snapshot.totalsData).toContainEqual(expect.objectContaining({ Details: 'Experimental Plan' }));
  });
});
