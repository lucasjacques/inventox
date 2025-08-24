import { Loader2Icon, PencilIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

import { Product } from "../../../types";
import { GroupSelect } from "../../group-select";
import { Group } from "@/modules/groups/types";

interface UpdateProductDialogProps {
  groups: Group[];
  onUpdate: (p: Product) => void;
  product: Product;
  onChangeName: (s: string) => void;
  onChangePrice: (n: number) => void;
  updateMutation: { isPending: boolean };
  onChangeGroupId: (s: string) => void;
}

export const EditProductDialog = ({
  groups,
  onUpdate,
  product,
  onChangeName,
  onChangePrice,
  updateMutation,
  onChangeGroupId,
}: UpdateProductDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="blue" title="Editar Item">
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle>Edição do Item: {product.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Label>Nome:</Label>
          <Input
            className="m-2 w-[300px]"
            type="text"
            placeholder="Escreva aqui o nome do Produto"
            onChange={(e) => onChangeName(e.target.value)}
          />
          <Label>Preço:</Label>
          <Input
            className="m-2 w-[300px]"
            type="number"
            placeholder="Escreva aqui o preço do Produto"
            onChange={(e) => onChangePrice(Number(e.target.value))}
          />
          <Label>Grupo:</Label>
          <GroupSelect
            groups={groups}
            onChange={onChangeGroupId}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="blue" onClick={() => onUpdate(product)}
            >
              {updateMutation.isPending ? <Loader2Icon className="animate-spin"/> : <PencilIcon />}
              Editar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}