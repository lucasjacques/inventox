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

export function getPriceInBRL(n: number | null) {
  return n !== null ? numberToBRL(n / 10000) : "";
}

export function getPackageWeightInKg(n: number) {
  return n / 100000;
}

function setPriceForDB(n: number) {
  return n * 10000
}

export function setPriceStringForDB(s: string) {
  return s !== "" ? setPriceForDB(Number(s)) : null;
}

function setPackageWeightForDB(n: number) {
  return n * 100000;
}

export function setPackageWeightStringForDB(s: string) {
  return setPackageWeightForDB(Number(s));
}