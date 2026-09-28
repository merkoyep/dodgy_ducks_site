import { useState, useEffect, useRef } from 'react';
import { MONTHS_DATA } from '../utils/calendarEvents';
import CalendarDay from './CalendarDay';

const PRACTICE_TOOLS = [
  { name: 'Dragonboat Practice', label: 'Add Practice' },
  { name: 'Training Camp', label: 'Add Training Camp' },
  { name: 'Outrigger Practice', label: 'Add Outrigger' },
  { name: 'Afterburn', label: 'Add Afterburn' },
];

const DISPLAYED_MONTH_INDEXES = [3, 4, 5, 6, 7, 8];

export default function Calendar({ 
  events, 
  isEditMode,
  onAddCustomPractice,
  onRemoveCustomPractice
}) {
  const [currentMonth, setCurrentMonth] = useState(3); // April
  const [activeMonths, setActiveMonths] = useState(DISPLAYED_MONTH_INDEXES);
  const [activeTool, setActiveTool] = useState(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isEditMode) setActiveTool(null);
  }, [isEditMode]);

  useEffect(() => {
    setActiveMonths(DISPLAYED_MONTH_INDEXES);

    // Only set initial month on first load, not on every event change
    if (!isInitialized.current) {
      setCurrentMonth(DISPLAYED_MONTH_INDEXES[0]);
      isInitialized.current = true;
    }
  }, [events]);

  const month = MONTHS_DATA[currentMonth];
  const monthNum = currentMonth + 1;

  const handlePrevMonth = () => {
    const currentIndex = activeMonths.indexOf(currentMonth);
    if (currentIndex > 0) {
      setCurrentMonth(activeMonths[currentIndex - 1]);
    }
  };

  const handleNextMonth = () => {
    const currentIndex = activeMonths.indexOf(currentMonth);
    if (currentIndex < activeMonths.length - 1) {
      setCurrentMonth(activeMonths[currentIndex + 1]);
    }
  };

  const handleMonthChange = (e) => {
    setCurrentMonth(parseInt(e.target.value));
  };

  const handleDayClick = (day) => {
    if (!isEditMode || !activeTool) return;
    const key = `${monthNum}-${day}`;

    if (activeTool === 'Dragonboat Practice') {
      onAddCustomPractice(key, activeTool);
      return;
    }

    const existingEvents = events[key] || [];
    const existingPractice = existingEvents.find((e) => e.type === 'Practice' && e.name === activeTool);

    if (existingPractice) onRemoveCustomPractice(key, activeTool);
    else onAddCustomPractice(key, activeTool);
  };

  const handleEventClick = (day, event) => {
    if (!isEditMode || event.type !== 'Practice') return;

    const key = `${monthNum}-${day}`;

    onRemoveCustomPractice(key, event.name);
  };

  const currentActiveIndex = activeMonths.indexOf(currentMonth);
  const isPrevDisabled = currentActiveIndex === 0;
  const isNextDisabled = currentActiveIndex === activeMonths.length - 1;

  // Build calendar grid
  const calendarDays = [];
  
  // Empty cells before month starts
  for (let i = 0; i < month.startDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="min-h-[116px]" />);
  }
  
  // Days of the month
  for (let day = 1; day <= month.days; day++) {
    const key = `${monthNum}-${day}`;
    const dayEvents = events[key] || [];
    
    calendarDays.push(
      <CalendarDay
        key={key}
        day={day}
        events={dayEvents}
        isEditMode={isEditMode}
        isToolActive={!!activeTool}
        onClick={() => handleDayClick(day)}
        onEventClick={(event) => handleEventClick(day, event)}
      />
    );
  }

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold text-white mb-6">📅 2027 Season Calendar</h3>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-5">
        {isEditMode && (
          <div className="mb-5 pb-5 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-3">
              {PRACTICE_TOOLS.map((tool) => (
                <button
                  key={tool.name}
                  onClick={() => setActiveTool((current) => current === tool.name ? null : tool.name)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${activeTool === tool.name ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-primary/30 hover:bg-primary/5'}`}
                >
                  {tool.label}
                </button>
              ))}
              {activeTool && (
                <button
                  onClick={() => setActiveTool(null)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Exit edit tool
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              {activeTool
                ? activeTool === 'Dragonboat Practice'
                  ? 'Click dates to add Dragonboat Practice. Use the × on a practice to remove one instance.'
                  : `Click dates to add or remove ${activeTool}. Use the × on a practice to remove it.`
                : 'Choose a calendar edit tool, then click dates to add practices. Use the × on a practice pill to remove it.'}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevMonth}
            disabled={isPrevDisabled}
            className="bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-all"
          >
            ← Previous
          </button>
          
          <select
            value={currentMonth}
            onChange={handleMonthChange}
            className="px-6 py-2 text-lg font-semibold border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {activeMonths.map(m => (
              <option key={m} value={m}>
                {MONTHS_DATA[m].name} 2027
              </option>
            ))}
          </select>
          
          <button
            onClick={handleNextMonth}
            disabled={isNextDisabled}
            className="bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-all"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-5">
        <div className="grid grid-cols-7 gap-1">
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
            <div key={day} className="text-center font-bold text-primary py-4 text-base uppercase">
              {day}
            </div>
          ))}
          
          {calendarDays}
        </div>
      </div>

    </div>
  );
}
