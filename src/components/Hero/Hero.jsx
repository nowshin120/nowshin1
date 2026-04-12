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
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden sm:rounded-[28px] sm:shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
              {bannerImage ? (
                <img
                  src={bannerImage}
                  alt="Nowshin Fashion banner"
                  className="h-[220px] w-full object-cover object-center sm:h-[320px] lg:h-[440px]"
                />
              ) : (
                <div className="h-[220px] bg-[linear-gradient(135deg,#f8fafc_0%,#e0e7ff_55%,#dbeafe_100%)] sm:h-[320px] lg:h-[440px]" />
              )}

              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0.05)_35%,rgba(15,23,42,0.04)_100%)]" />

              {bannerText ? (
                <div className="absolute left-4 right-4 bottom-4 sm:left-6 sm:bottom-6 lg:left-8 lg:bottom-8">
                  <div className="max-w-xl rounded-[24px] border border-white/70 bg-white/78 px-4 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur-md sm:px-5 sm:py-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">
                      {isEnglish ? 'Featured banner' : 'ফিচার্ড ব্যানার'}
                    </p>
                    <h1 className="mt-2 text-xl font-semibold leading-tight text-slate-950 sm:text-2xl lg:text-4xl">
                      {bannerText}
                    </h1>
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
