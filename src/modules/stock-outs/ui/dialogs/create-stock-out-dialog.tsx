import { Loader2Icon, PlusIcon } from "lucide-react";

import { ProductSelect } from "@/components/product-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/modules/products/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

interface CreateStockOutDialogProps {
  products: Product[];
  onCreate: () => void
  createMutation: { isPending: boolean };
  onChangeStockOutQuantity: (s: number) => void;
  onChangeStockOutProductId: (id: string) => void;
}

export const CreateStockOutDialog = ({
  products,
  onCreate,
  createMutation,
  onChangeStockOutQuantity,
  onChangeStockOutProductId,
}: CreateStockOutDialogProps) => {
return (
  <Dialog>
    <form>
      <DialogTrigger asChild>
        <Button variant="blue">
          Inserir nova Saída
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle>Inserção de Item</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Label>Produto:</Label>
          <ProductSelect
            products={products}
            onChange={onChangeStockOutProductId}
          />
          <Label>Quantidade:</Label>
          <Input 
            className="m-2 w-[300px]"
            type="number"
            placeholder="Quantidade"
            onChange={(e) => onChangeStockOutQuantity(Number(e.target.value))} 
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="blue"
              disabled={createMutation.isPending}
              onClick={() => onCreate()}
            >
            {createMutation.isPending ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
              Inserir nova Entrada
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </form>
  </Dialog>

)}