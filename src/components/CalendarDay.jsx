import { useState } from 'react';

const eventColors = {
  regatta: 'bg-red-500',
  practice: 'bg-green-500',
  holiday: 'bg-red-400',
  feesdue: 'bg-orange-500'
};

function getEventColor(event) {
  if (event.type.toLowerCase() !== 'practice') {
    return eventColors[event.type.toLowerCase()];
  }

  if (event.name === 'Dragonboat Practice') return 'bg-green-600';
  if (event.name === 'Outrigger Practice') return 'bg-emerald-600';
  if (event.name === 'Training Camp') return 'bg-blue-900';
  if (event.name === 'Afterburn') return 'bg-orange-500';

  return eventColors.practice;
}

export default function CalendarDay({ day, events, isEditMode, onClick, isToolActive, onEventClick }) {
  const [tooltip, setTooltip] = useState(null);

  const showTooltip = (event, eventData) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      text: eventData.fullName,
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const hideTooltip = () => {
    setTooltip(null);
  };

  return (
    <>
      <div
        className={`border border-gray-200 p-2.5 min-h-[116px] bg-white rounded-md relative ${
          isEditMode && isToolActive ? 'hover:bg-blue-50 hover:border-primary cursor-pointer' : ''
        }`}
        onClick={onClick}
      >
        <div className="text-base font-semibold text-gray-800 mb-1">{day}</div>
        
        <div className="space-y-1">
          {events.map((event, idx) => (
            <div
              key={idx}
              className={`${getEventColor(event)} text-white text-xs px-2 py-1 rounded transition-transform truncate ${isEditMode && event.type === 'Practice' ? 'pr-6' : 'cursor-pointer hover:scale-105'} relative`}
              onMouseEnter={(e) => showTooltip(e, event)}
              onMouseLeave={hideTooltip}
              onClick={(e) => {
                if (!(isEditMode && event.type === 'Practice')) {
                  e.stopPropagation();
                }
              }}
            >
              {event.name}
              {isEditMode && event.type === 'Practice' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick?.(event);
                  }}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/20 hover:bg-white/30 text-white text-[10px] leading-none flex items-center justify-center"
                  aria-label={`Remove ${event.name}`}
                  title={`Remove ${event.name}`}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {tooltip && (
        <div
          className="fixed bg-gray-800 text-white px-3 py-2 rounded-lg text-sm shadow-lg z-[10000] pointer-events-none border-2 border-white/20"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {tooltip.text}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="border-8 border-transparent border-t-gray-800" />
          </div>
        </div>
      )}
    </>
  );
}
