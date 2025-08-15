
import React from 'react';

interface BottomNavProps {
    activeView: 'search' | 'downloads';
    setActiveView: (view: 'search' | 'downloads') => void;
    pdfCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView, pdfCount }) => {
    const baseClass = "flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200";
    const activeClass = "text-blue-600 dark:text-blue-400";
    const inactiveClass = "text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300";

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-t-lg flex justify-around max-w-2xl mx-auto rounded-t-xl">
            <button
                onClick={() => setActiveView('search')}
                className={`${baseClass} ${activeView === 'search' ? activeClass : inactiveClass}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-xs mt-1">Suche</span>
            </button>
            <button
                onClick={() => setActiveView('downloads')}
                className={`${baseClass} ${activeView === 'downloads' ? activeClass : inactiveClass} relative`}
            >
                {pdfCount > 0 && (
                     <span className="absolute top-1 right-[25%] w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{pdfCount}</span>
                )}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="text-xs mt-1">Downloads</span>
            </button>
        </nav>
    );
};
