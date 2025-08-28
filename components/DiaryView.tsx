
import React, { useState } from 'react';
import { DiaryEntry } from '../types';

const DiaryView: React.FC = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);

  const handleSave = () => {
    if (!newEntry.trim()) return;
    if (editingEntry) {
      setEntries(entries.map(e => e.id === editingEntry.id ? { ...e, content: newEntry } : e));
      setEditingEntry(null);
    } else {
      const entry: DiaryEntry = {
        id: Date.now().toString(),
        content: newEntry,
        date: new Date(),
      };
      setEntries([entry, ...entries]);
    }
    setNewEntry('');
  };

  const handleEdit = (entry: DiaryEntry) => {
    setEditingEntry(entry);
    setNewEntry(entry.content);
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  }

  return (
    <div className="p-8 h-full overflow-y-auto text-gray-200">
      <h2 className="text-4xl font-bold mb-6 text-white">Personal Diary</h2>
      <p className="mb-8 text-gray-400">A private space for your thoughts. Your entries are only saved on this device.</p>
      
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
        <textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="How are you feeling today?"
          className="w-full h-40 p-4 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />
        <div className="flex justify-end mt-4 space-x-4">
            {editingEntry && (
                <button onClick={() => { setEditingEntry(null); setNewEntry(''); }} className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold transition">
                    Cancel
                </button>
            )}
            <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">
                {editingEntry ? 'Update Entry' : 'Save Entry'}
            </button>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-semibold border-b border-gray-700 pb-2">Past Entries</h3>
        {entries.length === 0 ? (
          <p className="text-gray-500 italic">No entries yet. Write your first one above!</p>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="bg-gray-800 p-5 rounded-lg shadow-md transition hover:shadow-xl">
              <p className="text-gray-400 text-sm mb-2">
                {entry.date.toLocaleDateString()} - {entry.date.toLocaleTimeString()}
              </p>
              <p className="text-gray-200 whitespace-pre-wrap">{entry.content}</p>
              <div className="flex justify-end mt-4 space-x-2">
                <button onClick={() => handleEdit(entry)} className="text-sm text-blue-400 hover:underline">Edit</button>
                <button onClick={() => handleDelete(entry.id)} className="text-sm text-red-400 hover:underline">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DiaryView;
