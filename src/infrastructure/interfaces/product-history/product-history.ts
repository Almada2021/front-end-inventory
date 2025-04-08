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
}

export interface Name {
    from: number | string | string[];
    to:   number | string | string[];
}

export interface Price {
    from: number;
    to:   number;
}

export interface Providers {
    from: string[];
    to:   string[] | string;
}

