import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GroupSelect } from "../../group-select";
import { Group } from "@/modules/groups/types";
import { Loader2Icon, PlusIcon } from "lucide-react";

interface CreateProductDialogProps {
  groups: Group[];
  onCreate: () => void
  createMutation: { isPending: boolean };
  onChangeProductName: (s: string) => void;
  onChangeProductPrice: (s: string) => void;
  onChangeProductGroupId: (id: string) => void;
  onChangeProductPackageWeight: (s: string) => void;
}

export const CreateProductDialog = ({
  groups,
  onCreate,
  createMutation,
  onChangeProductName,
  onChangeProductPrice,
  onChangeProductGroupId,
  onChangeProductPackageWeight,
}: CreateProductDialogProps) => {
return (
  <Dialog>
    <form>
      <DialogTrigger asChild>
        <Button variant="blue">
          Inserir novo Produto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle>Inserção de Item</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Label>Nome:</Label>
          <Input 
            className="m-2 w-[300px]"
            type="text"
            placeholder="Nome do Produto"
            onChange={(e) => onChangeProductName(e.target.value)} 
            />
          <Label>Preço:</Label>
          <Input 
            className="m-2 w-[300px]"
            type="number"
            placeholder="Preço do Produto"
            onChange={(e) => onChangeProductPrice(e.target.value)} 
          />
          <Label>Grupo:</Label>
          <GroupSelect
            groups={groups}
            onChange={onChangeProductGroupId}
            />
          <Label>Peso (kg):</Label>
          <Input 
            className="m-2 w-[300px]"
            type="number"
            placeholder="Peso do Pacote do Produto"
            onChange={(e) => onChangeProductPackageWeight(e.target.value)} 
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
              Inserir novo Produto
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </form>
  </Dialog>

)}