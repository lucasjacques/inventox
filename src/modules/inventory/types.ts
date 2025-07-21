import { Group } from "../groups/types";
import { Product } from "../products/types";

export interface Inventory {
  groups: Group;
  products: Product;
  quantity: number;
}