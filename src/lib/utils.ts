import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min )
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function numberToBRL(n: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL"})
  .format(n);
}

export function nullOrNumberToBRL(n: number | null) {
  return n !== null ? numberToBRL(n) : "";
}