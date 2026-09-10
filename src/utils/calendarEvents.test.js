import { describe, expect, it } from 'vitest';
import {
  buildCalendarEventsFromRows,
  convertSeedRowsToObjects,
  formatDate,
  generateSeedCalendarRowsForOption,
  seededStaticRows,
} from './calendarEvents';

describe('calendar events', () => {
  it('formats planner date strings for display', () => {
    expect(formatDate('6/12')).toBe('June 12');
    expect(formatDate('6/12 6/13')).toBe('June 12-13');
    expect(formatDate('TBD')).toBe('TBD');
  });

  it('builds sorted events and honors removed overrides', () => {
    const rows = [
      { Date: '5-6', EventName: 'Dragonboat Practice', Type: 'Practice', Option: 'Local', Source: 'generated', Notes: '' },
      { Date: '5-6', EventName: 'Dragonboat Practice', Type: 'Practice', Option: 'Local', Source: 'removed', Notes: '' },
      { Date: '5-6', EventName: 'Fees Due', Type: 'FeesDue', Option: 'ALL', Source: 'generated', Notes: 'Installment 2' },
      { Date: '5-6', EventName: 'Afterburn', Type: 'Practice', Option: 'Local', Source: 'manual', Notes: 'Added via app' },
      { Date: '5-6', EventName: 'Other Plan Practice', Type: 'Practice', Option: 'Concord', Source: 'manual', Notes: '' },
    ];

    const events = buildCalendarEventsFromRows(rows, 'Local');
    expect(events['5-6'].map((event) => event.name)).toEqual(['Fees Due', 'Afterburn']);
    expect(events['5-6'][1]).toMatchObject({ fullName: 'Afterburn (Added via app)', source: 'manual' });
  });

  it('keeps all static seed rows available to the app', () => {
    const staticRows = convertSeedRowsToObjects(seededStaticRows());
    expect(staticRows[0]).toMatchObject({ Date: '1-1', EventName: 'Fees Due', Type: 'FeesDue' });
  });

  it('generates calendar rows from selected plan items', () => {
    const rows = convertSeedRowsToObjects(generateSeedCalendarRowsForOption('Local', [
      { Item: 'Toronto Regatta', Type: 'Regatta', Dates: '6/12 6/13' },
      { Item: 'Afterburn', Type: 'Practice' },
      { Item: 'Training Camp', Type: 'Practice', Dates: '5/9' },
    ]));

    expect(rows).toContainEqual(expect.objectContaining({ Date: '6-12', EventName: 'Toronto Regatta', Type: 'Regatta', Option: 'Local' }));
    expect(rows).toContainEqual(expect.objectContaining({ Date: '6-13', EventName: 'Toronto Regatta', Type: 'Regatta', Option: 'Local' }));
    expect(rows).toContainEqual(expect.objectContaining({ Date: '1-3', EventName: 'Afterburn', Type: 'Practice', Option: 'Local' }));
    expect(rows).toContainEqual(expect.objectContaining({ Date: '5-9', EventName: 'Training Camp', Type: 'Practice', Option: 'Local' }));
  });
});
