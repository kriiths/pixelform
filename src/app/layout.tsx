import "./globals.css";
import { CartProvider } from './cart/context';
import Header from './components/Header';
import Footer from './components/Footer';

export const metadata = {
  title: "Pixelverk",
  description: "Handgjorda smycken – som lagom fast tvärtom",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
