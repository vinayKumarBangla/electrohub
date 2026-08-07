"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-6 py-16 md:flex-row">

        {/* Left */}
        <div className="max-w-xl">

          <span className="rounded-full bg-white/20 px-4 py-2 text-sm">
            🔥 Biggest Electronics Sale
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight">
            Discover the Latest Tech at
            <br />
            <span className="text-yellow-300">
              ElectroHub
            </span>
          </h1>

          <p className="mt-6 text-lg text-blue-100">
            Shop premium smartphones, laptops, gaming devices,
            smart watches, accessories and much more at the best prices.
          </p>

          <div className="mt-8 flex gap-4">

            <Link
              href="/products"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:scale-105"
            >
              Shop Now
            </Link>

            <Link
              href="/categories"
              className="rounded-xl border border-white px-6 py-3 font-semibold transition hover:bg-white hover:text-blue-700"
            >
              Browse Categories
            </Link>

          </div>

        </div>

        {/* Right */}

        <div className="mt-12 md:mt-0">

          <img
            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700"
            alt="Electronics"
            className="w-full max-w-md rounded-3xl shadow-2xl"
          />

        </div>

      </div>
    </section>
  );
}