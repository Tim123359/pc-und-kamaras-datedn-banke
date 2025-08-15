
import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ProductCard } from './components/ProductCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { BottomNav } from './components/BottomNav';
import { DownloadManager } from './components/DownloadManager';
import { fetchProducts } from './services/geminiService';
import { type Product, type SavedPDF } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

// These would be available globally if loaded from index.html
declare const jspdf: any;
declare const html2canvas: any;

const App: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<'search' | 'downloads'>('search');
    const [savedPDFs, setSavedPDFs] = useLocalStorage<SavedPDF[]>('savedPdfs', []);
    const resultsRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = useCallback(async (category: string, query: string) => {
        if (!query) {
            setError("Bitte geben Sie einen Suchbegriff ein.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setProducts([]);
        setSearchQuery(query);

        try {
            const fetchedProducts = await fetchProducts(category, query);
            setProducts(fetchedProducts);
        } catch (err) {
            console.error(err);
            setError("Fehler bei der Produktsuche. Bitte versuchen Sie es später erneut.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const exportToPDF = useCallback(async () => {
        if (!resultsRef.current || products.length === 0) return;

        try {
            const canvas = await html2canvas(resultsRef.current, { 
                useCORS: true, 
                backgroundColor: '#f9fafb' 
            });
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = jspdf;
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            
            const timestamp = new Date().toISOString();
            const filename = `Preisvergleich-${searchQuery.replace(/\s/g, '_')}-${Date.now()}.pdf`;
            
            const pdfDataUri = pdf.output('datauristring');

            const newSavedPDF: SavedPDF = {
                id: timestamp,
                name: filename,
                date: new Date().toLocaleString('de-DE'),
                data: pdfDataUri
            };

            setSavedPDFs(prev => [newSavedPDF, ...prev]);
            pdf.save(filename);

        } catch (error) {
            console.error("Fehler beim Erstellen des PDFs:", error);
            setError("PDF konnte nicht erstellt werden.");
        }
    }, [products, searchQuery, setSavedPDFs]);

    const deletePDF = (id: string) => {
        setSavedPDFs(pdfs => pdfs.filter(pdf => pdf.id !== id));
    };

    const sharePDF = async (pdf: SavedPDF) => {
        if (!navigator.share) {
            alert("Die Web Share API wird von Ihrem Browser nicht unterstützt.");
            return;
        }

        try {
            const response = await fetch(pdf.data);
            const blob = await response.blob();
            const file = new File([blob], pdf.name, { type: 'application/pdf' });
            
            await navigator.share({
                title: pdf.name,
                text: `Preisvergleichs-PDF: ${pdf.name}`,
                files: [file],
            });
        } catch (error) {
            console.error('Fehler beim Teilen:', error);
            alert('PDF konnte nicht geteilt werden.');
        }
    };


    return (
        <div className="min-h-screen font-sans bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto p-4 max-w-2xl">
                {activeView === 'search' && (
                    <>
                        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                        
                        {isLoading && <LoadingSpinner />}
                        
                        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
                        
                        {!isLoading && products.length > 0 && (
                           <>
                             <div className="flex justify-between items-center my-4">
                                <h2 className="text-xl font-bold">Suchergebnisse</h2>
                                <button
                                    onClick={exportToPDF}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    PDF Export
                                </button>
                             </div>
                             <div ref={resultsRef} className="space-y-4">
                                {products.map((product, index) => (
                                    <ProductCard key={`${product.productName}-${index}`} product={product} />
                                ))}
                             </div>
                           </>
                        )}
                        
                        {!isLoading && !error && products.length === 0 && (
                            <div className="text-center text-gray-500 mt-10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Keine Produkte gefunden</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Starten Sie eine Suche, um Produkte zu finden.</p>
                            </div>
                        )}
                    </>
                )}
                {activeView === 'downloads' && (
                    <DownloadManager savedPDFs={savedPDFs} onDelete={deletePDF} onShare={sharePDF} />
                )}
            </main>
            <BottomNav activeView={activeView} setActiveView={setActiveView} pdfCount={savedPDFs.length}/>
        </div>
    );
};

export default App;
