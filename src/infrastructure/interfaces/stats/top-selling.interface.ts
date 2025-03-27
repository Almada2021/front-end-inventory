export interface TopSellingResponse {
    success: boolean;
    data:    Datum[];
}

export interface Datum {
    salesStats:     SalesStats;
    popularity:     Popularity;
    _id:            string;
    product:        Product;
    __v:            number;
    createdAt:      Date;
    currentStock:   number;
    historicalData: HistoricalDatum[];
    isLowStock:     boolean;
    lastUpdated:    Date;
    updatedAt:      Date;
}

export interface HistoricalDatum {
    date:     Date;
    stock:    number;
    sales:    number;
    restocks: number;
    _id:      string;
}

export interface Popularity {
    percentile: number;
    rank:       number;
}

export interface Product {
    _id:       string;
    name:      string;
    price:     number;
    stock:     number;
    uncounted: boolean;
    photoUrl:  string;
    basePrice: number;
    providers: string[];
    salesIds:  string[];
    orderIds:  string[];
    barCode:   string;
    __v:       number;
    method:    string[];
}

export interface SalesStats {
    daily: Daily;
}

export interface Daily {
    quantity: number;
    amount:   number;
    date:     Date;
}
