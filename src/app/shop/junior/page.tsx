import Image from "next/image";
import { junior } from '../data/junior';
import { texts } from '../../content/texts';

export default function JuniorShop() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 font-sans">
      <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-2">{texts.junior.title}</h1>
      <p className="mb-8 text-lg text-gray-700">{texts.junior.description}</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {junior.map((produkt, idx) => (
          <div
            key={produkt.id}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:bg-pink-50 border border-pink-100"
          >
            <div className="w-24 h-24 mb-3 relative">
              <Image
                src={produkt.image}
                alt={produkt.name}
                fill
                className="object-contain rounded"
                sizes="96px"
                priority={idx === 0}
              />
            </div>
            <h2 className="text-lg font-semibold text-pink-700 mb-1">{produkt.name}</h2>
            <p className="text-sm text-gray-600 text-center">{produkt.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
