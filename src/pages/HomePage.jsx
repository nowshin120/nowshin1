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
        <div className="grid gap-6 lg:grid-cols-[240px,minmax(0,1fr)] xl:grid-cols-[280px,minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_48px_rgba(15,23,42,0.08)]">
              <div className="border-b border-slate-100 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_45%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-5 py-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  {language === 'en' ? 'Browse' : 'ব্রাউজ'}
                </p>
                <h2 className="mt-2 text-lg font-semibold text-slate-950">
                  {language === 'en'
                    ? 'Choose a category from the left'
                    : 'বাম পাশ থেকে ক্যাটাগরি বেছে নিন'}
                </h2>
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
            <div className="mb-6 rounded-[32px] border border-slate-200 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.10),_transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-5 py-5 shadow-[0_18px_46px_rgba(15,23,42,0.05)] sm:px-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    {language === 'en' ? 'Current View' : 'বর্তমান ভিউ'}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">
                    {getCategoryLabel(activeCategoryMeta, language)}
                  </h2>
                </div>

                <div className="text-sm text-slate-500">
                  {loading
                    ? language === 'en'
                      ? 'Loading products...'
                      : 'পণ্য লোড হচ্ছে...'
                    : language === 'en'
                      ? `${products.length} items available`
                      : `${products.length}টি পণ্য পাওয়া গেছে`}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-28">
                <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-slate-950 border-t-transparent" />
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-slate-200 bg-white py-20 text-center">
                <Package size={42} className="mx-auto mb-4 text-slate-200" />
                <p className="text-slate-500">
                  {language === 'en'
                    ? 'No products have been added to this category yet.'
                    : 'এই ক্যাটাগরিতে এখনো কোনো পণ্য যোগ করা হয়নি।'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
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
