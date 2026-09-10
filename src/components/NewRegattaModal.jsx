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

export default function NewRegattaModal({ isOpen, teamSize, onClose, onSave }) {
  const [itemName, setItemName] = useState('');
  const [dates, setDates] = useState('');
  const [notes, setNotes] = useState('');
  const [deadline, setDeadline] = useState('');
  const [pricingModel, setPricingModel] = useState('per_boat');
  const [boatCount, setBoatCount] = useState(1);
  const [pricePerBoat, setPricePerBoat] = useState('');
  const [pricePerPaddler, setPricePerPaddler] = useState('');
  const [paddlersPerBoat, setPaddlersPerBoat] = useState(20);
  const [taxPercent, setTaxPercent] = useState(13);

  const preview = useMemo(() => {
    const boats = parseNumber(boatCount);
    const ppBoat = parseNumber(pricePerBoat);
    const ppPaddler = parseNumber(pricePerPaddler);
    const paddlers = parseNumber(paddlersPerBoat);
    const tax = parseNumber(taxPercent);

    const rawTotal = pricingModel === 'per_paddler_x_boat'
      ? ppPaddler * paddlers * boats
      : ppBoat * boats;
    const totalCost = rawTotal * (1 + tax / 100);
    const costPP = teamSize > 0 ? totalCost / teamSize : 0;
    const math = pricingModel === 'per_paddler_x_boat'
      ? `${formatCurrency(ppPaddler)} × ${paddlers} paddlers × ${boats} boat${boats === 1 ? '' : 's'}${tax ? ` + ${tax}%` : ''}`
      : `${formatCurrency(ppBoat)} × ${boats} boat${boats === 1 ? '' : 's'}${tax ? ` + ${tax}%` : ''}`;
    const priceLabel = pricingModel === 'per_paddler_x_boat'
      ? `${formatCurrency(ppPaddler)}/paddler`
      : `${formatCurrency(ppBoat)}/boat`;

    return { rawTotal, totalCost, costPP, math, priceLabel };
  }, [boatCount, paddlersPerBoat, pricePerBoat, pricePerPaddler, pricingModel, taxPercent, teamSize]);

  const reset = () => {
    setItemName('');
    setDates('');
    setNotes('');
    setDeadline('');
    setPricingModel('per_boat');
    setBoatCount(1);
    setPricePerBoat('');
    setPricePerPaddler('');
    setPaddlersPerBoat(20);
    setTaxPercent(13);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Regatta">
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Regatta name</label>
            <input value={itemName} onChange={(e) => setItemName(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3" placeholder="e.g. Portland Worlds" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Dates</label>
            <input value={dates} onChange={(e) => setDates(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3" placeholder="e.g. 8/7 8/8" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Early bird deadline</label>
            <input value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3" placeholder="e.g. March 1" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3" placeholder="Optional notes" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Pricing model</label>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setPricingModel('per_boat')} className={`rounded-lg border px-4 py-3 text-left ${pricingModel === 'per_boat' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
              <div className="font-semibold text-gray-800">Per boat</div>
              <div className="text-sm text-gray-500">Fee × boats</div>
            </button>
            <button onClick={() => setPricingModel('per_paddler_x_boat')} className={`rounded-lg border px-4 py-3 text-left ${pricingModel === 'per_paddler_x_boat' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
              <div className="font-semibold text-gray-800">Per paddler × boat</div>
              <div className="text-sm text-gray-500">Fee × paddlers × boats</div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Boats</label>
            <input type="number" min="1" value={boatCount} onChange={(e) => setBoatCount(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tax / markup %</label>
            <input type="number" min="0" step="0.01" value={taxPercent} onChange={(e) => setTaxPercent(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3" />
          </div>
        </div>

        {pricingModel === 'per_boat' ? (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Price per boat</label>
            <input type="number" min="0" step="0.01" value={pricePerBoat} onChange={(e) => setPricePerBoat(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price per paddler</label>
              <input type="number" min="0" step="0.01" value={pricePerPaddler} onChange={(e) => setPricePerPaddler(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Paddlers per boat</label>
              <input type="number" min="1" step="1" value={paddlersPerBoat} onChange={(e) => setPaddlersPerBoat(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3" />
            </div>
          </div>
        )}

        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-600">Math</span><span className="font-semibold text-right">{preview.math}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Raw price (CAD)</span><span className="font-semibold">{formatCurrency(preview.rawTotal)}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Total team cost</span><span className="font-semibold">{formatCurrency(preview.totalCost)}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Per person ({teamSize})</span><span className="font-semibold">{formatCurrency(preview.costPP)}</span></div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => { reset(); onClose(); }} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700">Cancel</button>
          <button
            onClick={() => {
              onSave({
                Item: itemName.trim(),
                Type: 'Regatta',
                Dates: dates.trim(),
                Notes: notes.trim(),
                'Early Bird deadline': deadline.trim(),
                Price: preview.priceLabel,
                'Raw Price (CAD)': preview.rawTotal.toFixed(2),
                Math: preview.math,
                'Total Cost': preview.totalCost.toFixed(2),
                'Cost PP (24ppl)': formatCurrency(preview.costPP)
              });
              reset();
            }}
            disabled={!itemName.trim()}
            className="px-5 py-2 rounded-lg bg-primary text-white font-semibold disabled:opacity-50"
          >
            Create regatta
          </button>
        </div>
      </div>
    </Modal>
  );
}
