export default function Header({
  isEditMode,
  onToggleEdit,
  canEdit = false,
  activeTab = 'home',
  onTabChange = () => {},
}) {
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'overview', label: 'Season Plans' },
    { id: 'constitution', label: 'Constitution' },
  ];

  return (
    <header className='text-white mb-10'>
      <div className='flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-center'>
        <div>
          <h1 className='text-4xl font-bold mb-2 drop-shadow-lg'>Team TBD</h1>
        </div>
        {canEdit && (
          <div className='flex items-center gap-3'>
            {!isEditMode ? (
              <button
                onClick={onToggleEdit}
                className='bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl'
              >
                ✏️ Enable Editing
              </button>
            ) : (
              <button
                onClick={onToggleEdit}
                className='bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl'
              >
                Disable Editing
              </button>
            )}
          </div>
        )}
      </div>

      <nav
        className='mt-6 bg-white/10 border border-white/20 rounded-2xl p-2 shadow-lg backdrop-blur-sm'
        aria-label='Main navigation'
      >
        <div className='flex flex-wrap gap-2'>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id || (activeTab === 'season' && tab.id === 'overview');
            return (
              <button
                key={tab.id}
                type='button'
                onClick={() => onTabChange(tab.id)}
                className={`px-5 py-3 rounded-xl font-bold transition-all ${
                  isActive
                    ? 'bg-white text-primary shadow-md'
                    : 'text-white/85 hover:text-white hover:bg-white/10'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
