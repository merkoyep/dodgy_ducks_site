import { useEffect, useState } from 'react';
import Modal from './Modal';

export default function SeasonNoteModal({ isOpen, option, onClose, onSave }) {
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setNote(option?.note || '');
  }, [isOpen, option]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Season Note">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Note for {option?.details || option?.name}</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={7}
            placeholder="Add short context admins should know when comparing this season plan..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <p className="text-sm text-gray-500">Blank notes are hidden in the public overview.</p>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700">Cancel</button>
          <button
            onClick={() => onSave(note.trim())}
            className="px-5 py-2 rounded-lg bg-primary text-white font-semibold"
          >
            Save note
          </button>
        </div>
      </div>
    </Modal>
  );
}
