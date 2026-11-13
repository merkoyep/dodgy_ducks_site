import { useState } from 'react';
import { formatDate } from '../utils/calendarEvents';

const typeBadgeColors = {
  regatta: 'bg-red-100 text-red-600',
  practice: 'bg-green-100 text-green-600',
  travel: 'bg-orange-100 text-orange-600'
};

export default function ItemSection({ 
  title, 
  items, 
  type, 
  isEditMode, 
  onRemove,
  onOpenAddModal,
  onEdit,
  onOpenNotes,
  practiceMeta
}) {
  const [showPracticeMeta, setShowPracticeMeta] = useState(false);

  return (
    <div className="bg-gray-50 rounded-xl p-6 min-h-[200px]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${typeBadgeColors[type]}`}>
            {items.length}
          </span>
        </div>
        {isEditMode && (
          <button
            onClick={onOpenAddModal}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md"
          >
            + Add
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No items</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-primary/50 transition-all"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 mb-1 flex items-center gap-2 flex-wrap">
                    <span>{item.Item}</span>
                    {item._calendarOnly && (
                      <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-xs font-bold">Calendar scheduled</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-2 flex-wrap">
                    {item.Dates && (
                      <span className="text-primary font-medium">
                        📅 {formatDate(item.Dates)}
                      </span>
                    )}
                    {type === 'regatta' && (
                      <button
                        onClick={() => onOpenNotes && onOpenNotes(item)}
                        className="text-sm text-primary hover:text-primary/80 font-medium"
                      >
                        {item.Notes ? 'View notes' : isEditMode ? 'Add notes' : 'No notes'}
                      </button>
                    )}
                    {type !== 'regatta' && item.Notes}
                    {item._scheduleLabel && (
                      <span className="text-gray-500">
                        {item.Notes && ' • '}{item._scheduleLabel}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {item['Cost PP (24ppl)'] || item.Price}
                    </div>
                    {type === 'regatta' && item.Math && (
                      <div className="text-xs text-gray-500 max-w-[220px] truncate">{item.Math}</div>
                    )}
                  </div>
                  {isEditMode && type === 'regatta' && onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-all"
                    >
                      Edit pricing
                    </button>
                  )}
                  {isEditMode && !item._calendarOnly && (
                    <button
                      onClick={() => onRemove(item.Item)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-all"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {type === 'practice' && practiceMeta && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setShowPracticeMeta(!showPracticeMeta)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-all"
              >
                <span className="font-semibold text-gray-800">Practice fee calculation</span>
                <span className="text-primary font-bold text-lg">{showPracticeMeta ? '−' : '+'}</span>
              </button>
              {showPracticeMeta && (
                <div className="px-4 pb-4 text-sm text-gray-700 space-y-2 border-t border-gray-100">
                  <div className="pt-3 flex justify-between">
                    <span>Scheduled dragonboat practices</span>
                    <span className="font-semibold">{practiceMeta.practiceCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunnyside rate</span>
                    <span className="font-semibold">${practiceMeta.practiceRate.toFixed(2)}/practice</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Afterburn sessions</span>
                    <span className="font-semibold">{practiceMeta.afterburnCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Afterburn rate</span>
                    <span className="font-semibold">${practiceMeta.afterburnRate.toFixed(2)}/session</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Headcount</span>
                    <span className="font-semibold">{practiceMeta.teamSize}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
