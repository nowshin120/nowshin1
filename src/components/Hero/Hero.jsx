import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../context/LanguageContext';
import { SHOP_CATEGORIES, getCategoryLabel } from '../../constants/shopCategories';

export default function Hero({ activeCategory, onCategoryChange }) {
  const [bannerText, setBannerText] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [bannerActive, setBannerActive] = useState(true);
  const { language } = useLanguage();
  const isEnglish = language === 'en';

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
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#1e1b4b_0%,#312e81_38%,#1d4ed8_100%)]" />
          )}

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.55)_0%,rgba(15,23,42,0.28)_34%,rgba(15,23,42,0.08)_60%,rgba(15,23,42,0.10)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/35 to-transparent" />

          <div className="relative mx-auto flex min-h-[320px] max-w-7xl items-end px-4 py-10 sm:min-h-[420px] sm:px-6 sm:py-14 lg:min-h-[520px] lg:px-8 lg:py-16">
            {bannerText ? (
              <div className="max-w-2xl">
                <div className="rounded-[28px] border border-white/10 bg-black/10 p-5 backdrop-blur-[2px] sm:p-7 lg:p-8">
                  <h1 className="whitespace-pre-line text-3xl font-semibold leading-[1.06] text-white sm:text-4xl lg:text-6xl">
                    {bannerText}
                  </h1>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
                    {isEnglish
                      ? 'Elegant fashion pieces for everyday style, festive looks, and timeless deshi taste.'
                      : 'প্রতিদিনের স্টাইল, উৎসবের সাজ আর দেশি আভিজাত্যের জন্য বাছাইকৃত ফ্যাশন কালেকশন।'}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => onCategoryChange('all')}
                      className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      {isEnglish ? 'See All Products' : 'সব পণ্য দেখুন'}
                    </button>

                    {SHOP_CATEGORIES.filter((category) => category.slug !== 'all')
                      .slice(0, 4)
                      .map((category) => (
                        <button
                          key={category.slug}
                          type="button"
                          onClick={() => onCategoryChange(category.slug)}
                          className={[
                            'rounded-full border px-4 py-2.5 text-sm font-medium transition-all',
                            activeCategory === category.slug
                              ? 'border-white bg-white text-slate-950'
                              : 'border-white/25 bg-white/10 text-white hover:border-white/40 hover:bg-white/14',
                          ].join(' ')}
                        >
                          {getCategoryLabel(category, language)}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      )}
    </>
  );
}
