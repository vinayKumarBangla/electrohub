import ProductShowcase from "./ProductShowcase";
import FeatureRow from "./FeatureRow";
import CustomerRow from "./CustomerRow";

export default function AuthHero() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[32px] bg-[#08111F] p-6 md:p-8 xl:p-12 text-white">

      {/* Background Glow */}
      <div className="absolute -left-24 -top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

      {/* Header */}
      <div className="relative z-10">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl md:text-3xl font-bold">
            ⚡
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl xl:text-4xl font-bold">
              Electro
              <span className="text-blue-500">Hub</span>
            </h2>

            <p className="text-sm md:text-base text-slate-400">
              Powering your digital life
            </p>
          </div>

        </div>

        <h1 className="mt-10 md:mt-14 max-w-xl text-4xl md:text-5xl xl:text-7xl font-black leading-tight">
          Everything
          <br />
          Electronics.
          <br />
          Everything{" "}
          <span className="text-blue-500">
            Best.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-base md:text-lg xl:text-xl leading-8 text-slate-300">
          Discover premium gadgets, unbeatable deals and a seamless shopping
          experience built for modern technology lovers.
        </p>

      </div>

      {/* Product */}
      <div className="relative z-10 mt-8 flex justify-center">
        <ProductShowcase />
      </div>

      {/* Features */}
      <div className="mt-8">
        <FeatureRow />
      </div>

      {/* Customers */}
      <div className="mt-6">
        <CustomerRow />
      </div>

    </div>
  );
}