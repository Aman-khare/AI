
import React, { useState, useEffect } from 'react';
import { getSimpleAIResponse } from '../services/geminiService';

// Interface for reminders
interface Reminder {
  date: Date;
  text: string;
}

const CalendarView: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [thought, setThought] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // State for reminders feature
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [reminderInput, setReminderInput] = useState('');
  const [occasionQuote, setOccasionQuote] = useState('');
  const [isModalLoading, setIsModalLoading] = useState(false);


  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  const firstDayOfMonth = new Date(year, date.getMonth(), 1).getDay();
  const daysInMonth = new Date(year, date.getMonth() + 1, 0).getDate();
  
  const todayDate = new Date();
  const today = todayDate.getDate();
  const currentMonth = todayDate.getMonth() === date.getMonth();
  const currentYear = todayDate.getFullYear() === year;

  useEffect(() => {
    const fetchThought = async () => {
      setIsLoading(true);
      const prompt = "Give me a short, inspiring 'thought of the day' for someone focusing on their mental wellness. Make it concise and positive.";
      const response = await getSimpleAIResponse(prompt);
      setThought(response);
      setIsLoading(false);
    };
    fetchThought();
  }, []);

  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };
  
  const handleDateClick = async (day: number) => {
    const clickedDate = new Date(year, date.getMonth(), day);
    setSelectedDate(clickedDate);

    const existingReminder = reminders.find(r => r.date.toDateString() === clickedDate.toDateString());
    setReminderInput(existingReminder ? existingReminder.text : '');

    setIsModalLoading(true);
    setOccasionQuote(''); // Reset previous quote

    const prompt = `Is ${clickedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} a special occasion or holiday (e.g., New Year, Christmas, World Mental Health Day)? If so, provide a short, uplifting quote related to it. If not, provide a general positive quote for the day. Keep it to one sentence.`;
    const quote = await getSimpleAIResponse(prompt);
    setOccasionQuote(quote);
    setIsModalLoading(false);
  };

  const handleSaveReminder = () => {
    if (!selectedDate) return;

    const existingIndex = reminders.findIndex(r => r.date.toDateString() === selectedDate.toDateString());

    if (reminderInput.trim()) {
        const newReminder = { date: selectedDate, text: reminderInput.trim() };
        if (existingIndex > -1) {
            const updatedReminders = [...reminders];
            updatedReminders[existingIndex] = newReminder;
            setReminders(updatedReminders);
        } else {
            setReminders([...reminders, newReminder]);
        }
    } else { // If input is empty, treat it as a delete
        if (existingIndex > -1) {
            setReminders(reminders.filter((_, index) => index !== existingIndex));
        }
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
      setSelectedDate(null);
      setReminderInput('');
      setOccasionQuote('');
  };

  return (
    <div className="p-8 h-full overflow-y-auto text-gray-200">
      <h2 className="text-4xl font-bold mb-6 text-white">Calendar & Wellness</h2>
      
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
        <h3 className="text-2xl font-semibold mb-3 text-blue-300">Thought of the Day</h3>
        {isLoading ? (
          <p className="text-gray-400 animate-pulse">Fetching today's inspiration...</p>
        ) : (
          <p className="text-lg italic text-gray-300">"{thought}"</p>
        )}
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-700 transition" aria-label="Previous month">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h3 className="text-2xl font-semibold">{`${month} ${year}`}</h3>
          <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-700 transition" aria-label="Next month">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="font-bold text-gray-400 py-2">{day}</div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, day) => {
            const dayNumber = day + 1;
            const isToday = dayNumber === today && currentMonth && currentYear;
            const dayDate = new Date(year, date.getMonth(), dayNumber);
            const hasReminder = reminders.some(r => r.date.toDateString() === dayDate.toDateString());

            return (
              <div
                key={dayNumber}
                role="button"
                tabIndex={0}
                onClick={() => handleDateClick(dayNumber)}
                onKeyPress={(e) => e.key === 'Enter' && handleDateClick(dayNumber)}
                className={`p-2 rounded-full flex items-center justify-center h-10 w-10 mx-auto cursor-pointer transition-colors relative ${
                  isToday ? 'bg-blue-600 text-white font-bold' : 'hover:bg-gray-700 text-gray-300'
                }`}
                aria-label={`Date ${dayNumber}, ${hasReminder ? 'has reminder' : 'no reminder'}`}
              >
                {dayNumber}
                {hasReminder && <div className="absolute bottom-1 right-1 h-2 w-2 bg-green-400 rounded-full shadow-md" aria-hidden="true"></div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reminder Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300" aria-modal="true" role="dialog">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
                <h3 className="text-2xl font-bold text-white mb-2">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h3>
                
                <div className="bg-gray-700 p-4 rounded-lg mb-4 min-h-[80px]">
                    <h4 className="font-semibold text-blue-300 mb-1">A thought for this day:</h4>
                    {isModalLoading ? (
                        <p className="text-gray-400 animate-pulse">Getting a thought for you...</p>
                    ) : (
                        <p className="italic text-gray-300">"{occasionQuote}"</p>
                    )}
                </div>

                <label htmlFor="reminder-input" className="sr-only">Reminder</label>
                <textarea
                    id="reminder-input"
                    value={reminderInput}
                    onChange={(e) => setReminderInput(e.target.value)}
                    placeholder="Add a reminder for this day..."
                    className="w-full h-28 p-3 bg-gray-900 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />

                <div className="flex justify-end mt-4 space-x-3">
                    <button onClick={handleCloseModal} className="px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold transition">
                        Cancel
                    </button>
                    <button onClick={handleSaveReminder} className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">
                        Save Reminder
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
