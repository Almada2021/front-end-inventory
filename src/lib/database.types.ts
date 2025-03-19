export type PaymentMethod = "cash" | "card" | "transfer";

export const DEFAULT_DENOMINATIONS = [
  "100000",
  "50000",
  "20000",
  "10000",
  "5000",
  "2000",
  "1000",
  "500",
  "100",
  "50",
];


export const ROLES: { [key: string]: string} = {
  "user": "Usuario",
  "admin": "Administrador",
}