"use client";

import { useMemo, useRef, useState, useTransition } from 'react';
import type { Category, Product } from '@/lib/types';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { texts } from '../content/texts';
import { addProductImagesAction, createProductAction } from './actions';

type ProductsByCategory = Record<Category, Product[]>;

interface StatusMessage {
  message: string;
  success: boolean | null;
}

interface Props {
  products: ProductsByCategory;
}

export default function AdminClient({ products }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('pixelparla');
  const [existingCategory, setExistingCategory] = useState<Category>('pixelparla');
  const [createStatus, setCreateStatus] = useState<StatusMessage>({ message: '', success: null });
  const [imageStatus, setImageStatus] = useState<StatusMessage>({ message: '', success: null });
  const [logoutStatus, setLogoutStatus] = useState<StatusMessage>({ message: '', success: null });
  const [isCreating, startCreating] = useTransition();
  const [isAddingImages, startAddingImages] = useTransition();
  const [isLoggingOut, startLoggingOut] = useTransition();

  const createFormRef = useRef<HTMLFormElement>(null);
  const addImagesFormRef = useRef<HTMLFormElement>(null);

  const categoryOptions = useMemo(
    () => ([
      { value: 'pixelparla', label: texts.shop.categories.pixelparla },
      { value: 'resin', label: texts.shop.categories.resin },
      { value: 'junior', label: texts.shop.categories.junior },
    ] as const),
    [],
  );

  const existingProducts = products[existingCategory] || [];
  const datalistId = `product-folders-${existingCategory}`;

  const handleCreateProduct = (formData: FormData) => {
    startCreating(async () => {
      const result = await createProductAction(formData);
      setCreateStatus({ message: result.message, success: result.success });

      if (result.success) {
        createFormRef.current?.reset();
        setSelectedCategory('pixelparla');
      }
    });
  };

  const handleAddImages = (formData: FormData) => {
    startAddingImages(async () => {
      const result = await addProductImagesAction(formData);
      setImageStatus({ message: result.message, success: result.success });

      if (result.success) {
        addImagesFormRef.current?.reset();
      }
    });
  };

  const statusClassName = (status: StatusMessage) => {
    if (status.success === null) return 'text-neutral-700';
    return status.success ? 'text-green-700' : 'text-red-700';
  };

  const handleLogout = () => {
    startLoggingOut(async () => {
      const response = await fetch('/api/admin/logout', { method: 'POST' });
      const success = response.ok;
      setLogoutStatus({
        success,
        message: success ? texts.admin.auth.success : texts.admin.auth.error,
      });
      if (success) {
        window.location.reload();
      }
    });
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900 mb-2">{texts.admin.title}</h1>
          <p className="text-neutral-700">{texts.admin.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="text-sm text-neutral-700 border border-gray-light rounded px-3 py-2 hover:bg-gray-50 transition disabled:opacity-60"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? texts.admin.auth.submitting : texts.admin.auth.logout}
          </button>
          {logoutStatus.message && (
            <span className={`text-sm ${statusClassName(logoutStatus)}`}>
              {logoutStatus.message}
            </span>
          )}
        </div>
      </div>

      <section className="bg-white border border-gray-light rounded-xl p-6 shadow-sm">
        <SectionHeading className="mb-4">{texts.admin.create.heading}</SectionHeading>
        <p className="text-neutral-700 mb-6">{texts.admin.create.description}</p>

        <form ref={createFormRef} action={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">{texts.admin.fields.category}</span>
            <select
              name="category"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value as Category)}
              className="border border-neutral-300 rounded px-3 py-2"
              required
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">{texts.admin.fields.productId}</span>
            <input
              name="productId"
              placeholder="t.ex. pixel-heart-earring"
              className="border border-neutral-300 rounded px-3 py-2"
              required
            />
            <span className="text-xs text-neutral-600">{texts.admin.create.folderHint}</span>
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-medium">{texts.admin.fields.name}</span>
            <input
              name="name"
              placeholder={texts.admin.placeholders.name}
              className="border border-neutral-300 rounded px-3 py-2"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">{texts.admin.fields.price}</span>
            <input
              name="price"
              placeholder="450 kr"
              className="border border-neutral-300 rounded px-3 py-2"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">{texts.admin.fields.stock}</span>
            <input
              name="stock"
              type="number"
              min={0}
              placeholder="5"
              className="border border-neutral-300 rounded px-3 py-2"
              required
            />
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-medium">{texts.admin.fields.description}</span>
            <textarea
              name="description"
              placeholder={texts.admin.placeholders.description}
              className="border border-neutral-300 rounded px-3 py-2 min-h-[120px]"
              required
            />
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-medium">{texts.admin.fields.images}</span>
            <input
              name="images"
              type="file"
              accept="image/*"
              multiple
              className="border border-neutral-300 rounded px-3 py-2"
            />
            <span className="text-xs text-neutral-600">{texts.admin.create.imageHint}</span>
          </label>

          <div className="md:col-span-2 flex flex-col gap-3">
            <button
              type="submit"
              className="w-full md:w-auto bg-black text-white px-5 py-2 rounded hover:bg-neutral-800 transition disabled:opacity-60"
              disabled={isCreating}
            >
              {isCreating ? texts.admin.create.submitting : texts.admin.create.submit}
            </button>
            {createStatus.message && (
              <p className={`text-sm ${statusClassName(createStatus)}`}>
                {createStatus.message}
              </p>
            )}
          </div>
        </form>
      </section>

      <section className="bg-white border border-gray-light rounded-xl p-6 shadow-sm">
        <SectionHeading className="mb-4">{texts.admin.images.heading}</SectionHeading>
        <p className="text-neutral-700 mb-6">{texts.admin.images.description}</p>

        <form ref={addImagesFormRef} action={handleAddImages} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">{texts.admin.fields.category}</span>
            <select
              name="existingCategory"
              value={existingCategory}
              onChange={(event) => setExistingCategory(event.target.value as Category)}
              className="border border-neutral-300 rounded px-3 py-2"
              required
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">{texts.admin.fields.productId}</span>
            <input
              name="existingProductId"
              list={datalistId}
              placeholder="produkt-mapp"
              className="border border-neutral-300 rounded px-3 py-2"
              required
            />
            <datalist id={datalistId}>
              {existingProducts.map((product) => (
                <option key={product.id} value={String(product.id)}>{product.name}</option>
              ))}
            </datalist>
            <span className="text-xs text-neutral-600">{texts.admin.images.productHint}</span>
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-medium">{texts.admin.fields.images}</span>
            <input
              name="extraImages"
              type="file"
              accept="image/*"
              multiple
              className="border border-neutral-300 rounded px-3 py-2"
              required
            />
            <span className="text-xs text-neutral-600">{texts.admin.images.imageHint}</span>
          </label>

          <div className="md:col-span-2 flex flex-col gap-3">
            <button
              type="submit"
              className="w-full md:w-auto bg-black text-white px-5 py-2 rounded hover:bg-neutral-800 transition disabled:opacity-60"
              disabled={isAddingImages}
            >
              {isAddingImages ? texts.admin.images.submitting : texts.admin.images.submit}
            </button>
            {imageStatus.message && (
              <p className={`text-sm ${statusClassName(imageStatus)}`}>
                {imageStatus.message}
              </p>
            )}
          </div>
        </form>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-neutral-900 mb-2">{texts.admin.images.currentFolders}</h3>
          <div className="flex flex-wrap gap-3">
            {categoryOptions.map((option) => (
              <div key={option.value} className="bg-gray-50 border border-gray-light rounded p-3 min-w-[200px]">
                <p className="text-sm font-medium text-neutral-900 mb-1">{option.label}</p>
                <ul className="text-sm text-neutral-700 space-y-1">
                  {(products[option.value] || []).map((product) => (
                    <li key={product.id} className="flex justify-between gap-2">
                      <span className="font-mono text-xs">{product.id}</span>
                      <span className="text-xs text-neutral-600 truncate">{product.name}</span>
                    </li>
                  ))}
                  {(products[option.value] || []).length === 0 && (
                    <li className="text-xs text-neutral-500">{texts.admin.images.noProducts}</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
