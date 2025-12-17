import Link from 'next/link';
import { contact } from '@/app/content/contact';
import { faqs } from '@/app/content/faqs';
import { texts } from '@/app/content/texts';
import { testIds } from '@/lib/testids';

export default function Footer() {
  return (
    <footer className="bg-gray-light border-t border-gray-light mt-32" data-testid={testIds.footer}>
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Kontaktinfo */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-black tracking-tight">{texts.footer.contact}</h3>
            <div className="text-base text-gray space-y-2">
              <p>{contact.email}</p>
              <p>{contact.phone}</p>
              <p className="pt-2">
                {contact.address.street}<br />
                {contact.address.zip} {contact.address.city}
              </p>
              <div className="pt-2">
                <p className="font-semibold">{texts.footer.openingHours}</p>
                <p>{texts.footer.weekdays}: {contact.hours.weekdays}</p>
                <p>{texts.footer.weekends}: {contact.hours.weekends}</p>
              </div>
            </div>
          </div>

          {/* Länkar */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-black tracking-tight">{texts.footer.quickLinks}</h3>
            <div className="text-base text-gray space-y-2">
              <Link href="/shop" className="block hover:text-black transition font-medium">
                {texts.nav.shop}
              </Link>
              <Link href="/about" className="block hover:text-black transition font-medium">
                {texts.nav.about}
              </Link>
              <Link href="/cart" className="block hover:text-black transition font-medium">
                {texts.nav.cart}
              </Link>
            </div>
            <div className="pt-6">
              <h4 className="font-semibold mb-2 text-black">{texts.footer.social}</h4>
              <p>Instagram: <span className="font-medium">{contact.social.instagram}</span></p>
              <p>Facebook: <span className="font-medium">{contact.social.facebook}</span></p>
            </div>
          </div>

          {/* Vanliga frågor */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-black tracking-tight">{texts.footer.faq}</h3>
            <div className="text-base text-gray space-y-4">
              {faqs.slice(0, 3).map((faq) => (
                <div key={faq.question}>
                  <p className="font-semibold text-black mb-1">{faq.question}</p>
                  <p className="text-sm text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray mt-12 pt-8 text-center text-sm text-gray">
          <p>&copy; {new Date().getFullYear()} {texts.site.name}. {texts.footer.rightsReserved}</p>
        </div>
      </div>
    </footer>
  );
}
