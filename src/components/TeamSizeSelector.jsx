export default function TeamSizeSelector({ teamSize, onChange }) {
  const options = Array.from({ length: 11 }, (_, i) => i + 20);

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 mb-6 flex flex-wrap items-center gap-6">
      <div>
        <label htmlFor="teamSize" className="block text-sm font-semibold text-gray-600 mb-1">
          Team Headcount
        </label>
        <select
          id="teamSize"
          value={teamSize}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="px-4 py-2 border-2 border-primary/20 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {options.map((n) => (
            <option key={n} value={n}>{n} paddlers</option>
          ))}
        </select>
      </div>


    </div>
  );
}
