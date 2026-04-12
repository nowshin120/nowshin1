/// src/pages/HomePage.jsx ///
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

    setProducts(error ? [] : (data ?? []));
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
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[240px,minmax(0,1fr)] xl:grid-cols-[260px,minmax(0,1fr)]">

          {/* ── Desktop Left Sidebar ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.07)]">
              <div className="border-b border-slate-100 px-5 py-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
                  {isEnglish ? 'Browse' : 'ব্রাউজ'}
                </p>
                <h2 className="mt-1.5 text-lg font-bold text-slate-950">
                  {isEnglish ? 'Shop by Category' : 'ক্যাটাগরি অনুযায়ী দেখুন'}
                </h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {isEnglish
                    ? 'Pick a category to filter the collection.'
                    : 'দ্রুত পণ্য ফিল্টার করতে ক্যাটাগরি বেছে নিন।'}
                </p>
              </div>

              <nav className="p-2.5">
                {SHOP_CATEGORIES.map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => onCategoryChange(category.slug)}
                    className={[
                      'mb-1 w-full rounded-[14px] px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 active:scale-[0.98]',
                      activeCategory === category.slug
                        ? 'bg-slate-950 text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950',
                    ].join(' ')}
                  >
                    {getCategoryLabel(category, language)}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <main className="min-w-0">
            {/* Section header */}
            <div className="mb-5 flex flex-col gap-3 rounded-[20px] border border-slate-200 bg-white px-5 py-4 shadow-[0_4px_20px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
                  {isEnglish ? 'Current view' : 'বর্তমান ভিউ'}
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl lg:text-3xl">
                  {getCategoryLabel(activeCategoryMeta, language)}
                </h2>
              </div>

              <div className="shrink-0 rounded-xl bg-slate-50 px-4 py-2 text-sm text-slate-500">
                {loading
                  ? isEnglish ? 'Loading…' : 'লোড হচ্ছে…'
                  : isEnglish
                    ? `${products.length} items available`
                    : `${products.length}টি পণ্য পাওয়া গেছে`}
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="flex justify-center py-24">
                <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-slate-950 border-t-transparent" />
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-200 bg-white py-20 text-center">
                <Package size={40} className="mx-auto mb-3 text-slate-200" />
                <p className="text-sm text-slate-400">
                  {isEnglish
                    ? 'No products in this category yet.'
                    : 'এই ক্যাটাগরিতে এখনো কোনো পণ্য নেই।'}
                </p>
              </div>
            ) : (
              /*
               * Mobile:  2 columns (compact cards via aspect-ratio image)
               * Tablet:  2-3 columns
               * Desktop: 3 columns (sidebar takes space)
               * XL:      4 columns
               */
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onBuyNow={handleBuyNow}
                  />
                ))}
              </div>
            )}
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
