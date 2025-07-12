import { Loader2Icon, PencilIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "./ui/table";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Dispatch, MouseEventHandler, SetStateAction } from "react";
import { trpc } from "@/trpc/client";
import { DialogDescription } from "@radix-ui/react-dialog";
import { capitalizeFirstLetter } from "@/lib/utils";

interface GenericTableProps<T extends object> {
  data: T[];
  getId: (item: T) => string;
  headers: string[];
  getColumns: (item: T) => string[];
  renderRowActions?: (row: T) => React.ReactNode;
}

export function GenericTable<T extends object> ({
    data,
    getId,
    headers,
    getColumns,
    renderRowActions,
  }: GenericTableProps<T>) {
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((header, index) => {
            return (
              <TableHead key={index} >{header}</TableHead>
            )
          })}
          {renderRowActions && (
            <TableHead>Ações</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => {
          const columns = Object.keys(row) as Array<keyof T>;
          return (
            <TableRow key={getId(row)}>
              {getColumns(row).map((cell, index2) => {
                return (
                  <TableCell key={index2}>{String(cell)}</TableCell>
                )
              })}
              {renderRowActions && (
              <TableCell>
                {renderRowActions(row)}
              </TableCell>
              )}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}