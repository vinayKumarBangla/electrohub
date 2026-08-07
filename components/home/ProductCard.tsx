import Link from "next/link";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount_price: number | null;
};

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex h-60 items-center justify-center bg-gray-100">
        <span className="text-gray-400">
          Product Image
        </span>
      </div>

      <div className="p-5">

        <h3 className="line-clamp-2 text-lg font-semibold">
          {product.name}
        </h3>

        <div className="mt-4 flex items-center gap-3">

          <span className="text-2xl font-bold text-blue-600">
            ₹{product.discount_price ?? product.price}
          </span>

          {product.discount_price && (
            <span className="text-gray-400 line-through">
              ₹{product.price}
            </span>
          )}

        </div>

      </div>
    </Link>
  );
}