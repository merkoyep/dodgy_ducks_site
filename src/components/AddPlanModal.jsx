import { useEffect, useState } from 'react';
import Modal from './Modal';

export default function AddPlanModal({ isOpen, options, selectedOption, onClose, onSave }) {
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [copyFrom, setCopyFrom] = useState(selectedOption || '');

  useEffect(() => {
    if (!isOpen) return;
    setName('');
    setDetails('');
    setCopyFrom(selectedOption || options[0]?.id || '');
  }, [isOpen, selectedOption, options]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Season Plan">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Plan key</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Portland"
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Display name</label>
          <input
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="e.g. Portland Worlds"
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Copy items from</label>
          <select
            value={copyFrom}
            onChange={(e) => setCopyFrom(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white"
          >
            {options.map((option) => (
              <option key={option.id} value={option.id}>{option.details}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700">Cancel</button>
          <button
            onClick={() => onSave({
              name: name.trim(),
              details: (details || name).trim(),
              copyFrom
            })}
            disabled={!name.trim() || !copyFrom}
            className="px-5 py-2 rounded-lg bg-primary text-white font-semibold disabled:opacity-50"
          >
            Add plan
          </button>
        </div>
      </div>
    </Modal>
  );
}
