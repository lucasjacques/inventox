import { Group } from "../groups/types";

export interface Product {
  id: string,
  name: string,
  group: Group,
}