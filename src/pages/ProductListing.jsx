import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard/ProductCard';
import { findCategoryBySlug, getCategoryLabel } from '../constants/shopCategories';

export default function ProductListing() {
  const { category } = useParams();
  const { language } = useLanguage();
  const { addToCart, buyNow } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const matchedCategory = findCategoryBySlug(category);
  const categoryTitle = getCategoryLabel(matchedCategory, language) || category;

  useEffect(() => {
    setLoading(true);

    supabase
      .from('products')
      .select('*')
      .eq('category_slug', category)
      .eq('is_in_stock', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProducts(data ?? []);
        setLoading(false);
      });
  }, [category]);

  return (
    <div className="min-h-screen bg-soft-white">
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-900 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="mb-6 inline-flex items-center text-white/85 transition-colors hover:text-white"
          >
            <ArrowLeft size={20} className="mr-2" />
            {language === 'en' ? 'Back to Home' : 'হোমে ফিরে যান'}
          </Link>

          <h1 className="mb-2 text-4xl font-bold">{categoryTitle}</h1>
          <p className="text-blue-100">
            {loading
              ? language === 'en'
                ? 'Loading products...'
                : 'পণ্য লোড হচ্ছে...'
              : language === 'en'
                ? `${products.length} products found`
                : `${products.length}টি পণ্য পাওয়া গেছে`}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onBuyNow={buyNow}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <Package size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="mb-2 text-lg text-gray-500">
              {language === 'en'
                ? 'No products are available in this category yet.'
                : 'এই ক্যাটাগরিতে এখনো কোনো পণ্য নেই।'}
            </p>
            <Link to="/" className="mt-2 inline-block text-blue-600 hover:underline">
              {language === 'en' ? 'Return Home' : 'হোমে ফিরুন'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
