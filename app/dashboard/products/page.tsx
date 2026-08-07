import ProductsTable from "@/components/dashboard/ProductsTable";
import Link from "next/link";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex items-center justify-between">

          <h1 className="text-4xl font-bold">
            My Products
          </h1>

          <Link
            href="/dashboard/products/add"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            + Add Product
          </Link>

        </div>

        <ProductsTable />

      </div>
    </main>
  );
}