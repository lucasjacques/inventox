import { Loader2Icon, PencilIcon } from "lucide-react"

import { Group } from "@/modules/groups/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"

interface UpdateGroupDialogProps {
  group: Group;
  onEdit: (g: Group) => void;
  onChange: (s: string) => void;
  updateMutation: { isPending: boolean };
}

export const UpdateGroupDialog = ({
  group,
  onEdit,
  onChange,
  updateMutation: editMutation,
}: UpdateGroupDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="blue" title="Editar Item">
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[350px]">
        <DialogHeader>
            <DialogTitle>Edição do Item: {group.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Label>Nome:</Label>
          <Input
            type="text"
            placeholder="Escreva aqui o nome do Grupo"
            onChange={(e) => onChange(e.target.value)}
            />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="blue" onClick={() => onEdit(group)}
            >
              {editMutation.isPending ? <Loader2Icon className="animate-spin"/> : <PencilIcon />}
              Editar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
