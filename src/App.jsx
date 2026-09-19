import { useState, useEffect } from 'react';
import Header from './components/Header';
import HomeLanding from './components/HomeLanding';
import PlanSelector from './components/PlanSelector';
import CostSummary from './components/CostSummary';
import ItemSection from './components/ItemSection';
import Calendar from './components/Calendar';
import SeasonPlansOverview from './components/SeasonPlansOverview';
import SeasonNotePanel from './components/SeasonNotePanel';
import Constitution from './components/Constitution';
import TeamName from './components/TeamName';
import SeasonNoteModal from './components/SeasonNoteModal';
import SeasonTitleModal from './components/SeasonTitleModal';
import SeasonFlightsModal from './components/SeasonFlightsModal';
import AddItemsModal from './components/AddItemsModal';
import EditRegattaModal from './components/EditRegattaModal';
import NewRegattaModal from './components/NewRegattaModal';
import NewTravelItemModal from './components/NewTravelItemModal';
import RegattaNoteModal from './components/RegattaNoteModal';
import AddPlanModal from './components/AddPlanModal';
import Toast from './components/Toast';
import { fetchPlannerData, processData, buildPlannerDataSnapshot, savePlannerDataSnapshot } from './utils/dataFetcher';
import { buildCalendarEventsFromRows, convertSeedRowsToObjects, generateSeedCalendarRowsForOption, seededStaticRows, MONTHS_DATA } from './utils/calendarEvents';
import { calculateAfterburnFee, recalculateItemCosts, recalculateTotals } from './utils/costCalculator';
import { buildSeasonSummaries } from './utils/seasonSummaries';

function dedupePendingChanges(changes) {
  const latestByKey = new Map();

  changes.forEach((change) => {
    if (change.action === 'addCalendarEvent' || change.action === 'removeCalendarEvent') {
      const key = `calendar:${change.option}:${change.date}:${change.eventName}:${change.source || ''}`;
      const current = latestByKey.get(key);
      const delta = change.action === 'addCalendarEvent' ? 1 : -1;
      const next = {
        ...change,
        action: 'calendarEventDelta',
        delta: (current?.delta || 0) + delta,
      };
      if (next.delta === 0) latestByKey.delete(key);
      else latestByKey.set(key, next);
      return;
    }

    let key = '';
    if (change.action === 'updateRegattaPricing') key = `pricing:${change.itemName}`;
    else if (change.action === 'addRegatta') key = `regatta:${change.item.Item}`;
    else if (change.action === 'addTravelItem') key = `travel:${change.item.Item}`;
    else if (change.action === 'addSeasonPlan') key = `plan:add:${change.optionName}`;
    else if (change.action === 'deleteSeasonPlan') key = `plan:delete:${change.optionName}`;
    else if (change.action === 'updateSeasonNote') key = `plan:note:${change.optionName}`;
    else if (change.action === 'updateSeasonTitle') key = `plan:title:${change.optionName}`;
    else if (change.action === 'updateEstimatedFlights') key = `plan:flights:${change.optionName}`;
    else if (change.action === 'updateSeasonOrder') key = 'plan:order';
    else key = `toggle:${change.item}:${change.option}`;
    latestByKey.set(key, change);
  });

  return Array.from(latestByKey.values());
}

function getItemDateValue(item) {
  const match = item?.Dates?.match(/(\d+)\/(\d+)/);
  if (!match) return Number.MAX_SAFE_INTEGER;
  const month = parseInt(match[1], 10);
  const day = parseInt(match[2], 10);
  return month * 100 + day;
}

function isSameCalendarRow(row, option, date, eventName, source) {
  return row.Date === date && row.EventName === eventName && row.Option === option && row.Source === source;
}

function removeFirstMatchingCalendarRow(rows, matcher) {
  const idx = rows.findIndex(matcher);
  if (idx === -1) return rows;
  const copy = [...rows];
  copy.splice(idx, 1);
  return copy;
}

function keyToSlashDate(dateKey) {
  const [month, day] = dateKey.split('-');
  return `${parseInt(month, 10)}/${parseInt(day, 10)}`;
}

function removeDateFromDatesString(dates = '', dateKey) {
  const target = keyToSlashDate(dateKey);
  const remaining = (dates.match(/\d+\/\d+/g) || []).filter((date) => date !== target);
  return remaining.join(' ');
}

function getCalendarDateValue(dateKey) {
  const [month, day] = String(dateKey).split('-').map(Number);
  if (!Number.isFinite(month) || !Number.isFinite(day)) return Number.MAX_SAFE_INTEGER;
  return month * 100 + day;
}

function formatCalendarDateKey(dateKey) {
  const [month, day] = String(dateKey).split('-').map(Number);
  if (!Number.isFinite(month) || !Number.isFinite(day)) return dateKey;
  return `${MONTHS_DATA[month - 1]?.name || month} ${day}`;
}

function buildPracticeSchedule(calendarEvents) {
  const schedule = {};

  Object.entries(calendarEvents || {})
    .sort(([a], [b]) => getCalendarDateValue(a) - getCalendarDateValue(b))
    .forEach(([dateKey, events]) => {
      (events || []).forEach((event) => {
        if (event.type !== 'Practice') return;
        if (!schedule[event.name]) schedule[event.name] = [];
        schedule[event.name].push(formatCalendarDateKey(dateKey));
      });
    });

  return schedule;
}

function formatPracticeScheduleLabel(dates = [], practiceName = '') {
  if (!dates.length) return '';
  const countLabel = `${dates.length} scheduled ${dates.length === 1 ? 'session' : 'sessions'}`;
  if (practiceName === 'Afterburn') return countLabel;
  return `${countLabel}: ${dates.join(', ')}`;
}

function decodeHashValue(value = '') {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function parseHashRoute(hash = '') {
  const raw = hash.replace(/^#/, '');
  const separatorIndex = raw.indexOf(':');
  if (separatorIndex === -1) return { page: raw, value: '' };

  return {
    page: raw.slice(0, separatorIndex),
    value: decodeHashValue(raw.slice(separatorIndex + 1)),
  };
}

function updateHashRoute(route) {
  if (!route || window.location.hash === `#${route}`) return;
  window.location.hash = route;
}

function App() {
  const [dataItems, setDataItems] = useState([]);
  const [calendarRows, setCalendarRows] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [teamSize, setTeamSize] = useState(24);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState({});
  const [pendingChanges, setPendingChanges] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [editingRegatta, setEditingRegatta] = useState(null);
  const [activeRegattaNotes, setActiveRegattaNotes] = useState(null);
  const [isNewRegattaOpen, setIsNewRegattaOpen] = useState(false);
  const [isNewTravelItemOpen, setIsNewTravelItemOpen] = useState(false);
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [isSeasonNoteOpen, setIsSeasonNoteOpen] = useState(false);
  const [isSeasonTitleOpen, setIsSeasonTitleOpen] = useState(false);
  const [isSeasonFlightsOpen, setIsSeasonFlightsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [constitutionArticle, setConstitutionArticle] = useState('I');
  const canEdit = import.meta.env.DEV;
  
  // Modal state
  const [addModalState, setAddModalState] = useState({
    isOpen: false,
    type: null,
    title: ''
  });

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isLoading) return undefined;

    const applyHashRoute = () => {
      const { page, value } = parseHashRoute(window.location.hash);
      if (!page) return;

      if (page === 'home' || page === 'overview' || page === 'team-name') {
        setActiveTab(page);
        return;
      }

      if (page === 'constitution') {
        setActiveTab('constitution');
        setConstitutionArticle(value || 'I');
        return;
      }

      if (page === 'season') {
        const requestedOption = value || selectedOption || options[0]?.id;
        const matchingOption = options.find((option) => option.id === requestedOption);

        if (matchingOption) {
          setSelectedOption(matchingOption.id);
          setActiveTab('season');
        } else {
          setActiveTab('overview');
        }
      }
    };

    applyHashRoute();
    window.addEventListener('hashchange', applyHashRoute);
    return () => window.removeEventListener('hashchange', applyHashRoute);
  }, [isLoading, options, selectedOption]);

  // Update calendar events when option or calendar rows change
  useEffect(() => {
    if (!selectedOption || dataItems.length === 0) return;

    const optionItems = dataItems.filter((item) => item[selectedOption] === 'TRUE');
    const generatedRows = convertSeedRowsToObjects([
      ...seededStaticRows(),
      ...generateSeedCalendarRowsForOption(selectedOption, optionItems),
    ]);

    const manualRows = (calendarRows || []).filter((row) => row.Source !== 'generated');
    setCalendarEvents(buildCalendarEventsFromRows([...generatedRows, ...manualRows], selectedOption));
  }, [selectedOption, calendarRows, dataItems]);

  async function loadData() {
    try {
      setIsLoading(true);
      const { dataItems, totalsData, calendarRows } = await fetchPlannerData();
      const processedOptions = processData(dataItems, totalsData);
      
      setDataItems(dataItems);
      setCalendarRows(calendarRows || []);
      setOptions(processedOptions);
      
      if (processedOptions.length > 0) {
        const hasSelectedOption = processedOptions.some((option) => option.id === selectedOption);
        if (!selectedOption || !hasSelectedOption) {
          setSelectedOption(processedOptions[0].id);
        }
      }
      
      setError(null);
      return { processedOptions, dataItems, calendarRows: calendarRows || [] };
    } catch (err) {
      setError('Failed to load local planner data. Please check src/data/plannerData.json.');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  const currentOption = options.find(o => o.id === selectedOption) || options[0];
  const effectiveTeamSize = parseInt(teamSize, 10) || 1;
  const editingEnabled = canEdit && isEditMode;
  const activeView = currentOption || ['home', 'team-name', 'constitution'].includes(activeTab) ? activeTab : 'home';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 max-w-md text-center">
          <div className="text-red-500 text-xl font-semibold mb-4">Error</div>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  let calculatedSummary = currentOption;
  let regattas = [];
  let practices = [];
  let other = [];

  if (currentOption) {
    // Get calculated items for current option
    const calculatedItems = recalculateItemCosts(dataItems, selectedOption, effectiveTeamSize, calendarEvents);
    const optionItems = calculatedItems.filter(item => item[selectedOption] === 'TRUE');
    regattas = optionItems
      .filter(item => item.Type === 'Regatta')
      .sort((a, b) => getItemDateValue(a) - getItemDateValue(b) || a.Item.localeCompare(b.Item));
    const practiceSchedule = buildPracticeSchedule(calendarEvents);
    const includedPracticeItems = optionItems
      .filter(item => item.Type === 'Practice')
      .map((item) => ({
        ...item,
        _scheduleLabel: formatPracticeScheduleLabel(practiceSchedule[item.Item], item.Item),
      }));
    const includedPracticeNames = new Set(includedPracticeItems.map((item) => item.Item));
    const scheduledPracticeItems = Object.keys(practiceSchedule)
      .filter((practiceName) => !includedPracticeNames.has(practiceName))
      .map((practiceName) => {
        const sourceItem = dataItems.find((item) => item.Type === 'Practice' && item.Item === practiceName);
        if (!sourceItem) return null;

        const scheduledCount = practiceSchedule[practiceName].length;
        const totalCost = practiceName === 'Afterburn'
          ? calculateAfterburnFee(scheduledCount)
          : parseFloat(sourceItem['Total Cost']) || 0;
        const costPP = effectiveTeamSize > 0 ? totalCost / effectiveTeamSize : 0;

        return {
          ...sourceItem,
          [selectedOption]: 'TRUE',
          'Total Cost': totalCost.toFixed(2),
          'Cost PP (24ppl)': `$${costPP.toFixed(2)}`,
          _scheduleLabel: formatPracticeScheduleLabel(practiceSchedule[practiceName], practiceName),
          _calendarOnly: true,
        };
      })
      .filter(Boolean);
    practices = [...includedPracticeItems, ...scheduledPracticeItems];
    other = optionItems.filter(item => item.Type === 'Jersey' || item.Type === 'Travel');
    calculatedSummary = {
      ...currentOption,
      ...recalculateTotals(calculatedItems, selectedOption, effectiveTeamSize, calendarEvents)
    };
  }

  const seasonSummaries = buildSeasonSummaries(options, dataItems, calendarRows, effectiveTeamSize);
  const allRegattas = dataItems
    .filter((item) => item.Type === 'Regatta')
    .sort((a, b) => getItemDateValue(a) - getItemDateValue(b) || a.Item.localeCompare(b.Item));

  const handleNavigateTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'constitution') {
      setConstitutionArticle('I');
      updateHashRoute('constitution');
      return;
    }
    updateHashRoute(tab);
  };

  const handleNavigateSeason = (optionId) => {
    setSelectedOption(optionId);
    setActiveTab('season');
    updateHashRoute(`season:${encodeURIComponent(optionId)}`);
  };

  const handleNavigateConstitutionArticle = (roman) => {
    setConstitutionArticle(roman);
    updateHashRoute(`constitution:${encodeURIComponent(roman)}`);
  };

  const handleToggleEdit = () => {
    if (!canEdit) {
      setToast({ visible: true, message: 'Production is read-only. Run npm run dev locally to edit data.', type: 'error' });
      return;
    }

    setIsEditMode((current) => !current);
  };

  const handleOpenAddModal = (type) => {
    const titles = {
      regatta: 'Manage Regattas',
      practice: 'Manage Practice Sessions',
      travel: 'Manage Travel'
    };
    
    setAddModalState({
      isOpen: true,
      type,
      title: titles[type]
    });
  };

  const handleCloseAddModal = () => {
    setAddModalState({ isOpen: false, type: null, title: '' });
  };

  const handleToggleItem = (itemName, include) => {
    const newDataItems = dataItems.map(item => {
      if (item.Item === itemName) {
        return { ...item, [selectedOption]: include ? 'TRUE' : 'FALSE' };
      }
      return item;
    });
    setDataItems(newDataItems);
    
    // Track this change
    setPendingChanges(prev => dedupePendingChanges([
      ...prev,
      { action: 'updateItem', item: itemName, option: selectedOption, include }
    ]));
  };

  const handleAddItem = (itemName) => {
    handleToggleItem(itemName, true);
  };

  const handleRemoveItem = (itemName) => {
    handleToggleItem(itemName, false);
  };

  const handleRemovePracticeItemFromCalendar = (dateKey, itemName) => {
    const targetItem = dataItems.find((item) => item.Item === itemName && item[selectedOption] === 'TRUE');
    if (!targetItem) return;

    const updatedDates = removeDateFromDatesString(targetItem.Dates, dateKey);
    const shouldRemoveItem = updatedDates.length === 0;

    setDataItems((prev) => prev.map((item) => {
      if (item.Item !== itemName) return item;
      return {
        ...item,
        Dates: updatedDates,
        [selectedOption]: shouldRemoveItem ? 'FALSE' : item[selectedOption],
      };
    }));

    setPendingChanges((prev) => dedupePendingChanges([
      ...prev.filter((change) => !(change.action === 'updateItem' && change.item === itemName && change.option === selectedOption)),
      {
        action: 'updateRegattaPricing',
        itemName,
        updates: {
          Dates: updatedDates,
        },
      },
      ...(shouldRemoveItem ? [{ action: 'updateItem', item: itemName, option: selectedOption, include: false }] : []),
    ]));
  };

  // Get current and available items for modal
  const getModalItems = () => {
    if (!addModalState.type) return { current: [], available: [] };
    
    const typeMap = {
      'regatta': ['Regatta'],
      'practice': ['Practice'],
      'travel': ['Travel', 'Jersey']
    };
    
    const types = typeMap[addModalState.type];
    
    const current = dataItems.filter(i => 
      i[selectedOption] === 'TRUE' && types.includes(i.Type)
    );
    
    const available = dataItems.filter(i => 
      i[selectedOption] !== 'TRUE' && types.includes(i.Type)
    );
    
    return { current, available };
  };

  const { current: modalCurrentItems, available: modalAvailableItems } = getModalItems();

  const handleSaveRegattaUpdates = (item, updates) => {
    setDataItems((prev) => prev.map((row) => row.Item === item.Item ? { ...row, ...updates } : row));
    setPendingChanges((prev) => dedupePendingChanges([
      ...prev,
      { action: 'updateRegattaPricing', itemName: item.Item, updates }
    ]));
    setEditingRegatta(null);
    setActiveRegattaNotes(null);
  };

  const handleCreateRegatta = (item) => {
    if (!item?.Item) return;

    if (dataItems.some((row) => row.Item.toLowerCase() === item.Item.toLowerCase())) {
      setToast({ visible: true, message: 'A regatta with that name already exists.', type: 'error' });
      return;
    }

    const optionFlags = options.reduce((acc, option) => {
      acc[option.id] = option.id === selectedOption ? 'TRUE' : 'FALSE';
      return acc;
    }, {});

    setDataItems((prev) => ([...prev, {
      Item: item.Item,
      Price: item.Price,
      Type: 'Regatta',
      'Early Bird deadline': item['Early Bird deadline'] || '',
      Dates: item.Dates || '',
      Notes: item.Notes || '',
      'Raw Price (CAD)': item['Raw Price (CAD)'] || '',
      Math: item.Math || '',
      'Total Cost': item['Total Cost'] || '',
      'Cost PP (24ppl)': item['Cost PP (24ppl)'] || '',
      ...optionFlags,
    }]));

    setPendingChanges((prev) => dedupePendingChanges([
      ...prev,
      { action: 'addRegatta', item: { ...item, option: selectedOption, options: options.map((o) => o.id) } }
    ]));
    setIsNewRegattaOpen(false);
    handleCloseAddModal();
  };

  const handleCreateTravelItem = (item) => {
    if (!item?.Item) return;

    if (dataItems.some((row) => row.Item.toLowerCase() === item.Item.toLowerCase())) {
      setToast({ visible: true, message: 'A travel item with that title already exists.', type: 'error' });
      return;
    }

    const optionFlags = options.reduce((acc, option) => {
      acc[option.id] = option.id === selectedOption ? 'TRUE' : 'FALSE';
      return acc;
    }, {});

    setDataItems((prev) => ([...prev, {
      Item: item.Item,
      Price: item.Price,
      Type: 'Travel',
      'Early Bird deadline': '',
      Dates: '',
      Notes: item.Notes || '',
      'Raw Price (CAD)': '',
      Math: item.Math || '',
      'Total Cost': item['Total Cost'] || '',
      'Cost PP (24ppl)': item['Cost PP (24ppl)'] || '',
      ...optionFlags,
    }]));

    setPendingChanges((prev) => dedupePendingChanges([
      ...prev,
      { action: 'addTravelItem', item: { ...item, option: selectedOption, options: options.map((o) => o.id) } }
    ]));
    setIsNewTravelItemOpen(false);
    handleCloseAddModal();
  };

  const handleDeleteSeasonPlan = () => {
    if (!selectedOption) return;
    if (options.length <= 1) {
      setToast({ visible: true, message: 'You must keep at least one season plan.', type: 'error' });
      return;
    }

    const plan = options.find((option) => option.id === selectedOption);
    const label = plan?.details || selectedOption;
    if (!window.confirm(`Delete season plan "${label}"?`)) return;

    const nextOptions = options.filter((option) => option.id !== selectedOption);
    const fallbackOption = nextOptions[0]?.id || null;

    setOptions(nextOptions);
    setDataItems((prev) => prev.map((item) => {
      const copy = { ...item };
      delete copy[selectedOption];
      return copy;
    }));
    setCalendarRows((prev) => prev.filter((row) => row.Option !== selectedOption));
    setSelectedOption(fallbackOption);
    if (fallbackOption) updateHashRoute(`season:${encodeURIComponent(fallbackOption)}`);
    else handleNavigateTab('overview');
    setPendingChanges((prev) => {
      const filtered = prev.filter((change) => {
        if (change.action === 'updateItem' && change.option === selectedOption) return false;
        if (change.action === 'addSeasonPlan' && change.optionName === selectedOption) return false;
        if (change.action === 'deleteSeasonPlan' && change.optionName === selectedOption) return false;
        if (change.action === 'updateEstimatedFlights' && change.optionName === selectedOption) return false;
        if (change.action === 'addRegatta' && change.item?.option === selectedOption) return false;
        if (change.action === 'addTravelItem' && change.item?.option === selectedOption) return false;
        if (change.action === 'calendarEventDelta' && change.option === selectedOption) return false;
        return true;
      });

      return dedupePendingChanges([
        ...filtered,
        { action: 'deleteSeasonPlan', optionName: selectedOption, details: label }
      ]);
    });
  };

  const handleReorderSeasonPlans = (draggedPlanId, targetPlanId) => {
    setOptions((prev) => {
      const draggedIndex = prev.findIndex((option) => option.id === draggedPlanId);
      const targetIndex = prev.findIndex((option) => option.id === targetPlanId);
      if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) return prev;

      const next = [...prev];
      const [dragged] = next.splice(draggedIndex, 1);
      next.splice(targetIndex, 0, dragged);
      setPendingChanges((changes) => dedupePendingChanges([
        ...changes,
        { action: 'updateSeasonOrder', order: next.map((option) => option.id) }
      ]));
      return next;
    });
  };

  const handleSaveSeasonNote = (note) => {
    if (!currentOption) return;

    setOptions((prev) => prev.map((option) => (
      option.id === currentOption.id ? { ...option, note } : option
    )));
    setPendingChanges((prev) => dedupePendingChanges([
      ...prev,
      { action: 'updateSeasonNote', optionName: currentOption.id, note }
    ]));
    setIsSeasonNoteOpen(false);
  };

  const handleSaveSeasonTitle = (title) => {
    if (!currentOption || !title) return;

    setOptions((prev) => prev.map((option) => (
      option.id === currentOption.id ? { ...option, details: title } : option
    )));
    setPendingChanges((prev) => dedupePendingChanges([
      ...prev,
      { action: 'updateSeasonTitle', optionName: currentOption.id, title }
    ]));
    setIsSeasonTitleOpen(false);
  };

  const handleSaveEstimatedFlights = (estimatedFlights) => {
    if (!currentOption) return;

    setOptions((prev) => prev.map((option) => (
      option.id === currentOption.id ? { ...option, estimatedFlights } : option
    )));
    setPendingChanges((prev) => dedupePendingChanges([
      ...prev,
      { action: 'updateEstimatedFlights', optionName: currentOption.id, estimatedFlights }
    ]));
    setIsSeasonFlightsOpen(false);
  };

  const handleAddSeasonPlan = ({ name, details, copyFrom }) => {
    const normalizedName = name.trim();
    const normalizedDetails = (details || name).trim();
    if (!normalizedName) return;

    if (options.some((option) => option.id.toLowerCase() === normalizedName.toLowerCase())) {
      setToast({ visible: true, message: 'A season plan with that name already exists.', type: 'error' });
      return;
    }

    setDataItems((prev) => prev.map((item) => ({
      ...item,
      [normalizedName]: item[copyFrom] || 'FALSE'
    })));

    const newOption = {
      id: normalizedName,
      name: normalizedName,
      details: normalizedDetails,
      totalCost: '$0.00',
      ppCost: '$0.00',
      estimatedFlights: '',
      note: '',
      installments: { regatta: '$0.00', practice: '$0.00', travel: '$0.00' }
    };

    setOptions((prev) => [...prev, newOption]);
    setSelectedOption(normalizedName);
    setActiveTab('season');
    updateHashRoute(`season:${encodeURIComponent(normalizedName)}`);
    setPendingChanges((prev) => dedupePendingChanges([
      ...prev,
      { action: 'addSeasonPlan', optionName: normalizedName, details: normalizedDetails, copyFrom }
    ]));
    setIsAddPlanOpen(false);
  };

  const handleSaveChanges = async () => {
    if (pendingChanges.length === 0) return;
    if (!canEdit) {
      setToast({ visible: true, message: 'Production is read-only. Run npm run dev locally to edit data.', type: 'error' });
      return;
    }
    
    setIsSaving(true);
    try {
      const snapshot = buildPlannerDataSnapshot({ dataItems, options, calendarRows });
      const result = await savePlannerDataSnapshot(snapshot);

      if (!result.success) {
        throw result.error || new Error('Local data save failed.');
      }

      setPendingChanges([]);
      setToast({ visible: true, message: 'Changes saved to src/data/plannerData.json. Commit the JSON file before deploying.', type: 'success' });
    } catch (error) {
      console.error('Save failed:', error);
      setToast({ visible: true, message: 'Failed to save local JSON. Make sure you are running npm run dev.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-5">
      <div className="max-w-[1400px] mx-auto">
        <Header
          isEditMode={editingEnabled}
          onToggleEdit={handleToggleEdit}
          canEdit={canEdit}
          activeTab={activeView}
          onTabChange={handleNavigateTab}
        />

        {activeView === 'home' ? (
          <HomeLanding onViewSeason={() => handleNavigateTab('overview')} />
        ) : activeView === 'team-name' ? (
          <TeamName />
        ) : activeView === 'constitution' ? (
          <Constitution
            activeArticleRoman={constitutionArticle}
            onArticleChange={handleNavigateConstitutionArticle}
          />
        ) : activeView === 'overview' ? (
          <>
            <SeasonPlansOverview
              summaries={seasonSummaries}
              regattas={allRegattas}
              teamSize={teamSize}
              onTeamSizeChange={setTeamSize}
              isEditMode={editingEnabled}
              onOpenAddPlan={() => setIsAddPlanOpen(true)}
              onReorderPlans={handleReorderSeasonPlans}
              onOpenPlan={handleNavigateSeason}
            />

            <AddPlanModal
              isOpen={isAddPlanOpen}
              options={options}
              selectedOption={selectedOption}
              onClose={() => setIsAddPlanOpen(false)}
              onSave={handleAddSeasonPlan}
            />
          </>
        ) : (
          <>
            <PlanSelector
              option={currentOption}
              teamSize={teamSize}
              onTeamSizeChange={setTeamSize}
              isEditMode={editingEnabled}
              onBack={() => handleNavigateTab('overview')}
              onOpenAddPlan={() => setIsAddPlanOpen(true)}
              onDeletePlan={handleDeleteSeasonPlan}
              onEditTitle={() => setIsSeasonTitleOpen(true)}
            />

            <SeasonNotePanel
              note={calculatedSummary.note}
              isEditMode={editingEnabled}
              onEdit={() => setIsSeasonNoteOpen(true)}
            />

            <CostSummary
              option={calculatedSummary}
              isEditMode={editingEnabled}
              onEditFlights={() => setIsSeasonFlightsOpen(true)}
            />

            <div className="grid gap-5 mb-10 lg:grid-cols-3">
              <ItemSection
                title="Regattas"
                items={regattas}
                type="regatta"
                isEditMode={editingEnabled}
                onRemove={handleRemoveItem}
                onOpenAddModal={() => handleOpenAddModal('regatta')}
                onEdit={setEditingRegatta}
                onOpenNotes={setActiveRegattaNotes}
              />
              <ItemSection
                title="Practice Sessions"
                items={practices}
                type="practice"
                isEditMode={editingEnabled}
                onRemove={handleRemoveItem}
                onOpenAddModal={() => handleOpenAddModal('practice')}
                practiceMeta={{
                  practiceCount: calculatedSummary.practiceCount,
                  practiceRate: calculatedSummary.practiceRate,
                  afterburnCount: calculatedSummary.afterburnCount,
                  afterburnRate: calculatedSummary.afterburnRate,
                  teamSize: effectiveTeamSize
                }}
              />
              <ItemSection
                title="Travel"
                items={other}
                type="travel"
                isEditMode={editingEnabled}
                onRemove={handleRemoveItem}
                onOpenAddModal={() => handleOpenAddModal('travel')}
              />
            </div>

            <Calendar
              events={calendarEvents}
              isEditMode={editingEnabled}
              selectedOption={selectedOption}
              onAddCustomPractice={(date, practiceName) => {
                const hasRemovalOverride = calendarRows.some((row) => isSameCalendarRow(row, selectedOption, date, practiceName, 'removed'));

                if (hasRemovalOverride) {
                  setCalendarRows((prev) => removeFirstMatchingCalendarRow(prev, (row) => isSameCalendarRow(row, selectedOption, date, practiceName, 'removed')));
                  setPendingChanges((prev) => dedupePendingChanges([
                    ...prev,
                    {
                      action: 'removeCalendarEvent',
                      date,
                      eventName: practiceName,
                      option: selectedOption,
                      source: 'removed',
                    }
                  ]));
                  return;
                }

                setCalendarRows((prev) => ([...prev, {
                  Date: date,
                  EventName: practiceName,
                  Type: 'Practice',
                  Option: selectedOption,
                  Source: 'manual',
                  Notes: 'Added via app'
                }]));
                setPendingChanges((prev) => dedupePendingChanges([
                  ...prev,
                  {
                    action: 'addCalendarEvent',
                    date,
                    eventName: practiceName,
                    type: 'Practice',
                    option: selectedOption,
                    source: 'manual',
                    notes: 'Added via app'
                  }
                ]));
              }}
              onRemoveCustomPractice={(date, practiceName) => {
                const hasManualRow = calendarRows.some((row) => isSameCalendarRow(row, selectedOption, date, practiceName, 'manual'));

                if (hasManualRow) {
                  setCalendarRows((prev) => removeFirstMatchingCalendarRow(prev, (row) => isSameCalendarRow(row, selectedOption, date, practiceName, 'manual')));
                  setPendingChanges((prev) => dedupePendingChanges([
                    ...prev,
                    {
                      action: 'removeCalendarEvent',
                      date,
                      eventName: practiceName,
                      option: selectedOption,
                      source: 'manual',
                    }
                  ]));
                  return;
                }

                setCalendarRows((prev) => ([...prev, {
                  Date: date,
                  EventName: practiceName,
                  Type: 'Practice',
                  Option: selectedOption,
                  Source: 'removed',
                  Notes: 'Removed via app'
                }]));
                setPendingChanges((prev) => dedupePendingChanges([
                  ...prev,
                  {
                    action: 'addCalendarEvent',
                    date,
                    eventName: practiceName,
                    type: 'Practice',
                    option: selectedOption,
                    source: 'removed',
                    notes: 'Removed via app'
                  }
                ]));
              }}
            />

            <AddItemsModal
              isOpen={addModalState.isOpen}
              onClose={handleCloseAddModal}
              title={addModalState.title}
              currentItems={modalCurrentItems}
              availableItems={modalAvailableItems}
              onAdd={handleAddItem}
              onRemove={handleRemoveItem}
              onCreateNew={addModalState.type === 'regatta'
                ? () => setIsNewRegattaOpen(true)
                : addModalState.type === 'travel'
                  ? () => setIsNewTravelItemOpen(true)
                  : null}
              createNewLabel={addModalState.type === 'travel' ? '+ New travel item' : '+ New regatta'}
            />

            <NewRegattaModal
              isOpen={isNewRegattaOpen}
              teamSize={effectiveTeamSize}
              onClose={() => setIsNewRegattaOpen(false)}
              onSave={handleCreateRegatta}
            />

            <NewTravelItemModal
              isOpen={isNewTravelItemOpen}
              teamSize={effectiveTeamSize}
              onClose={() => setIsNewTravelItemOpen(false)}
              onSave={handleCreateTravelItem}
            />

            <EditRegattaModal
              isOpen={!!editingRegatta}
              item={editingRegatta}
              teamSize={effectiveTeamSize}
              onClose={() => setEditingRegatta(null)}
              onSave={handleSaveRegattaUpdates}
            />

            <RegattaNoteModal
              isOpen={!!activeRegattaNotes}
              item={activeRegattaNotes}
              isEditMode={editingEnabled}
              onClose={() => setActiveRegattaNotes(null)}
              onSave={handleSaveRegattaUpdates}
            />

            <SeasonNoteModal
              isOpen={isSeasonNoteOpen}
              option={currentOption}
              onClose={() => setIsSeasonNoteOpen(false)}
              onSave={handleSaveSeasonNote}
            />

            <SeasonTitleModal
              isOpen={isSeasonTitleOpen}
              option={currentOption}
              onClose={() => setIsSeasonTitleOpen(false)}
              onSave={handleSaveSeasonTitle}
            />

            <SeasonFlightsModal
              isOpen={isSeasonFlightsOpen}
              option={currentOption}
              onClose={() => setIsSeasonFlightsOpen(false)}
              onSave={handleSaveEstimatedFlights}
            />

            <AddPlanModal
              isOpen={isAddPlanOpen}
              options={options}
              selectedOption={selectedOption}
              onClose={() => setIsAddPlanOpen(false)}
              onSave={handleAddSeasonPlan}
            />
          </>
        )}

        {/* Save Button */}
        {['overview', 'season'].includes(activeView) && canEdit && pendingChanges.length > 0 && (
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-8 py-4 rounded-full text-lg font-bold shadow-2xl hover:scale-105 transition-all z-50"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : (
              <span>💾 Save Changes ({pendingChanges.length})</span>
            )}
          </button>
        )}

        {/* Toast Notification */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.visible}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      </div>
    </div>
  );
}

export default App;
