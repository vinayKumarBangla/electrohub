import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#05070a] border-t border-slate-800 text-slate-400 text-xs">
      
      {/* Popular Categories Directory Section */}
      <div className="max-w-7xl mx-auto px-6 py-10 border-b border-slate-800/60">
        <h3 className="text-white font-bold uppercase tracking-wider mb-6 text-sm">
          Popular Categories
        </h3>
        
        <div className="space-y-4 leading-relaxed">
          <div>
            <span className="text-white font-semibold">Mobiles: </span>
            {["Smartphones", "Apple Mobiles", "LG Mobiles", "Samsung Mobiles", "OPPO Mobiles", "Vivo Mobiles", "Redmi Mobiles", "Nokia Mobiles", "Mobile Accessories", "Sony Accessories", "Samsung Accessories", "Apple Accessories", "JBL Accessories"].map((item, idx, arr) => (
              <span key={item}>
                <Link href="/products" className="hover:text-blue-400 transition-colors">{item}</Link>
                {idx < arr.length - 1 && <span className="text-slate-600 mx-2">|</span>}
              </span>
            ))}
          </div>

          <div>
            <span className="text-white font-semibold">Laptops: </span>
            {["Laptop", "Lenovo Laptops", "Dell Laptops", "HP Laptops", "Microsoft Laptops", "Laptops Accessories", "Microsoft Laptop Accessories", "Printers", "HP Printers"].map((item, idx, arr) => (
              <span key={item}>
                <Link href="/products" className="hover:text-blue-400 transition-colors">{item}</Link>
                {idx < arr.length - 1 && <span className="text-slate-600 mx-2">|</span>}
              </span>
            ))}
          </div>

          <div>
            <span className="text-white font-semibold">Home Entertainment: </span>
            {["LED TV", "LG LED TV", "Samsung LED TV", "Sony LED TV", "Smart TV", "LG Smart TV", "Samsung Smart TV", "Sony Smart TV", "QLED TV", "LG QLED TV", "Samsung QLED TV", "OLED TV", "LG OLED TV", "Samsung OLED TV", "Home Theatre"].map((item, idx, arr) => (
              <span key={item}>
                <Link href="/products" className="hover:text-blue-400 transition-colors">{item}</Link>
                {idx < arr.length - 1 && <span className="text-slate-600 mx-2">|</span>}
              </span>
            ))}
          </div>

          <div>
            <span className="text-white font-semibold">Home Appliances: </span>
            {["Air Conditioner", "LG AC", "Samsung AC", "Air Cooler", "Kenstar Air Cooler", "Voltas Air Cooler", "Refrigerators", "Samsung Refrigerators", "Whirlpool Refrigerators", "Washing Machine", "LG Washing Machine", "Samsung Washing Machine", "Geysers", "Bajaj Geysers", "Iron & Garment Steamer", "Bajaj Iron & Garment Steamer", "Philips Iron & Garment Steamer"].map((item, idx, arr) => (
              <span key={item}>
                <Link href="/products" className="hover:text-blue-400 transition-colors">{item}</Link>
                {idx < arr.length - 1 && <span className="text-slate-600 mx-2">|</span>}
              </span>
            ))}
          </div>

          <div>
            <span className="text-white font-semibold">Kitchen Appliances: </span>
            {["Microwave Oven & OTG", "LG Microwave Oven & OTG", "Morphy Richards Microwave Oven & OTG", "Mixer Grinder", "Philips Mixer Grinder", "Panasonic Mixer Grinder", "Toaster", "Philips Toaster", "Morphy Richards Toaster", "Water Purifiers", "LG Water Purifiers", "Kent Water Purifiers", "Gas Stoves & Hobs", "Butterfly Gas Stoves & Hobs"].map((item, idx, arr) => (
              <span key={item}>
                <Link href="/products" className="hover:text-blue-400 transition-colors">{item}</Link>
                {idx < arr.length - 1 && <span className="text-slate-600 mx-2">|</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Links & Company Info */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2.5">
            <li><Link href="/store-locator" className="hover:text-white transition-colors">Store Locator</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold uppercase tracking-wider mb-4">Follow Us On</h4>
          <ul className="space-y-2.5">
            <li><a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Facebook</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Twitter</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
            <li><a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Youtube</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold uppercase tracking-wider mb-4">ElectroHub India Limited</h4>
          <p className="leading-relaxed text-slate-400 mb-3">
            Corporate Office: Tech Park, HITEC City, Hyderabad, Telangana 500081<br />
            Ph: 040 - 12345678
          </p>
          <p className="leading-relaxed text-slate-400">
            Email Us: support@electrohub.in<br />
            Call Our Customer Care: 1800-123-4567
          </p>
        </div>
      </div>

      {/* Bottom Copyright & Real Brand Badges Bar */}
      <div className="bg-[#1e293b] border-t border-slate-700 py-4 px-6 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-300">
          <div>
            Copyright © 2026 ElectroHub. All rights reserved. | Technology Partner - <span className="text-white font-medium">ElectroCore</span>
          </div>

          {/* Real Official Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-[#00529b] px-2.5 py-1 rounded text-white font-bold text-[10px] tracking-wider border border-blue-400/30">
              BAJAJ FINSERV
            </div>
            <div className="bg-[#001a70] px-2.5 py-1 rounded text-white font-bold text-[10px] tracking-wider border border-blue-500/30">
              HDFC BANK
            </div>
            <div className="bg-[#1434cb] px-2.5 py-1 rounded text-white font-black text-[11px] italic tracking-tighter">
              VISA
            </div>
            <div className="bg-[#111] px-2 py-1 rounded flex items-center gap-1 border border-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block opacity-90"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block -ml-2 opacity-90"></span>
              <span className="text-white font-bold text-[9px]">mastercard</span>
            </div>
            <div className="bg-[#003366] px-2 py-1 rounded flex items-center gap-1 border border-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block -ml-2 opacity-90"></span>
              <span className="text-white font-bold text-[9px]">maestro</span>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}