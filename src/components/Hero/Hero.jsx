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
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          {bannerImage ? (
            <img
              src={bannerImage}
              alt="Nowshin Fashion banner"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8fafc_0%,#e0e7ff_50%,#dbeafe_100%)]" />
          )}

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.08)_24%,rgba(255,255,255,0.02)_44%,rgba(15,23,42,0.08)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/30 to-transparent" />

          <div className="relative mx-auto flex min-h-[280px] max-w-7xl items-end px-4 py-8 sm:min-h-[360px] sm:px-6 sm:py-10 lg:min-h-[460px] lg:px-8 lg:py-12">
            {bannerText ? (
              <div className="max-w-xl rounded-[28px] border border-white/60 bg-white/72 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-md sm:p-6 lg:p-7">
                <h1 className="whitespace-pre-line text-3xl font-semibold leading-[1.08] text-slate-950 sm:text-4xl lg:text-5xl">
                  {bannerText}
                </h1>

                <p className="mt-3 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
                  {isEnglish
                    ? 'Elegant fashion pieces for everyday wear and festive style.'
                    : 'প্রতিদিনের পরা আর উৎসবের স্টাইলের জন্য বাছাইকৃত ফ্যাশন কালেকশন।'}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => onCategoryChange('all')}
                    className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
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
                            ? 'border-slate-950 bg-slate-950 text-white'
                            : 'border-slate-300 bg-white/80 text-slate-700 hover:border-slate-950 hover:text-slate-950',
                        ].join(' ')}
                      >
                        {getCategoryLabel(category, language)}
                      </button>
                    ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      )}
    </>
  );
}
