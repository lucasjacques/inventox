import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Group } from "@/modules/groups/types"
import { Loader2Icon, XIcon } from "lucide-react"

interface DeleteGroupDialogProps {
  group: Group;
  onDelete: (g: Group) => void;
  deleteMutation: { isPending: boolean };
}

export const DeleteGroupDialog = ({
  group,
  onDelete,
  deleteMutation,
}: DeleteGroupDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" title="Excluir Item">
          <XIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Exclusão de item: {group.name}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Você tem certeza que deseja excluir o item em questão?
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={() => onDelete(group)}>
              {deleteMutation.isPending ? <Loader2Icon className="animate-spin"/> : <XIcon />}
              Excluir
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}