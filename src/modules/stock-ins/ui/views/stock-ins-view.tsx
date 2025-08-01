"use client";

import { StockInsSection } from "../sections/stock-ins-section";

export const StockInsView = () => {
  return (
    <div className="flex flex-col gap-y-3 pt-4">
      <div className="px-4">
        <h1 className="text-2xl font-bold">Entradas</h1>
      </div>
      <StockInsSection />
    </div>
  )
}