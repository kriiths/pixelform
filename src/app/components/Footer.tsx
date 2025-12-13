import Link from 'next/link';
import { contact } from '../content/contact';
import { faqs } from '../content/faqs';

export default function Footer() {
  return (
    <footer className="bg-neutral-100 border-t border-neutral-200 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kontaktinfo */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-neutral-900">Kontakt</h3>
            <div className="text-sm text-neutral-700 space-y-2">
              <p>{contact.email}</p>
              <p>{contact.phone}</p>
              <p className="pt-2">
                {contact.address.street}<br />
                {contact.address.zip} {contact.address.city}
              </p>
              <div className="pt-2">
                <p className="font-medium">Öppettider:</p>
                <p>Vardagar: {contact.hours.weekdays}</p>
                <p>Helger: {contact.hours.weekends}</p>
              </div>
            </div>
          </div>

          {/* Länkar */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-neutral-900">Snabblänkar</h3>
            <div className="text-sm text-neutral-700 space-y-2">
              <Link href="/shop" className="block hover:text-neutral-900 transition">
                Shop
              </Link>
              <Link href="/shop/junior" className="block hover:text-pink-700 transition">
                Pixelverk Junior
              </Link>
              <Link href="/about" className="block hover:text-neutral-900 transition">
                Om Pixelverk
              </Link>
              <Link href="/cart" className="block hover:text-neutral-900 transition">
                Kundvagn
              </Link>
            </div>
            <div className="pt-4">
              <h4 className="font-medium mb-2">Följ oss</h4>
              <p>Instagram: {contact.social.instagram}</p>
              <p>Facebook: {contact.social.facebook}</p>
            </div>
          </div>

          {/* Vanliga frågor */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-neutral-900">Vanliga frågor</h3>
            <div className="text-sm text-neutral-700 space-y-3">
              {faqs.slice(0, 3).map((faq) => (
                <div key={faq.question}>
                  <p className="font-medium text-neutral-900">{faq.question}</p>
                  <p className="text-xs">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-300 mt-8 pt-6 text-center text-sm text-neutral-600">
          <p>&copy; {new Date().getFullYear()} Pixelverk. Alla rättigheter förbehållna.</p>
        </div>
      </div>
    </footer>
  );
}
