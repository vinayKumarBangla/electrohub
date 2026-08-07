import { Star } from "lucide-react";

export default function CustomerRow() {
  return (
    <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.25em] text-blue-400">
            Trusted Worldwide
          </p>

          <h3 className="mt-2 text-2xl font-bold text-white">
            10,000+ Happy Customers
          </h3>

          <div className="mt-3 flex items-center gap-1">

            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                className="fill-yellow-400 text-yellow-400"
              />
            ))}

            <span className="ml-2 text-sm text-slate-300">
              4.9 / 5 Rating
            </span>

          </div>

        </div>

        <div className="flex -space-x-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#08111F] bg-blue-500 font-bold text-white">
            A
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#08111F] bg-indigo-500 font-bold text-white">
            R
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#08111F] bg-cyan-500 font-bold text-white">
            S
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#08111F] bg-slate-700 text-xs font-bold text-white">
            +9K
          </div>

        </div>

      </div>

    </div>
  );
}