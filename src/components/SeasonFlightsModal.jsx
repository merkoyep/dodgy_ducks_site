import { useEffect, useState } from 'react';
import Modal from './Modal';

function formatFlightEstimate(value) {
  const trimmed = value.trim();
  if (!trimmed) return '';

  const numeric = Number(trimmed.replace(/[$,]/g, ''));
  if (!Number.isFinite(numeric)) return trimmed;

  return `$${numeric.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function SeasonFlightsModal({ isOpen, option, onClose, onSave }) {
  const [estimatedFlights, setEstimatedFlights] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setEstimatedFlights(option?.estimatedFlights || '');
  }, [isOpen, option]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Estimated Flights">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated flights</label>
          <input
            value={estimatedFlights}
            onChange={(e) => setEstimatedFlights(e.target.value)}
            placeholder="e.g. $500.00 or TBD"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <p className="text-sm text-gray-500">
          This is shown separately from the main season cost and travel add-on.
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700">Cancel</button>
          <button
            onClick={() => onSave(formatFlightEstimate(estimatedFlights))}
            className="px-5 py-2 rounded-lg bg-primary text-white font-semibold"
          >
            Save flights
          </button>
        </div>
      </div>
    </Modal>
  );
}
