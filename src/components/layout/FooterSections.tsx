import { contact } from '@/app/content/contact';
import { texts } from '@/app/content/texts';

export function FooterContact() {
  return (
    <div>
      <h3 className="text-lg font-bold mb-6 text-black tracking-tight">
        {texts.footer.contact}
      </h3>
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
  );
}

export function FooterLinks() {
  return (
    <div>
      <h3 className="text-lg font-bold mb-6 text-black tracking-tight">
        {texts.footer.social}
      </h3>
      <div className="text-base text-gray space-y-3">
        <p className="hover:text-black transition">
          Instagram: <a href={`https://instagram.com/${contact.social.instagram}`} target="_blank" rel="noopener noreferrer" className="font-medium text-pixel hover:underline">{contact.social.instagram}</a>
        </p>
        <p className="hover:text-black transition">
          Facebook: <a href={`https://facebook.com/${contact.social.facebook}`} target="_blank" rel="noopener noreferrer" className="font-medium text-pixel hover:underline">{contact.social.facebook}</a>
        </p>
      </div>
    </div>
  );
}

interface FaqItem {
  question: string;
  answer: string;
}

interface FooterFaqProps {
  faqs: FaqItem[];
}

export function FooterFaq({ faqs }: FooterFaqProps) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-6 text-black tracking-tight">
        {texts.footer.faq}
      </h3>
      <div className="text-base text-gray space-y-4">
        {faqs.slice(0, 3).map((faq) => (
          <div key={faq.question}>
            <p className="font-semibold text-black mb-1">{faq.question}</p>
            <p className="text-sm text-gray-700">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
