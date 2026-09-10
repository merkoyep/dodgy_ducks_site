import { describe, expect, it } from 'vitest';
import {
  calculateAfterburnFee,
  calculateSunnysideFee,
  countAfterburnSessions,
  countPractices,
  getAfterburnRate,
  getSunnysideRate,
  recalculateItemCosts,
  recalculateTotals,
} from './costCalculator';

describe('cost calculator', () => {
  const calendarEvents = {
    '5-6': [{ name: 'Dragonboat Practice', type: 'Practice' }],
    '5-9': [{ name: 'Training Camp', type: 'Practice' }],
    '1-3': [{ name: 'Afterburn', type: 'Practice' }],
    '7-1': [{ name: 'Canada Day', type: 'Holiday' }],
  };

  it('counts practices using feature-specific rules', () => {
    expect(countPractices(calendarEvents)).toBe(3);
    expect(countAfterburnSessions(calendarEvents)).toBe(1);
  });

  it('applies Sunnyside and Afterburn tiered rates', () => {
    expect(getSunnysideRate(10)).toBe(196.03);
    expect(getSunnysideRate(22)).toBe(152.47);
    expect(getSunnysideRate(42)).toBe(152.47);
    expect(getSunnysideRate(43)).toBe(130.69);
    expect(calculateSunnysideFee(3)).toBeCloseTo(588.09);

    expect(getAfterburnRate(9)).toBe(190);
    expect(getAfterburnRate(10)).toBe(165);
    expect(calculateAfterburnFee(10)).toBe(1650);
  });

  it('recalculates dynamic item costs and season totals', () => {
    const dataItems = [
      { Item: 'Sunnyside Paddling Fee', Type: 'Practice', 'Total Cost': '0', Local: 'TRUE' },
      { Item: 'Afterburn', Type: 'Practice', 'Total Cost': '0', Local: 'TRUE' },
      { Item: 'Uniforms', Type: 'Jersey', Price: '$50 PP', 'Total Cost': '1200', Local: 'TRUE' },
      { Item: 'Skipped', Type: 'Travel', 'Total Cost': '999', Local: 'FALSE' },
    ];

    const recalculated = recalculateItemCosts(dataItems, 'Local', 24, calendarEvents);
    expect(recalculated.find((item) => item.Item === 'Sunnyside Paddling Fee')['Total Cost']).toBe('588.09');
    expect(recalculated.find((item) => item.Item === 'Afterburn')['Total Cost']).toBe('190.00');

    const totals = recalculateTotals(recalculated, 'Local', 24, calendarEvents);
    expect(totals.totalCost).toBe('$1978.09');
    expect(totals.travelCost).toBe('$0.00');
    expect(totals.installments.practice).toBe('$24.50');
    expect(totals.installments.regatta).toBe('$7.92');
    expect(totals.installments.travel).toBe('$0.00');
  });

  it('adds scheduled Afterburn costs even when the plan item flag is off', () => {
    const dataItems = [
      { Item: 'Afterburn', Type: 'Practice', 'Total Cost': '0', Local: 'FALSE' },
    ];

    const recalculated = recalculateItemCosts(dataItems, 'Local', 24, calendarEvents);
    expect(recalculated[0].Local).toBe('TRUE');
    expect(recalculated[0]['Total Cost']).toBe('190.00');
    expect(recalculated[0]._calendarOnly).toBe(true);

    const totals = recalculateTotals(recalculated, 'Local', 24, calendarEvents);
    expect(totals.totalCost).toBe('$190.00');
    expect(totals.ppCost).toBe('$7.92');
  });

  it('keeps per-person travel prices stable when team size changes', () => {
    const dataItems = [
      { Item: 'Hotel', Type: 'Travel', Price: '$300PP', 'Total Cost': '7200', Local: 'TRUE' },
    ];

    const recalculated = recalculateItemCosts(dataItems, 'Local', 30, calendarEvents);
    expect(recalculated[0]['Total Cost']).toBe('9000.00');
    expect(recalculated[0]['Cost PP (24ppl)']).toBe('$300.00');
  });
});
