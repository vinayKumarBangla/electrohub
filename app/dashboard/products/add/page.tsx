import AddProductForm from "@/components/dashboard/AddProductForm";

export default function AddProductPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl">

        <h1 className="mb-8 text-4xl font-bold">
          Add Product
        </h1>

        <AddProductForm />

      </div>
    </main>
  );
}