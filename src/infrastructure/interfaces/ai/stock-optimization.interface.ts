export interface StockOptimizationResponse {
    predictions: Prediction[];
    comments:    string;
}

export interface Prediction {
    Producto:            string;
    StockRecomendado:    number;
    DemandaPronosticada: number;
    StockSeguridad:      number;
}
