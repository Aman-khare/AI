
import React, { useState, useEffect } from 'react';
import { getSimpleAIResponse } from '../services/geminiService';

const CalendarView: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [thought, setThought] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  const firstDayOfMonth = new Date(year, date.getMonth(), 1).getDay();
  const daysInMonth = new Date(year, date.getMonth() + 1, 0).getDate();
  const today = new Date().getDate();
  const currentMonth = new Date().getMonth() === date.getMonth();
  const currentYear = new Date().getFullYear() === year;

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
          <h3 className="text-2xl font-semibold">{`${month} ${year}`}</h3>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="font-bold text-gray-400">{day}</div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, day) => {
            const dayNumber = day + 1;
            const isToday = dayNumber === today && currentMonth && currentYear;
            return (
              <div
                key={dayNumber}
                className={`p-2 rounded-full flex items-center justify-center h-10 w-10 mx-auto ${
                  isToday ? 'bg-blue-600 text-white font-bold' : 'text-gray-300'
                }`}
              >
                {dayNumber}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
