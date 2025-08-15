
export interface Offer {
    retailer: string;
    price: number;
    currency: string;
    link: string;
}

export interface Product {
    productName: string;
    description: string;
    offers: Offer[];
}

export interface SavedPDF {
    id: string;
    name: string;
    date: string;
    data: string; // Data URI for the PDF
}
