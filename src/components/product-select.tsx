import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Product } from "@/modules/products/types"

interface ProductSelectProps {
  products: Product[];
  onChange: (s: string) => void;
}

export const ProductSelect = ({
  products,
  onChange
}: ProductSelectProps) => {
  return (
    <Select onValueChange={(value) => onChange(value)}>
      <SelectTrigger className="m-2 w-[300px]">
        <SelectValue placeholder="Selecione um Produto" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {products.map((product, index)=> {
            return (
              <SelectItem key={index} value={product.id}>{product.name}</SelectItem>
            )
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}