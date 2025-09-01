import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "./ui/table";

interface GenericTableProps<T> {
  data: T[];
  getId: (item: T) => string;
  headers: string[];
  getColumns: (item: T) => (string | number | null)[];
  renderRowActions?: (row: T) => React.ReactNode;
}

export function GenericTable<T> ({
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
          return (
            <TableRow key={getId(row)}>
              {getColumns(row).map((cell, index2) => {
                return (
                  <TableCell key={index2}>{cell}</TableCell>
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