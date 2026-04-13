import { useCallback, useEffect, useMemo, useState } from 'react';
import { Package, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard/ProductCard';
import {
  SHOP_CATEGORIES,
  findCategoryBySlug,
  getCategoryLabel,
} from '../constants/shopCategories';

export default function HomePage({ activeCategory, onSearchChange, searchQuery }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const { addToCart, buyNow } = useCart();
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
    setProducts(error ? [] : data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProducts(activeCategory);
  }, [activeCategory, loadProducts]);

  const activeCategoryMeta =
    findCategoryBySlug(activeCategory) ||
    SHOP_CATEGORIES.find((category) => category.slug === 'all');

  const filteredProducts = useMemo(() => {
    const keyword = searchQuery?.trim().toLowerCase();
    if (!keyword) return products;

    return products.filter((product) => {
      const name = product.name?.toLowerCase() || '';
      const description = product.description?.toLowerCase() || '';
      return name.includes(keyword) || description.includes(keyword);
    });
  }, [products, searchQuery]);

  const countText = loading
    ? isEnglish
      ? 'Loading...'
      : 'লোড হচ্ছে...'
    : isEnglish
      ? `${filteredProducts.length} items available`
      : `${filteredProducts.length}টি পণ্য পাওয়া গেছে`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 pb-28 sm:px-6 sm:py-5 sm:pb-32 lg:px-8 lg:py-5 lg:pb-8">
      <main id="products-section" className="min-w-0">
        <div className="mb-5 flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-white px-5 py-4 shadow-[0_4px_20px_rgba(15,23,42,0.05)] sm:px-6">
          <div className="hidden items-start justify-between gap-5 lg:flex">
            <div className="min-w-0 flex-1">
              <div className="relative max-w-xl">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder={isEnglish ? 'Search products...' : 'পণ্য খুঁজুন...'}
                  className="w-full rounded-[18px] border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-300"
                />
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
                  {isEnglish ? 'Current view' : 'বর্তমান ভিউ'}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                  {getCategoryLabel(activeCategoryMeta, language)}
                </span>
              </div>
            </div>

            <div className="shrink-0 rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-500">
              {countText}
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:hidden">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
                {isEnglish ? 'Current view' : 'বর্তমান ভিউ'}
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl">
                {getCategoryLabel(activeCategoryMeta, language)}
              </h2>
              {searchQuery ? (
                <p className="mt-1 text-sm text-slate-500">
                  {isEnglish ? `Search: "${searchQuery}"` : `সার্চ: "${searchQuery}"`}
                </p>
              ) : null}
            </div>

            <div className="shrink-0 rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-500">
              {countText}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-slate-950 border-t-transparent" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-white py-20 text-center">
            <Package size={40} className="mx-auto mb-3 text-slate-200" />
            <p className="text-sm text-slate-400">
              {searchQuery
                ? isEnglish
                  ? 'No products matched your search.'
                  : 'আপনার সার্চ অনুযায়ী কোনো পণ্য পাওয়া যায়নি।'
                : isEnglish
                  ? 'No products in this category yet.'
                  : 'এই ক্যাটাগরিতে এখনো কোনো পণ্য নেই।'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onBuyNow={buyNow}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
