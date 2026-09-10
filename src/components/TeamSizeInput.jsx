export default function TeamSizeInput({ teamSize, onTeamSizeChange, label = 'Team Headcount', light = false }) {
  const handleChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      onTeamSizeChange('');
      return;
    }

    const parsed = parseInt(value, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      onTeamSizeChange(parsed);
    }
  };

  return (
    <div>
      <label htmlFor="teamSize" className={`block text-lg font-semibold mb-2 ${light ? 'text-white' : 'text-gray-700'}`}>
        {label}
      </label>
      <input
        id="teamSize"
        type="text"
        inputMode="numeric"
        value={teamSize}
        onChange={handleChange}
        className="px-5 py-3 text-base rounded-lg border-2 border-white bg-white min-w-[180px] font-medium shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30"
      />
    </div>
  );
}
