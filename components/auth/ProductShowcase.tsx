export default function ProductShowcase() {
  const products = [
    {
      image: "/assets/products/laptop.png",
      className:
        "md:col-span-2 md:row-span-2 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900",
    },
    {
      image: "/assets/products/mobiles.png",
      className:
        "rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900",
    },
    {
      image: "/assets/products/watch.png",
      className:
        "rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900",
    },
    {
      image: "/assets/products/Earphones.png",
      className:
        "rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900",
    },
    {
      image: "/assets/products/Speaker.png",
      className:
        "rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900",
    },
  ];

  return (
    <div className="w-full max-w-3xl">

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 auto-rows-[140px]">

        {products.map((item, index) => (
          <div
            key={index}
            className={`${item.className} flex items-center justify-center overflow-hidden border border-white/10 shadow-xl transition duration-300 hover:scale-105`}
          >
            <img
              src={item.image}
              alt="Product"
              className="h-[80%] w-[80%] object-contain"
            />
          </div>
        ))}

      </div>

    </div>
  );
}