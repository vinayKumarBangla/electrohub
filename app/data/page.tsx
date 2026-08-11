import Image from "next/image";
import { projectProducts } from "./productsData";

export default function Page() {
  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Smartphones Category</h1>
      
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {projectProducts.map((product) => (
          <div key={product.id} className="bg-white border rounded-lg p-4 shadow-sm flex flex-col">
            <div className="relative h-48 w-full mb-3 bg-gray-100 rounded flex items-center justify-center">
              <img 
                src={product.image} 
                alt={product.name} 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <h3 className="font-medium text-sm text-gray-800 line-clamp-2">{product.name}</h3>
            <div className="text-lg font-bold text-gray-900 mt-2">₹{product.price.toLocaleString("en-IN")}</div>
            <p className="text-xs text-gray-500 mt-1">{product.store}</p>
            <div className="text-xs text-green-700 font-semibold mt-1">★ {product.rating}</div>
          </div>
        ))}
      </div>
    </main>
  );
}