export interface ProductHistoryResponse {
    history: History[];
}

export interface History {
    productId: string;
    userId:    string;
    changes:   Changes;
    createdAt: Date | string;
}

export interface Changes {
    providers?: Providers;
    name?:      Name;
    price?:     Price;
    stock?: Stock;
    uncounted?: Uncounted;
    barCode?: BarCode;
    rfef?: RFEF;
    basePrice?: BasePrice;
    photoUrl?: PhotoUrl
}

export interface PhotoUrl{
    from: string;
    to: string;
}
export interface RFEF {
    from: string | number;
    to: string | number;
}
export interface BarCode {
    from: string | number;
    to: string | number;
}
export interface Uncounted {
    from :boolean;
    to: boolean | string;
}
export interface Name {
    from: number | string | string[];
    to:   number | string | string[];
}

export interface Price {
    from: number;
    to:   number;
}
export interface BasePrice {
    from: number;
    to:   number;
}
export interface Stock {
    from :number;
    to: string | number;
}
export interface Providers {
    from: string[];
    to:   string[] | string;
}

