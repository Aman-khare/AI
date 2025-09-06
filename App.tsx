
import React, { useState } from 'react';
import { AppView } from './types';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import DiaryView from './components/DiaryView';
import CalendarView from './components/CalendarView';
import TherapyView from './components/TherapyView';
import EmergencyView from './components/EmergencyView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.CHAT);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const renderView = () => {
    switch (currentView) {
      case AppView.CHAT:
        return <ChatView />;
      case AppView.DIARY:
        return <DiaryView />;
      case AppView.CALENDAR:
        return <CalendarView />;
      case AppView.THERAPY:
        return <TherapyView />;
      case AppView.EMERGENCY:
        return <EmergencyView />;
      default:
        return <ChatView />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-900 text-gray-100 font-sans">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isSidebarExpanded={isSidebarExpanded}
        setIsSidebarExpanded={setIsSidebarExpanded}
      />
      <main className="flex-1 h-full overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
