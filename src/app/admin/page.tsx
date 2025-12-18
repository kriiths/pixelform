import AdminClient from './AdminClient';
import AdminAuthForm from './AdminAuthForm';
import { loadAllProducts } from '../shop/data';
import type { Category, Product } from '@/lib/types';
import { isAdminAuthorized, getAdminConfig } from './auth';
import { texts } from '../content/texts';

type ProductsByCategory = Record<Category, Product[]>;

export default async function AdminPage() {
  const { authorized, ready } = isAdminAuthorized();
  const { ready: configReady } = getAdminConfig();

  if (!configReady) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold text-neutral-900 mb-3">{texts.admin.title}</h1>
        <p className="text-neutral-700">{texts.admin.missingPassword}</p>
      </main>
    );
  }

  if (!authorized || !ready) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <AdminAuthForm />
      </main>
    );
  }

  const products = (await loadAllProducts()) as ProductsByCategory;

  return <AdminClient products={products} />;
}
