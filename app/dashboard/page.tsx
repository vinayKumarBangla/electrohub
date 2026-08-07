import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import ProductGrid from "@/components/home/ProductGrid";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100">

      <Navbar />

      <Hero />

      <Categories />

      <section className="mx-auto max-w-7xl px-6 py-12">

        <h2 className="mb-8 text-4xl font-bold">
          Latest Products
        </h2>

        <ProductGrid />

      </section>

    </main>
  );
}