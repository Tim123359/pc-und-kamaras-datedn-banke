
import React from 'react';
import { type Product } from '../types';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const bestOffer = product.offers && product.offers.length > 0 ? product.offers[0] : null;

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-shadow hover:shadow-lg">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{product.productName}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 mb-3">{product.description}</p>
            
            {bestOffer ? (
                <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/50 p-3 rounded-lg">
                    <div>
                        <p className="text-sm text-green-800 dark:text-green-300">Bestes Angebot von <span className="font-semibold">{bestOffer.retailer}</span></p>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-400">{bestOffer.price.toFixed(2)} {bestOffer.currency}</p>
                    </div>
                    <a
                        href={bestOffer.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
                    >
                        Zum Shop
                    </a>
                </div>
            ) : (
                <p className="text-gray-500">Keine Angebote gefunden.</p>
            )}
        </div>
    );
};
