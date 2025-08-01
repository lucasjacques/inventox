import { ProductsSection } from "../sections/products-section"

export const ProductsView = () => {
  return (
    <div className="flex flex-col gap-y-3 pt-4">
      <div className="px-4">
        <h1 className="text-2xl font-bold">Produtos</h1>
      </div>
      <ProductsSection />
    </div>
  )
}