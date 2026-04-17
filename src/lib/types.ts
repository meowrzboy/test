// Types for TableCRM API

export interface Contragent {
  id: number;
  name: string;
  phone?: string;
  // Add other fields as needed
}

export interface Warehouse {
  id: number;
  name: string;
}

export interface Paybox {
  id: number;
  name: string;
}

export interface Organization {
  id: number;
  name: string;
}

export interface PriceType {
  id: number;
  name: string;
}

export interface Nomenclature {
  id: number;
  name: string;
  price?: number;
  // Add other fields
}

export interface ProductItem {
  nomenclature_id: number;
  quantity: number;
  price: number;
}

export interface SalePayload {
  contragent_id?: number;
  organization_id: number;
  warehouse_id: number;
  paybox_id: number;
  price_type_id: number;
  products: ProductItem[];
  comment?: string;
  conduct?: boolean;
}