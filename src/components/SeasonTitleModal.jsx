import { useEffect, useState } from 'react';
import Modal from './Modal';

export default function SeasonTitleModal({ isOpen, option, onClose, onSave }) {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setTitle(option?.details || option?.name || '');
  }, [isOpen, option]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Season Title">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Season title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Local Only"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <p className="text-sm text-gray-500">
          This changes the public display title only. The internal plan key stays the same.
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700">Cancel</button>
          <button
            onClick={() => onSave(title.trim())}
            disabled={!title.trim()}
            className="px-5 py-2 rounded-lg bg-primary text-white font-semibold disabled:opacity-50"
          >
            Save title
          </button>
        </div>
      </div>
    </Modal>
  );
}
