import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GroupSelect } from "../group-select";
import { Group } from "@/modules/groups/types";
import { Loader2Icon, PlusIcon } from "lucide-react";

interface CreateProductDialogProps {
  groups: Group[];
  onCreate: () => void
  createMutation: { isPending: boolean };
  onChangeProductName: (s: string) => void;
  onChangeProductGroupId: (id: string) => void;
}

export const CreateProductDialog = ({
  groups,
  onCreate,
  createMutation,
  onChangeProductName,
  onChangeProductGroupId,
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
            placeholder="Nome do produto"
            onChange={(e) => onChangeProductName(e.target.value)} 
          />
          <Label>Grupo:</Label>
          <GroupSelect
            groups={groups}
            onChange={onChangeProductGroupId}
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