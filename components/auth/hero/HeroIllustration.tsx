import {
  Laptop,
  Smartphone,
  Headphones,
  Watch,
} from "lucide-react";

export default function HeroIllustration() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">

      {/* Glow */}
      <div className="absolute h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[120px]" />

      {/* Main Laptop */}
      <div className="relative z-20 flex h-[420px] w-[520px] items-center justify-center rounded-[42px] border border-white/10 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-3xl shadow-[0_0_120px_rgba(59,130,246,.25)]">
        <Laptop
            size={180}
            strokeWidth={1.5}
            className="text-white"
            />
      </div>

      {/* Phone */}
      <div className="absolute left-2 top-28 rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
        <Smartphone size={48} className="text-cyan-300" />
      </div>

      {/* Watch */}
      <div className="absolute right-2 top-12 rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
        <Watch size={44} className="text-blue-300" />
      </div>

      {/* Headphones */}
      <div className="absolute bottom-6 right-6 rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
        <Headphones size={48} className="text-indigo-300" />
      </div>

    </div>
  );
}