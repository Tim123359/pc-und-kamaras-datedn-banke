
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="bg-gray-800 dark:bg-gray-900 shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 py-3 max-w-2xl">
                <h1 className="text-xl font-bold text-white text-center flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Preis-Radar
                </h1>
            </div>
        </header>
    );
};
