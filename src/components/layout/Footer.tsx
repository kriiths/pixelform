import { faqs } from '@/app/content/faqs';
import { texts } from '@/app/content/texts';
import { testIds } from '@/lib/testids';
import { FooterContact, FooterLinks, FooterFaq } from './FooterSections';

export default function Footer() {
  return (
    <footer className="bg-gray-light border-t border-gray-light mt-32" data-testid={testIds.footer}>
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FooterContact />
          <FooterLinks />
          <FooterFaq faqs={faqs} />
        </div>

        <div className="border-t border-gray mt-12 pt-8 text-center text-sm text-gray">
          <p>&copy; {new Date().getFullYear()} {texts.site.name}. {texts.footer.rightsReserved}</p>
        </div>
      </div>
    </footer>
  );
}
