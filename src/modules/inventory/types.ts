import { Product } from "../products/types";

export interface Inventory {
  products: Product;
  quantity: number;
}