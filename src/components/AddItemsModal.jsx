import Modal from './Modal';
import { formatDate } from '../utils/calendarEvents';

function ItemMeta({ item }) {
  return (
    <div className="text-sm text-gray-600">
      {item.Dates && formatDate(item.Dates)}
      {item.Dates && (item.Notes || item.Price) && ' • '}
      {item.Notes}
      {item.Notes && item.Price && ' • '}
      {item.Price}
    </div>
  );
}

export default function AddItemsModal({ 
  isOpen, 
  onClose, 
  title,
  currentItems, 
  availableItems, 
  onAdd,
  onRemove,
  onCreateNew,
  createNewLabel = '+ New regatta'
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {onCreateNew && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={onCreateNew}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          >
            {createNewLabel}
          </button>
        </div>
      )}

      {currentItems.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-3">Current Items</h4>
          <div className="space-y-2">
            {currentItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-50 p-4 rounded-lg flex justify-between items-center"
              >
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{item.Item}</div>
                  <ItemMeta item={item} />
                </div>
                <button
                  onClick={() => onRemove(item.Item)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all ml-4"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {availableItems.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Available to Add</h4>
          <div className="space-y-2">
            {availableItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-50 p-4 rounded-lg flex justify-between items-center"
              >
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{item.Item}</div>
                  <ItemMeta item={item} />
                </div>
                <button
                  onClick={() => onAdd(item.Item)}
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all ml-4"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentItems.length === 0 && availableItems.length === 0 && (
        <p className="text-gray-400 text-center py-12">No items available</p>
      )}
    </Modal>
  );
}
