import { useMemo, useState } from 'react';
import Modal from './Modal';

function parseNumber(value) {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/[$,]/g, '').trim();
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : 0;
}

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

export default function NewTravelItemModal({ isOpen, teamSize, onClose, onSave }) {
  const [itemName, setItemName] = useState('');
  const [pricePerPerson, setPricePerPerson] = useState('');
  const [notes, setNotes] = useState('');

  const preview = useMemo(() => {
    const perPerson = parseNumber(pricePerPerson);
    const totalCost = perPerson * teamSize;
    return { perPerson, totalCost };
  }, [pricePerPerson, teamSize]);

  const reset = () => {
    setItemName('');
    setPricePerPerson('');
    setNotes('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Travel Line Item">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
          <input
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
            placeholder="e.g. Team dinner"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Price per person</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={pricePerPerson}
            onChange={(e) => setPricePerPerson(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
            placeholder="e.g. 75"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
            placeholder="Optional notes"
          />
        </div>

        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Per person</span>
            <span className="font-semibold">{formatCurrency(preview.perPerson)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Team headcount</span>
            <span className="font-semibold">{teamSize}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total team cost</span>
            <span className="font-semibold">{formatCurrency(preview.totalCost)}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => { reset(); onClose(); }}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave({
                Item: itemName.trim(),
                Type: 'Travel',
                Price: `${formatCurrency(preview.perPerson)} PP`,
                Notes: notes.trim(),
                Math: `${formatCurrency(preview.perPerson)} × ${teamSize} paddlers`,
                'Total Cost': preview.totalCost.toFixed(2),
                'Cost PP (24ppl)': formatCurrency(preview.perPerson),
              });
              reset();
            }}
            disabled={!itemName.trim() || preview.perPerson <= 0}
            className="px-5 py-2 rounded-lg bg-primary text-white font-semibold disabled:opacity-50"
          >
            Create travel item
          </button>
        </div>
      </div>
    </Modal>
  );
}
