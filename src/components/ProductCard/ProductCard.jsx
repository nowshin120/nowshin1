import { ArrowRight, Package, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SHOP_CATEGORIES, getCategoryLabel } from '../../constants/shopCategories';

export default function ProductCard({ product, onBuyNow }) {
  const { language, t } = useLanguage();
  const imageUrl = product.image_url || product.image || null;
  const deliveryCharge = product.delivery_charge ?? product.deliveryCharge ?? null;

  const categoryMeta = SHOP_CATEGORIES.find(
    (category) => category.slug === product.category_slug
  );

  let deliveryText = null;

  if (deliveryCharge === 0 || deliveryCharge === '0') {
    deliveryText =
      language === 'en' ? 'Free delivery available' : 'ফ্রি ডেলিভারি উপলব্ধ';
  } else if (deliveryCharge) {
    deliveryText =
      language === 'en'
        ? `Delivery: ৳${Number(deliveryCharge).toLocaleString()}`
        : `ডেলিভারি: ৳${Number(deliveryCharge).toLocaleString()}`;
  } else {
    deliveryText =
      language === 'en'
        ? 'Delivery charge shown at checkout'
        : 'চেকআউটে ডেলিভারি চার্জ দেখানো হবে';
  }

  return (
    <div className="group overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="absolute inset-x-4 top-4 z-20 flex items-center justify-between gap-3">
          <div className="rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm">
            {t('checkout.cod')}
          </div>

          {categoryMeta ? (
            <div className="rounded-full border border-white/60 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur-sm">
              {getCategoryLabel(categoryMeta, language)}
            </div>
          ) : null}
        </div>

        <div className="relative h-64 overflow-hidden sm:h-72">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextElementSibling) {
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }
              }}
            />
          ) : null}

          <div
            className="h-full w-full items-center justify-center flex-col gap-2 text-gray-300"
            style={{ display: imageUrl ? 'none' : 'flex' }}
          >
            <Package size={48} />
            <span className="text-sm text-gray-400">
              {language === 'en' ? 'No image available' : 'কোনো ছবি নেই'}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/20 to-transparent" />
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold leading-7 text-charcoal transition-colors group-hover:text-slate-950">
              {product.name}
            </h3>

            {product.description ? (
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                {product.description}
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl bg-slate-50 px-3 py-2 text-right">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              {language === 'en' ? 'Price' : 'দাম'}
            </div>
            <div className="mt-1 text-2xl font-bold text-blue-600">
              ৳{Number(product.price).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mb-5 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <span
            className={
              deliveryCharge === 0 || deliveryCharge === '0'
                ? 'font-medium text-emerald-600'
                : ''
            }
          >
            {deliveryText}
          </span>
        </div>

        <button
          onClick={() => onBuyNow(product)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-blue-600"
        >
          <ShoppingCart size={18} />
          {t('checkout.buyNow')}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
