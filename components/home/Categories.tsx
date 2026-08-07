"use client";

import Link from "next/link";
import {
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  Headphones,
  Camera,
  Gamepad2,
  Speaker,
} from "lucide-react";

const categories = [
  {
    name: "Mobiles",
    icon: Smartphone,
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Laptops",
    icon: Laptop,
    color: "bg-green-100 text-green-600",
  },
  {
    name: "Tablets",
    icon: Tablet,
    color: "bg-purple-100 text-purple-600",
  },
  {
    name: "Smart Watches",
    icon: Watch,
    color: "bg-pink-100 text-pink-600",
  },
  {
    name: "Headphones",
    icon: Headphones,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    name: "Cameras",
    icon: Camera,
    color: "bg-red-100 text-red-600",
  },
  {
    name: "Gaming",
    icon: Gamepad2,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    name: "Speakers",
    icon: Speaker,
    color: "bg-orange-100 text-orange-600",
  },
];

export default function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">

      <div className="mb-10 flex items-center justify-between">

        <div>
          <h2 className="text-3xl font-bold">
            Shop by Category
          </h2>

          <p className="mt-2 text-gray-500">
            Browse your favorite electronics
          </p>
        </div>

        <Link
          href="/categories"
          className="font-semibold text-blue-600 hover:underline"
        >
          View All →
        </Link>

      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">

        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <Link
              key={category.name}
              href={`/categories/${category.name.toLowerCase()}`}
              className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${category.color}`}
              >
                <Icon size={30} />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                {category.name}
              </h3>
            </Link>
          );
        })}

      </div>

    </section>
  );
}
