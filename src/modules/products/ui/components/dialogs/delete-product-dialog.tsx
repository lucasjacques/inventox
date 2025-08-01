import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2Icon, XIcon } from "lucide-react"
import { Product } from "../../../types"

interface DeleteProductDialogProps {
  product: Product;
  onDelete: (p: Product) => void;
  deleteMutation: { isPending: boolean };
}

export const DeleteProductDialog = ({
  product,
  onDelete,
  deleteMutation,
}: DeleteProductDialogProps) => {
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
            Exclusão de item: {product.name}
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
            <Button variant="destructive" onClick={() => onDelete(product)}>
              {deleteMutation.isPending ? <Loader2Icon className="animate-spin"/> : <XIcon />}
              Excluir
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}