import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../context/LanguageContext';
import { SHOP_CATEGORIES, getCategoryLabel } from '../../constants/shopCategories';

export default function Hero({ activeCategory, onCategoryChange }) {
  const [bannerText, setBannerText] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [bannerActive, setBannerActive] = useState(true);
  const { language } = useLanguage();

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

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.78)_0%,rgba(2,6,23,0.52)_42%,rgba(2,6,23,0.18)_100%)]" />

          <div className="relative mx-auto flex min-h-[320px] max-w-7xl items-end px-4 py-10 sm:min-h-[420px] sm:px-6 sm:py-14 lg:min-h-[520px] lg:px-8 lg:py-16">
            {bannerText ? (
              <div className="max-w-2xl rounded-[28px] border border-white/15 bg-black/20 p-5 backdrop-blur-sm sm:p-7">
                <h1 className="whitespace-pre-line text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-6xl">
                  {bannerText}
                </h1>
              </div>
            ) : null}
          </div>
        </section>
      )}
    </>
  );
}
