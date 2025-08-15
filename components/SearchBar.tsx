
import React, { useState } from 'react';

interface SearchBarProps {
    onSearch: (category: string, query: string) => void;
    isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
    const [category, setCategory] = useState<'PC-Hardware' | 'Kameras'>('PC-Hardware');
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(category, query);
    };

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="flex mb-4 rounded-lg bg-gray-200 dark:bg-gray-700 p-1">
                <button
                    onClick={() => setCategory('PC-Hardware')}
                    className={`w-1/2 p-2 rounded-md text-sm font-medium transition-colors ${category === 'PC-Hardware' ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow' : 'text-gray-600 dark:text-gray-300'}`}
                >
                    PC-Hardware
                </button>
                <button
                    onClick={() => setCategory('Kameras')}
                    className={`w-1/2 p-2 rounded-md text-sm font-medium transition-colors ${category === 'Kameras' ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow' : 'text-gray-600 dark:text-gray-300'}`}
                >
                    Kameras
                </button>
            </div>
            <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={category === 'PC-Hardware' ? 'z.B. GeForce RTX 4080' : 'z.B. Sony Alpha 7 IV'}
                    className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                    disabled={isLoading}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </form>
        </div>
    );
};
