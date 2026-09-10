import { useEffect, useState } from 'react';
import Modal from './Modal';

export default function RegattaNoteModal({ isOpen, item, isEditMode, onClose, onSave }) {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setNotes(item?.Notes || '');
  }, [item]);

  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Regatta Notes · ${item.Item}`}>
      <div className="space-y-4">
        {isEditMode ? (
          <>
            <label className="block text-sm font-semibold text-gray-700">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Add regatta notes"
            />
            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700">Cancel</button>
              <button
                onClick={() => onSave(item, { Notes: notes.trim() })}
                className="px-5 py-2 rounded-lg bg-primary text-white font-semibold"
              >
                Save notes
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-700 whitespace-pre-wrap min-h-[120px]">
            {item.Notes || 'No notes'}
          </div>
        )}
      </div>
    </Modal>
  );
}
