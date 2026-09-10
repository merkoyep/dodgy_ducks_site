export default function SeasonNotePanel({ note, isEditMode, onEdit }) {
  if (!note && !isEditMode) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-primary">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-2">Season note</div>
          {note ? (
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{note}</p>
          ) : (
            <p className="text-gray-400 italic">No season note added yet.</p>
          )}
        </div>
        {isEditMode && (
          <button
            type="button"
            onClick={onEdit}
            className="shrink-0 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-semibold shadow-sm"
          >
            Edit note
          </button>
        )}
      </div>
    </div>
  );
}
