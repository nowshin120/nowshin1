import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../context/LanguageContext';
import { SHOP_CATEGORIES, getCategoryLabel } from '../../constants/shopCategories';

export default function Hero({ activeCategory, onCategoryChange }) {
  const [bannerText, setBannerText] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [bannerActive, setBannerActive] = useState(true);
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  const featuredCategories = useMemo(
    () => SHOP_CATEGORIES.filter((category) => category.slug !== 'all').slice(0, 4),
    []
  );

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('key,value')
      .in('key', ['banner_text', 'banner_image_url', 'banner_active'])
      .then(({ data }) => {
        if (!data) return;

        data.forEach((setting) => {
          if (setting.key === 'banner_text') setBannerText(setting.value ?? '');
          if (setting.key === 'banner_image_url') setBannerImage(setting.value ?? '');
          if (setting.key === 'banner_active') setBannerActive(setting.value !== 'false');
        });
      });
  }, []);

  return (
    <>
      <div className="sticky top-20 z-30 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
        <div
          className="flex items-center gap-2 overflow-x-auto px-4 py-3"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {SHOP_CATEGORIES.map((category) => (
            <button
              key={category.slug}
              onClick={() => onCategoryChange(category.slug)}
              className={[
                'whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all',
                activeCategory === category.slug
                  ? 'border-slate-950 bg-slate-950 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600',
              ].join(' ')}
            >
              {getCategoryLabel(category, language)}
            </button>
          ))}
        </div>
      </div>

      {bannerActive && (
        <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
          {bannerImage ? (
            <img
              src={bannerImage}
              alt="Nowshin Fashion banner"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.38),_transparent_28%),linear-gradient(135deg,#0f172a_0%,#1e293b_55%,#111827_100%)]" />
          )}

          <div className="absolute inset-0 bg-[linear-gradient(95deg,rgba(2,6,23,0.86)_0%,rgba(2,6,23,0.58)_40%,rgba(2,6,23,0.24)_66%,rgba(2,6,23,0.30)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/70 to-transparent" />

          <div className="relative mx-auto flex min-h-[360px] max-w-7xl items-end px-4 py-10 sm:min-h-[440px] sm:px-6 sm:py-14 lg:min-h-[560px] lg:px-8 lg:py-16">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80 backdrop-blur-sm sm:text-xs">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-300" />
                {isEnglish ? 'Curated fashion collection' : 'বাছাইকৃত ফ্যাশন কালেকশন'}
              </div>

              {bannerText ? (
                <div className="rounded-[30px] border border-white/12 bg-black/20 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.26)] backdrop-blur-md sm:p-7 lg:p-8">
                  <h1 className="whitespace-pre-line text-3xl font-semibold leading-[1.08] text-white sm:text-4xl lg:text-6xl">
                    {bannerText}
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                    {isEnglish
                      ? 'Modern silhouettes, timeless deshi elegance, and everyday statement pieces gathered in one refined storefront.'
                      : 'আধুনিক কাট, দেশি সৌন্দর্য আর প্রতিদিনের স্টেটমেন্ট পিস এক জায়গায় সাজানো একটি পরিপাটি সংগ্রহ।'}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => onCategoryChange('all')}
                      className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      {isEnglish ? 'Explore All Products' : 'সব পণ্য দেখুন'}
                    </button>

                    {featuredCategories.map((category) => (
                      <button
                        key={category.slug}
                        type="button"
                        onClick={() => onCategoryChange(category.slug)}
                        className={[
                          'rounded-full border px-4 py-2.5 text-sm font-medium backdrop-blur-sm transition-all',
                          activeCategory === category.slug
                            ? 'border-white bg-white text-slate-950'
                            : 'border-white/25 bg-white/8 text-white hover:border-white/45 hover:bg-white/12',
                        ].join(' ')}
                      >
                        {getCategoryLabel(category, language)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
