import { useCallback, useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard/ProductCard';
import CheckoutModal from '../components/CheckoutModal/CheckoutModal';
import { SHOP_CATEGORIES, getCategoryLabel } from '../constants/shopCategories';

export default function HomePage({ activeCategory, onCategoryChange }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  const loadProducts = useCallback(async (category) => {
    setLoading(true);

    let query = supabase
      .from('products')
      .select('*')
      .eq('is_in_stock', true)
      .order('created_at', { ascending: false });

    if (category !== 'all') {
      query = query.eq('category_slug', category);
    }

    const { data, error } = await query;

    if (error) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setProducts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProducts(activeCategory);
  }, [activeCategory, loadProducts]);

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };

  const activeCategoryMeta = SHOP_CATEGORIES.find(
    (category) => category.slug === activeCategory
  );

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[250px,minmax(0,1fr)] xl:grid-cols-[280px,minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
              <div className="border-b border-slate-100 px-5 py-6">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">
                  {isEnglish ? 'Browse' : 'ব্রাউজ'}
                </p>
                <h2 className="mt-2 text-xl font-semibold leading-8 text-slate-950">
                  {isEnglish ? 'Shop by category' : 'ক্যাটাগরি অনুযায়ী দেখুন'}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {isEnglish
                    ? 'Pick a category to quickly filter the collection.'
                    : 'দ্রুত পণ্য ফিল্টার করতে একটি ক্যাটাগরি বেছে নিন।'}
                </p>
              </div>

              <nav className="p-3">
                {SHOP_CATEGORIES.map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => onCategoryChange(category.slug)}
                    className={[
                      'mb-2 w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all',
                      activeCategory === category.slug
                        ? 'bg-slate-950 text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-50',
                    ].join(' ')}
                  >
                    {getCategoryLabel(category, language)}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <main className="min-w-0">
            <div className="rounded-[30px] border border-slate-200 bg-white px-5 py-5 shadow-[0_18px_46px_rgba(15,23,42,0.05)] sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">
                    {isEnglish ? 'Current view' : 'বর্তমান ভিউ'}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-4xl">
                    {getCategoryLabel(activeCategoryMeta, language)}
                  </h2>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  {loading
                    ? isEnglish
                      ? 'Loading products...'
                      : 'পণ্য লোড হচ্ছে...'
                    : isEnglish
                      ? `${products.length} items available`
                      : `${products.length}টি পণ্য পাওয়া গেছে`}
                </div>
              </div>
            </div>

            <div className="mt-6">
              {loading ? (
                <div className="flex justify-center py-28">
                  <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-slate-950 border-t-transparent" />
                </div>
              ) : products.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-slate-200 bg-white py-20 text-center">
                  <Package size={42} className="mx-auto mb-4 text-slate-200" />
                  <p className="text-slate-500">
                    {isEnglish
                      ? 'No products have been added to this category yet.'
                      : 'এই ক্যাটাগরিতে এখনো কোনো পণ্য যোগ করা হয়নি।'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onBuyNow={handleBuyNow}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        productName={selectedProduct?.name}
        productPrice={
          selectedProduct ? `৳${Number(selectedProduct.price).toLocaleString()}` : ''
        }
      />
    </>
  );
}
