import { ArrowRight, Package, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { findCategoryBySlug, getCategoryLabel } from '../../constants/shopCategories';

export default function ProductCard({ product, onBuyNow }) {
  const { language, t } = useLanguage();
  const imageUrl = product.image_url || product.image || null;
  const deliveryCharge = product.delivery_charge ?? product.deliveryCharge ?? null;

  const categoryMeta = findCategoryBySlug(product.category_slug);

  let deliveryText = null;
  let isFreeDelivery = false;

  if (deliveryCharge === 0 || deliveryCharge === '0') {
    isFreeDelivery = true;
    deliveryText = language === 'en' ? 'Free delivery' : 'ফ্রি ডেলিভারি';
  } else if (deliveryCharge) {
    deliveryText =
      language === 'en'
        ? `Delivery: ৳${Number(deliveryCharge).toLocaleString()}`
        : `ডেলিভারি: ৳${Number(deliveryCharge).toLocaleString()}`;
  } else {
    deliveryText = language === 'en' ? 'Delivery at checkout' : 'চেকআউটে ডেলিভারি';
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-[0_6px_24px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(15,23,42,0.13)]">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="absolute inset-x-2 top-2 z-20 flex items-start justify-between gap-2 sm:inset-x-3 sm:top-3">
          <div className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm sm:px-3 sm:py-1 sm:text-[11px]">
            {language === 'en' ? 'COD' : 'ক্যাশ অন ডেলিভারি'}
          </div>
          {categoryMeta ? (
            <div
              className={[
                'rounded-full border border-white/60 px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm sm:px-2.5 sm:text-xs',
                categoryMeta.badgeClass || 'bg-white/85 text-slate-600',
              ].join(' ')}
            >
              {getCategoryLabel(categoryMeta, language)}
            </div>
          ) : null}
        </div>

        <div className="aspect-[4/3] w-full overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const sibling = e.currentTarget.nextElementSibling;
                if (sibling) sibling.style.display = 'flex';
              }}
            />
          ) : null}

          <div
            className="h-full w-full flex-col items-center justify-center gap-2 text-slate-300"
            style={{ display: imageUrl ? 'none' : 'flex' }}
          >
            <Package size={36} />
            <span className="text-xs text-slate-400">
              {language === 'en' ? 'No image' : 'ছবি নেই'}
            </span>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/15 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="flex-1 text-sm font-bold leading-snug text-slate-900 line-clamp-2 sm:text-base">
            {product.name}
          </h3>
          <div className="shrink-0 text-right">
            <div className="text-base font-extrabold text-blue-600 sm:text-lg">
              ৳{Number(product.price).toLocaleString()}
            </div>
          </div>
        </div>

        {product.description ? (
          <p className="mb-2 line-clamp-2 text-[11px] leading-5 text-slate-500 sm:text-xs">
            {product.description}
          </p>
        ) : null}

        <div
          className={[
            'mb-3 rounded-xl px-3 py-1.5 text-[11px] font-medium sm:text-xs',
            isFreeDelivery
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-slate-50 text-slate-500',
          ].join(' ')}
        >
          {deliveryText}
        </div>

        <button
          onClick={() => onBuyNow(product)}
          className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-[14px] bg-slate-950 py-2.5 text-xs font-bold text-white transition-all duration-200 hover:bg-blue-600 active:scale-95 sm:gap-2 sm:py-3 sm:text-sm"
        >
          <ShoppingCart size={14} className="shrink-0 sm:hidden" />
          <ShoppingCart size={16} className="hidden shrink-0 sm:block" />
          {t('checkout.buyNow')}
          <ArrowRight size={13} className="shrink-0 sm:hidden" />
          <ArrowRight size={15} className="hidden shrink-0 sm:block" />
        </button>
      </div>
    </div>
  );
}
