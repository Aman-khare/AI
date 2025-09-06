
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (isExpanded: boolean) => void;
}

const NavItem: React.FC<{
  view: AppView;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  icon: React.ReactElement;
  label: string;
  isSidebarExpanded: boolean;
}> = ({ view, currentView, setCurrentView, icon, label, isSidebarExpanded }) => {
  const isActive = currentView === view;
  return (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center w-full px-4 py-3 rounded-lg text-left text-sm font-medium transition-all duration-200 ease-in-out ${
        isActive
          ? 'bg-blue-600 text-white shadow-lg'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      } ${!isSidebarExpanded && 'justify-center'}`}
      aria-label={label}
    >
      <span className={isSidebarExpanded ? 'mr-4' : ''}>{icon}</span>
      {isSidebarExpanded && <span>{label}</span>}
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isSidebarExpanded, setIsSidebarExpanded }) => {
  return (
    <nav className={`h-full bg-gray-800 p-4 flex flex-col space-y-2 border-r border-gray-700 shadow-2xl transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-64' : 'w-20'}`}>
      <div className={`flex items-center mb-6 h-8 ${!isSidebarExpanded && 'justify-center'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 7a1 1 0 00-2 0v1a1 1 0 002 0V7zm4 0a1 1 0 00-2 0v1a1 1 0 002 0V7zm4 0a1 1 0 00-2 0v1a1 1 0 002 0V7z" clipRule="evenodd" />
        </svg>
        {isSidebarExpanded && <h1 className="text-xl font-bold text-white ml-2">AI</h1>}
      </div>
      <NavItem
        view={AppView.CHAT}
        currentView={currentView}
        setCurrentView={setCurrentView}
        label="Chats"
        icon={<ChatBubbleIcon />}
        isSidebarExpanded={isSidebarExpanded}
      />
      <NavItem
        view={AppView.DIARY}
        currentView={currentView}
        setCurrentView={setCurrentView}
        label="Personal Diary"
        icon={<BookOpenIcon />}
        isSidebarExpanded={isSidebarExpanded}
      />
      <NavItem
        view={AppView.CALENDAR}
        currentView={currentView}
        setCurrentView={setCurrentView}
        label="Calendar"
        icon={<CalendarIcon />}
        isSidebarExpanded={isSidebarExpanded}
      />
      <NavItem
        view={AppView.THERAPY}
        currentView={currentView}
        setCurrentView={setCurrentView}
        label="Session"
        icon={<MicrophoneIcon />}
        isSidebarExpanded={isSidebarExpanded}
      />
      <div className="flex-grow" />
      <NavItem
        view={AppView.EMERGENCY}
        currentView={currentView}
        setCurrentView={setCurrentView}
        label="Emergency"
        icon={<ExclamationIcon />}
        isSidebarExpanded={isSidebarExpanded}
      />
       <button
        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
        className="flex items-center justify-center w-full mt-2 py-3 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        aria-label={isSidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isSidebarExpanded ? <ChevronDoubleLeftIcon /> : <ChevronDoubleRightIcon />}
      </button>
    </nav>
  );
};

// SVG Icons
const ChatBubbleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V10a2 2 0 012-2h8z" />
  </svg>
);
const BookOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const MicrophoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);
const ExclamationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const ChevronDoubleLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </svg>
);

const ChevronDoubleRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </svg>
);

export default Sidebar;
