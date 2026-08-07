import {
  ShieldCheck,
  Truck,
  BadgeCheck,
  Headphones,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure",
    desc: "100% Safe Payments",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Express Shipping",
  },
  {
    icon: BadgeCheck,
    title: "Genuine",
    desc: "Original Products",
  },
  {
    icon: Headphones,
    title: "Support",
    desc: "24×7 Assistance",
  },
];

export default function FeatureRow() {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {features.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition hover:bg-white/10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
              <Icon
                size={24}
                className="text-blue-400"
              />
            </div>

            <h3 className="mt-4 text-base font-semibold text-white">
              {item.title}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {item.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}