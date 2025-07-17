import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CreateGroupDialogProps {
  onCreate: () => void;
  createMutation: { isPending: boolean };
  onChangeGroupName: (s: string) => void;
}

export const CreateGroupDialog = ({
  onCreate,
  createMutation,
  onChangeGroupName,
}: CreateGroupDialogProps) =>{
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="blue">Adicionar Novo Grupo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle>Criação de Grupo</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
              e.preventDefault();
              onCreate();
            }}>
          <div className="flex flex-col gap-3">
            <Label>Nome:</Label>
            <Input
              type="text"
              placeholder="Escreva um nome para o grupo"
              onChange={(e) => onChangeGroupName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              variant="blue"
              disabled={createMutation.isPending}
              >
                {createMutation.isPending ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}