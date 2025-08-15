
import { GoogleGenAI, Type } from "@google/genai";
import { type Product } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            productName: {
                type: Type.STRING,
                description: "Vollständiger Name des Produkts."
            },
            description: {
                type: Type.STRING,
                description: "Eine kurze, prägnante technische Beschreibung des Produkts (max. 2-3 Sätze)."
            },
            offers: {
                type: Type.ARRAY,
                description: "Eine Liste von Angeboten von verschiedenen Händlern.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        retailer: {
                            type: Type.STRING,
                            description: "Name des Online-Händlers (z.B. 'TechShop DE', 'KameraWelt', 'PC-Paradies')."
                        },
                        price: {
                            type: Type.NUMBER,
                            description: "Preis des Produkts in Euro."
                        },
                        currency: {
                            type: Type.STRING,
                            description: "Währungssymbol, sollte immer '€' sein."
                        },
                        link: {
                            type: Type.STRING,
                            description: "Eine fiktive, aber glaubwürdige URL zum Produktangebot."
                        },
                    },
                    required: ["retailer", "price", "currency", "link"],
                },
            },
        },
        required: ["productName", "description", "offers"],
    }
};

export const fetchProducts = async (category: string, query: string): Promise<Product[]> => {
    const prompt = `Fungere als Preisvergleichs-API. Gib eine Liste von 3 bis 5 fiktiven Produkten für die Kategorie "${category}" zurück, die zur Suchanfrage "${query}" passen. Erfinde realistische Produktnamen, Beschreibungen und Preise in Euro von verschiedenen fiktiven deutschen Online-Händlern. Die Antwort muss ausschließlich ein JSON-Array sein, das dem bereitgestellten Schema entspricht.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.7,
            }
        });

        const jsonText = response.text.trim();
        const products = JSON.parse(jsonText);
        
        // Sort offers by price for each product
        products.forEach((product: Product) => {
            if (product.offers) {
                product.offers.sort((a, b) => a.price - b.price);
            }
        });

        return products as Product[];
    } catch (error) {
        console.error("Error fetching products from Gemini API:", error);
        throw new Error("Failed to parse product data.");
    }
};
