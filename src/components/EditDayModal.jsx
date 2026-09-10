import Modal from './Modal';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function EditDayModal({ 
  isOpen, 
  onClose, 
  month, 
  day, 
  events,
  onAddPractice,
  onRemovePractice
}) {
  const key = `${month}-${day}`;
  const practices = events.filter(e => e.type === 'Practice');

  const handleAdd = async (practiceName) => {
    await onAddPractice(key, practiceName);
  };

  const handleRemove = async (practice) => {
    await onRemovePractice(key, practice);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Edit ${MONTH_NAMES[month - 1]} ${day}, 2027`}
    >
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3">Practices on this day</h4>
        
        {practices.length > 0 ? (
          <div className="space-y-2">
            {practices.map((practice, idx) => (
              <div
                key={idx}
                className="bg-gray-50 p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold text-gray-800">{practice.name}</div>
                  <div className="text-sm text-gray-600">{practice.fullName}</div>
                </div>
                <button
                  onClick={() => handleRemove(practice)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-6">No practices on this day</p>
        )}
      </div>

      <div>
        <h4 className="font-semibold text-gray-700 mb-3">Add Practice</h4>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => handleAdd('Dragonboat Practice')}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          >
            + Dragonboat Practice
          </button>
          <button
            onClick={() => handleAdd('Outrigger Practice')}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          >
            + Outrigger Practice
          </button>
          <button
            onClick={() => handleAdd('Training Camp')}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          >
            + Training Camp
          </button>
          <button
            onClick={() => handleAdd('Afterburn')}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          >
            + Afterburn
          </button>
        </div>
      </div>
    </Modal>
  );
}
