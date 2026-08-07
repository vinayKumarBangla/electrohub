type ProductCardProps = {
  icon: string;
  title: string;
  subtitle: string;
  price: string;
  rating: string;
};

export default function ProductCard({
  icon,
  title,
  subtitle,
  price,
  rating,
}: ProductCardProps) {
  return (
    <div
      className="
        group
        rounded-3xl
        border
        border-white/10
        bg-white/10
        p-5
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-2
        hover:bg-white/15
        hover:shadow-2xl
      "
    >
      <div className="text-5xl transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-semibold text-white">
        {title}
      </h3>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm text-yellow-400">
          ⭐ {rating}
        </span>

        <span className="font-semibold text-blue-300">
          {price}
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-300">
        {subtitle}
      </p>
    </div>
  );
}