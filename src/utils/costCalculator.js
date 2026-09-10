// Sunnyside Paddling Fee rates
const SUNNYSIDE_RATES = {
  low: { min: 11, max: 21, rate: 196.03 },
  high: { min: 22, max: 42, rate: 152.47 },
  veryHigh: { min: 43, rate: 130.69 }
};

const AFTERBURN_RATES = {
  standard: 190,
  discounted: 165,
  discountThreshold: 10,
};

function parseCurrency(value) {
  if (value === null || value === undefined) return null;
  const num = parseFloat(String(value).replace(/[$,]/g, ''));
  return Number.isFinite(num) ? num : null;
}

function isTravelItem(item) {
  return item.Type === 'Travel';
}

function isPerPersonTravelItem(item) {
  return isTravelItem(item) && /(pp\b|per person)/i.test(item.Price || '');
}

export function countPractices(calendarEvents) {
  let count = 0;

  Object.keys(calendarEvents).forEach((key) => {
    const events = calendarEvents[key];
    events.forEach((e) => {
      if (e.type !== 'Practice') return;
      if (e.name === 'Dragonboat Practice') count += 1;
      if (e.name === 'Training Camp') count += 2;
    });
  });

  return count;
}

export function getSunnysideRate(practiceCount) {
  if (practiceCount >= SUNNYSIDE_RATES.low.min && practiceCount <= SUNNYSIDE_RATES.low.max) {
    return SUNNYSIDE_RATES.low.rate;
  }
  if (practiceCount >= SUNNYSIDE_RATES.high.min && practiceCount <= SUNNYSIDE_RATES.high.max) {
    return SUNNYSIDE_RATES.high.rate;
  }
  if (practiceCount >= SUNNYSIDE_RATES.veryHigh.min) {
    return SUNNYSIDE_RATES.veryHigh.rate;
  }
  return SUNNYSIDE_RATES.low.rate;
}

export function calculateSunnysideFee(practiceCount) {
  if (practiceCount === 0) return 0;
  return practiceCount * getSunnysideRate(practiceCount);
}

export function countAfterburnSessions(calendarEvents) {
  let count = 0;

  Object.keys(calendarEvents).forEach((key) => {
    const events = calendarEvents[key];
    events.forEach((e) => {
      if (e.type === 'Practice' && e.name === 'Afterburn') count += 1;
    });
  });

  return count;
}

export function getAfterburnRate(sessionCount) {
  return sessionCount >= AFTERBURN_RATES.discountThreshold
    ? AFTERBURN_RATES.discounted
    : AFTERBURN_RATES.standard;
}

export function calculateAfterburnFee(sessionCount) {
  if (sessionCount === 0) return 0;
  return sessionCount * getAfterburnRate(sessionCount);
}

export function recalculateItemCosts(dataItems, selectedOption, teamSize, calendarEvents) {
  const practiceCount = countPractices(calendarEvents);
  const afterburnCount = countAfterburnSessions(calendarEvents);

  return dataItems.map(item => {
    const isScheduledAfterburn = item.Item === 'Afterburn' && afterburnCount > 0;
    if (item[selectedOption] !== 'TRUE' && !isScheduledAfterburn) return item;

    let totalCost = parseFloat(item['Total Cost']) || 0;

    if (item.Item === 'Sunnyside Paddling Fee') {
      totalCost = calculateSunnysideFee(practiceCount);
    }

    if (item.Item === 'Afterburn') {
      totalCost = calculateAfterburnFee(afterburnCount);
    }

    if (isPerPersonTravelItem(item)) {
      const perPersonPrice = parseCurrency(item.Price);
      if (perPersonPrice !== null) {
        totalCost = perPersonPrice * teamSize;
      }
    }

    const costPP = teamSize > 0 ? totalCost / teamSize : 0;

    return {
      ...item,
      [selectedOption]: isScheduledAfterburn ? 'TRUE' : item[selectedOption],
      'Total Cost': totalCost.toFixed(2),
      'Cost PP (24ppl)': `$${costPP.toFixed(2)}`,
      _calculated: item.Item === 'Sunnyside Paddling Fee' || item.Item === 'Afterburn',
      _calendarOnly: isScheduledAfterburn && item[selectedOption] !== 'TRUE',
    };
  });
}

export function recalculateTotals(dataItems, selectedOption, teamSize, calendarEvents) {
  const optionItems = dataItems.filter(item => item[selectedOption] === 'TRUE');

  let totalRegattaFees = 0;
  let totalPracticeFees = 0;
  let totalTravelFees = 0;
  let totalTeamCost = 0;

  optionItems.forEach(item => {
    const cost = parseFloat(item['Total Cost']) || 0;
    totalTeamCost += cost;

    if (item.Type === 'Regatta' || item.Item === 'Afterburn') {
      totalRegattaFees += cost;
    } else if (item.Type === 'Practice') {
      totalPracticeFees += cost;
    } else if (isTravelItem(item)) {
      totalTravelFees += cost;
    }
  });

  const seasonTeamCost = totalTeamCost - totalTravelFees;
  const totalPP = teamSize > 0 ? seasonTeamCost / teamSize : 0;
  const travelPP = teamSize > 0 ? totalTravelFees / teamSize : 0;
  const regattaPP = teamSize > 0 ? totalRegattaFees / teamSize : 0;
  const practicePP = teamSize > 0 ? totalPracticeFees / teamSize : 0;
  const practiceCount = countPractices(calendarEvents);
  const afterburnCount = countAfterburnSessions(calendarEvents);

  return {
    totalCost: `$${seasonTeamCost.toFixed(2)}`,
    ppCost: `$${totalPP.toFixed(2)}`,
    travelCost: `$${totalTravelFees.toFixed(2)}`,
    travelPP: `$${travelPP.toFixed(2)}`,
    totalWithTravelCost: `$${totalTeamCost.toFixed(2)}`,
    totalWithTravelPP: `$${teamSize > 0 ? (totalTeamCost / teamSize).toFixed(2) : '0.00'}`,
    installments: {
      regatta: `$${regattaPP.toFixed(2)}`,
      practice: `$${practicePP.toFixed(2)}`,
      travel: `$${travelPP.toFixed(2)}`
    },
    practiceCount,
    practiceRate: getSunnysideRate(practiceCount),
    afterburnCount,
    afterburnRate: getAfterburnRate(afterburnCount)
  };
}

export function formatCurrency(value) {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[$,]/g, '')) : value;
  return `$${num.toFixed(2)}`;
}
