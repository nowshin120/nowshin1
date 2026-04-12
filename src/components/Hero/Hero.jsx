/// src/components/Hero/Hero.jsx ///
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
      {/* Mobile Category Pills — sticky below header */}
      <div className="sticky top-16 z-30 border-b border-slate-100 bg-white/98 backdrop-blur-md lg:hidden">
        <div
          className="flex items-center gap-2 overflow-x-auto px-4 py-2.5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {SHOP_CATEGORIES.map((category) => (
            <button
              key={category.slug}
              onClick={() => onCategoryChange(category.slug)}
              className={[
                'whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 active:scale-95',
                activeCategory === category.slug
                  ? 'border-slate-950 bg-slate-950 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
              ].join(' ')}
            >
              {getCategoryLabel(category, language)}
            </button>
          ))}
        </div>
      </div>

      {/* Banner */}
      {bannerActive && (
        <section className="bg-white pb-0 pt-0">
          <div className="mx-auto max-w-7xl sm:px-6 sm:py-4 lg:px-8 lg:py-6">
            <div className="relative overflow-hidden sm:rounded-[24px] sm:shadow-[0_16px_56px_rgba(15,23,42,0.12)]">
              {bannerImage ? (
                <img
                  src={bannerImage}
                  alt="Nowshin Fashion banner"
                  className="h-[200px] w-full object-cover object-center sm:h-[300px] lg:h-[420px]"
                />
              ) : (
                <div className="h-[200px] bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 sm:h-[300px] lg:h-[420px]" />
              )}

              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 via-transparent to-transparent" />

              {bannerText ? (
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8">
                  <div className="max-w-sm rounded-[20px] border border-white/60 bg-white/80 px-4 py-3 shadow-lg backdrop-blur-md sm:px-5 sm:py-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
                      {isEnglish ? 'Featured' : 'ফিচার্ড'}
                    </p>
                    <h1 className="mt-1 text-lg font-bold leading-tight text-slate-950 sm:text-2xl lg:text-3xl">
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
