
import React from 'react';
import { type SavedPDF } from '../types';

interface DownloadManagerProps {
    savedPDFs: SavedPDF[];
    onDelete: (id: string) => void;
    onShare: (pdf: SavedPDF) => void;
}

export const DownloadManager: React.FC<DownloadManagerProps> = ({ savedPDFs, onDelete, onShare }) => {
    
    const downloadPDF = (pdf: SavedPDF) => {
        const link = document.createElement('a');
        link.href = pdf.data;
        link.download = pdf.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    return (
        <div className="pb-20">
            <h2 className="text-2xl font-bold mb-4">Meine Downloads</h2>
            {savedPDFs.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <p className="mt-2">Sie haben noch keine PDFs exportiert.</p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {savedPDFs.map((pdf) => (
                        <li key={pdf.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{pdf.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{pdf.date}</p>
                            </div>
                            <div className="flex items-center space-x-2 ml-2">
                                {!!navigator.share && (
                                    <button onClick={() => onShare(pdf)} title="Teilen" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                        </svg>
                                    </button>
                                )}
                                <button onClick={() => downloadPDF(pdf)} title="Herunterladen" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <button onClick={() => onDelete(pdf.id)} title="Löschen" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
